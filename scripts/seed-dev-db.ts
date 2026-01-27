/**
 * Database seeding script for development
 *
 * Seeds the development database with sample data.
 * Safety: Refuses to run on production URLs.
 *
 * Run with: pnpm db:seed
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_LISTOPAD__SUPABASE_URL;
const serviceRoleKey = process.env.LISTOPAD__SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_LISTOPAD__SUPABASE_ANON_KEY;

// Use service role key if available, otherwise fall back to anon key
const supabaseKey = serviceRoleKey || anonKey;

function isProductionUrl(url: string): boolean {
  // Consider it production if it doesn't contain dev indicators
  const devIndicators = ['-dev', 'localhost', '127.0.0.1', 'local', 'staging', 'test'];
  const urlLower = url.toLowerCase();
  return !devIndicators.some((indicator) => urlLower.includes(indicator));
}

async function seedDatabase(): Promise<void> {
  console.log('Listopad Database Seeder\n');

  // Validate environment
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials.');
    console.error('Make sure .env.local has NEXT_PUBLIC_LISTOPAD__SUPABASE_URL and either');
    console.error('LISTOPAD__SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_LISTOPAD__SUPABASE_ANON_KEY');
    process.exit(1);
  }

  // Safety check: refuse to run on production
  if (isProductionUrl(supabaseUrl)) {
    console.error('Error: This script refuses to run on production databases.');
    console.error(`Detected URL: ${supabaseUrl}`);
    console.error('\nTo run this script, your Supabase URL must contain one of:');
    console.error('  -dev, localhost, 127.0.0.1, local, staging, test');
    console.error('\nCreate a separate dev Supabase project for development.');
    process.exit(1);
  }

  console.log(`Target: ${supabaseUrl}`);
  console.log(`Using: ${serviceRoleKey ? 'service role key' : 'anon key'}\n`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Seed categories
    console.log('Seeding categories...');
    const { error: catError } = await supabase.from('categories').upsert(
      [
        { id: 1, name: 'Одяг', marketing_desc: 'Жіночий та чоловічий одяг' },
        { id: 2, name: 'Взуття', marketing_desc: 'Стильне взуття' },
        { id: 3, name: 'Аксесуари', marketing_desc: 'Модні аксесуари' },
        { id: 4, name: 'Сумки', marketing_desc: 'Сумки та рюкзаки' },
      ],
      { onConflict: 'id' }
    );
    if (catError) throw catError;
    console.log('  ✓ Categories seeded');

    // Seed brands
    console.log('Seeding brands...');
    const { error: brandError } = await supabase.from('brands').upsert(
      [
        {
          id: 1,
          name: 'Nova Style',
          marketing_desc: 'Український бренд сучасного одягу',
          external_url: 'https://example.com/nova-style',
          inst_url: 'https://instagram.com/novastyle',
        },
        {
          id: 2,
          name: 'Urban Kyiv',
          marketing_desc: 'Міська мода з українським характером',
          external_url: 'https://example.com/urban-kyiv',
          inst_url: 'https://instagram.com/urbankyiv',
        },
        {
          id: 3,
          name: 'Простір',
          marketing_desc: 'Мінімалістичний український бренд',
          external_url: 'https://example.com/prostir',
          inst_url: 'https://instagram.com/prostir',
        },
      ],
      { onConflict: 'id' }
    );
    if (brandError) throw brandError;
    console.log('  ✓ Brands seeded');

    // Seed products
    console.log('Seeding products...');
    const { error: prodError } = await supabase.from('products').upsert(
      [
        {
          id: 1,
          name: 'Сукня літня',
          price: 2500,
          brand_id: 1,
          category_id: 1,
          product_description: 'Легка літня сукня з натуральних тканин',
          colors: ['white', 'blue'],
          gender: 'female',
          external_url: 'https://example.com/product/1',
        },
        {
          id: 2,
          name: 'Футболка базова',
          price: 800,
          brand_id: 2,
          category_id: 1,
          product_description: 'Базова бавовняна футболка',
          colors: ['black', 'white', 'grey'],
          gender: 'unisex',
          external_url: 'https://example.com/product/2',
        },
        {
          id: 3,
          name: 'Кросівки міські',
          price: 3200,
          brand_id: 2,
          category_id: 2,
          product_description: 'Зручні кросівки для міста',
          colors: ['white', 'black'],
          gender: 'unisex',
          external_url: 'https://example.com/product/3',
        },
        {
          id: 4,
          name: 'Сумка шкіряна',
          price: 4500,
          brand_id: 3,
          category_id: 4,
          product_description: 'Елегантна шкіряна сумка ручної роботи',
          colors: ['brown', 'black'],
          gender: 'female',
          external_url: 'https://example.com/product/4',
        },
        {
          id: 5,
          name: 'Светр вʼязаний',
          price: 1800,
          brand_id: 1,
          category_id: 1,
          product_description: 'Теплий вʼязаний светр з мериносової вовни',
          colors: ['grey', 'indigo'],
          gender: 'female',
          external_url: 'https://example.com/product/5',
        },
      ],
      { onConflict: 'id' }
    );
    if (prodError) throw prodError;
    console.log('  ✓ Products seeded');

    // Seed site settings
    console.log('Seeding site settings...');
    const { error: settingsError } = await supabase.from('site_settings').upsert(
      [
        { key: 'contact', value: { phone: '+380 XX XXX XXXX', email: 'info@example.com', address: 'Київ, Україна' } },
        {
          key: 'social_links',
          value: { instagram: 'https://instagram.com/listopad', facebook: '', twitter: '', youtube: '', tiktok: '' },
        },
      ],
      { onConflict: 'key' }
    );
    if (settingsError) throw settingsError;
    console.log('  ✓ Site settings seeded');

    console.log('\nDatabase seeded successfully!');
  } catch (error) {
    console.error('\nSeeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
