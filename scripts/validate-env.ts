/**
 * Environment validation script
 *
 * Validates that all required environment variables are set.
 * Run with: pnpm validate-env
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local for local development
config({ path: resolve(process.cwd(), '.env.local') });

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

const ENV_VARS: EnvVar[] = [
  {
    name: 'NEXT_PUBLIC_LISTOPAD__SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
  },
  {
    name: 'NEXT_PUBLIC_LISTOPAD__SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anon (public) key',
  },
  {
    name: 'LISTOPAD__SUPABASE_SERVICE_ROLE_KEY',
    required: false,
    description: 'Supabase service role key (for admin operations)',
  },
];

function validateEnv(): void {
  console.log('Validating environment variables...\n');

  const errors: string[] = [];
  const warnings: string[] = [];

  for (const envVar of ENV_VARS) {
    const value = process.env[envVar.name];

    if (!value || value.trim() === '') {
      if (envVar.required) {
        errors.push(`Missing required: ${envVar.name} - ${envVar.description}`);
      } else {
        warnings.push(`Missing optional: ${envVar.name} - ${envVar.description}`);
      }
    } else {
      console.log(`✓ ${envVar.name}`);
    }
  }

  // Additional validation for URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_LISTOPAD__SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    errors.push('NEXT_PUBLIC_LISTOPAD__SUPABASE_URL must start with https://');
  }

  console.log('');

  if (warnings.length > 0) {
    console.log('Warnings:');
    for (const warning of warnings) {
      console.log(`  ⚠ ${warning}`);
    }
    console.log('');
  }

  if (errors.length > 0) {
    console.log('Errors:');
    for (const error of errors) {
      console.log(`  ✗ ${error}`);
    }
    console.log('\nTo fix: Copy .env.example to .env.local and fill in your Supabase credentials.');
    process.exit(1);
  }

  console.log('All required environment variables are set.');
}

validateEnv();
