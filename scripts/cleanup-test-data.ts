/**
 * Cleanup script for test data created during E2E testing.
 *
 * This script removes test users, brand managers, and brands that were created
 * during test runs. It identifies test data by the email pattern:
 * test-*@listopad.test
 *
 * Usage:
 *   pnpm test:cleanup
 *
 * Requirements:
 *   - SUPABASE_SERVICE_ROLE_KEY must be set in .env.local
 *   - The service role key has admin access to delete auth users
 */

import 'dotenv/config';
import { createClient, type User } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TEST_EMAIL_PATTERN = '%@listopad.test';

interface CleanupStats {
  brandsDeleted: number;
  brandManagersDeleted: number;
  authUsersDeleted: number;
  errors: string[];
}

async function cleanupTestData(): Promise<CleanupStats> {
  const stats: CleanupStats = {
    brandsDeleted: 0,
    brandManagersDeleted: 0,
    authUsersDeleted: 0,
    errors: [],
  };

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing required environment variables:');
    if (!SUPABASE_URL) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
    if (!SERVICE_ROLE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create admin client with service role key
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('Starting test data cleanup...\n');

  // Step 1: Find all test users in auth.users
  console.log('Finding test users...');
  const {
    data: { users },
    error: listError,
  } = await supabase.auth.admin.listUsers();

  if (listError || !users) {
    stats.errors.push(`Failed to list users: ${listError?.message ?? 'No users returned'}`);
    console.error('Error listing users:', listError?.message ?? 'No users returned');
    return stats;
  }

  const testUsers: User[] = users.filter(
    (user: User) => user.email?.endsWith('@listopad.test') && user.email.startsWith('test-')
  );

  console.log(`Found ${testUsers.length} test user(s)\n`);

  if (testUsers.length === 0) {
    console.log('No test data to clean up.');
    return stats;
  }

  // Step 2: For each test user, find and delete associated data
  for (const user of testUsers) {
    console.log(`Processing user: ${user.email}`);

    // Find brand_manager record for this user
    const { data: manager, error: managerError } = await supabase
      .from('brand_managers')
      .select('id, brand_id')
      .eq('user_id', user.id)
      .single();

    if (managerError && managerError.code !== 'PGRST116') {
      // PGRST116 = not found
      stats.errors.push(`Error finding manager for ${user.email}: ${managerError.message}`);
      console.error(`  Error finding manager: ${managerError.message}`);
    }

    // Delete brand if exists
    if (manager?.brand_id) {
      const { error: brandDeleteError } = await supabase
        .from('brands')
        .delete()
        .eq('id', manager.brand_id);

      if (brandDeleteError) {
        stats.errors.push(
          `Error deleting brand ${manager.brand_id}: ${brandDeleteError.message}`
        );
        console.error(`  Error deleting brand: ${brandDeleteError.message}`);
      } else {
        stats.brandsDeleted++;
        console.log(`  Deleted brand: ${manager.brand_id}`);
      }
    }

    // Delete brand_manager record if exists
    if (manager) {
      const { error: managerDeleteError } = await supabase
        .from('brand_managers')
        .delete()
        .eq('id', manager.id);

      if (managerDeleteError) {
        stats.errors.push(
          `Error deleting manager ${manager.id}: ${managerDeleteError.message}`
        );
        console.error(`  Error deleting manager: ${managerDeleteError.message}`);
      } else {
        stats.brandManagersDeleted++;
        console.log(`  Deleted brand_manager: ${manager.id}`);
      }
    }

    // Delete auth user
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (authDeleteError) {
      stats.errors.push(`Error deleting auth user ${user.email}: ${authDeleteError.message}`);
      console.error(`  Error deleting auth user: ${authDeleteError.message}`);
    } else {
      stats.authUsersDeleted++;
      console.log(`  Deleted auth user: ${user.email}`);
    }

    console.log('');
  }

  return stats;
}

async function main(): Promise<void> {
  try {
    const stats = await cleanupTestData();

    console.log('='.repeat(50));
    console.log('Cleanup Summary:');
    console.log(`  Auth users deleted: ${stats.authUsersDeleted}`);
    console.log(`  Brand managers deleted: ${stats.brandManagersDeleted}`);
    console.log(`  Brands deleted: ${stats.brandsDeleted}`);

    if (stats.errors.length > 0) {
      console.log(`\nErrors (${stats.errors.length}):`);
      stats.errors.forEach((error) => console.log(`  - ${error}`));
      process.exit(1);
    }

    console.log('\nCleanup completed successfully!');
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

main();
