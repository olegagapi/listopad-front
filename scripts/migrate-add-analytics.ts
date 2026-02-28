/**
 * Migration: Add is_active column to products and create analytics_events table
 *
 * Uses the Supabase secret key to execute DDL via PostgREST RPC,
 * or falls back to direct SQL verification.
 *
 * Usage:
 *   pnpm tsx scripts/migrate-add-analytics.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Extract project ref from URL
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];

const MIGRATION_STATEMENTS = [
  {
    name: 'Add is_active column to products',
    sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;',
  },
  {
    name: 'Create analytics_events table',
    sql: `CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  brand_id INTEGER NOT NULL REFERENCES brands(id),
  product_id INTEGER REFERENCES products(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
  },
  {
    name: 'Create index idx_analytics_brand_date',
    sql: 'CREATE INDEX IF NOT EXISTS idx_analytics_brand_date ON analytics_events (brand_id, created_at);',
  },
  {
    name: 'Create index idx_analytics_type',
    sql: 'CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events (event_type);',
  },
];

async function executeSql(sql: string): Promise<{ success: boolean; error?: string }> {
  // Use the Supabase SQL endpoint (available with service/secret key)
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey!,
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (response.ok) {
    return { success: true };
  }

  // If exec_sql RPC doesn't exist, try the Supabase pg_net approach
  // or the direct SQL API
  const errorText = await response.text();

  // Try alternative: use the /pg/query endpoint (Supabase v2)
  const pgResponse = await fetch(`${supabaseUrl}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey!,
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (pgResponse.ok) {
    return { success: true };
  }

  return { success: false, error: errorText };
}

async function runMigration(): Promise<void> {
  console.log('Running migration: is_active + analytics_events\n');
  console.log(`Project: ${projectRef}`);
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key type: ${process.env.SUPABASE_SECRET_KEY ? 'secret' : process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon'}\n`);

  let allSucceeded = true;

  for (const stmt of MIGRATION_STATEMENTS) {
    process.stdout.write(`  ${stmt.name}... `);
    const result = await executeSql(stmt.sql);

    if (result.success) {
      console.log('OK');
    } else {
      console.log('FAILED');
      console.error(`    ${result.error}`);
      allSucceeded = false;
    }
  }

  if (!allSucceeded) {
    console.log('\nSome statements failed. Checking current state...\n');
  }

  // Verify final state
  console.log('\nVerification:');

  const { error: colErr } = await supabase.from('products').select('is_active').limit(1);
  if (colErr) {
    console.log(`  products.is_active: MISSING (${colErr.message})`);
  } else {
    console.log('  products.is_active: OK');
  }

  const { error: tableErr } = await supabase.from('analytics_events').select('id').limit(1);
  if (tableErr) {
    console.log(`  analytics_events: MISSING (${tableErr.message})`);
  } else {
    console.log('  analytics_events: OK');
  }

  if (colErr || tableErr) {
    console.log('\n--- Manual SQL (run in Supabase SQL Editor) ---\n');
    for (const stmt of MIGRATION_STATEMENTS) {
      console.log(stmt.sql);
    }
    console.log('\n------------------------------------------------');
  } else {
    console.log('\nAll migrations applied successfully!');
  }
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
