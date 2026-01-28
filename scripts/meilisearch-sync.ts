/**
 * Meilisearch Sync Script
 *
 * This script fetches all products from Supabase and indexes them
 * to both locale-specific Meilisearch indexes (products_uk, products_en).
 *
 * Usage:
 *   pnpm tsx scripts/meilisearch-sync.ts
 *
 * Required environment variables:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   - MEILISEARCH_HOST
 *   - MEILISEARCH_ADMIN_API_KEY
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load .env.local (Next.js convention)
config({ path: ".env.local" });
import { MeiliSearch } from "meilisearch";

// Validate environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST;
const MEILISEARCH_ADMIN_API_KEY = process.env.MEILISEARCH_ADMIN_API_KEY;

if (!SUPABASE_URL) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL is not set");
  process.exit(1);
}
if (!SUPABASE_ANON_KEY) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  process.exit(1);
}
if (!MEILISEARCH_HOST) {
  console.error("Error: MEILISEARCH_HOST is not set");
  process.exit(1);
}
if (!MEILISEARCH_ADMIN_API_KEY) {
  console.error("Error: MEILISEARCH_ADMIN_API_KEY is not set");
  process.exit(1);
}

// Create clients
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const meilisearch = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_ADMIN_API_KEY,
});

// Types
type PrimeColor =
  | "white"
  | "black"
  | "grey"
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "brown"
  | "orange"
  | "cyan"
  | "magenta"
  | "indigo"
  | "silver"
  | "gold";

type Gender = "male" | "female" | "unisex";

type RawProduct = {
  id: number;
  name_uk: string | null;
  name_en: string | null;
  product_description_uk: string | null;
  product_description_en: string | null;
  price: number;
  brand_id: number | null;
  category_id: number | null;
  colors: PrimeColor[] | null;
  gender: Gender | null;
  tags: string[] | null;
  preview_image: string | null;
  brands: { name_uk: string | null; name_en: string | null } | null;
  categories: { name_uk: string | null; name_en: string | null } | null;
};

type MeilisearchDocument = {
  id: string;
  slug: string;
  title: string;
  brandId: string | null;
  brandName: string | null;
  categoryIds: string[];
  categoryNames: string[];
  tags: string[];
  colors: PrimeColor[];
  gender: Gender | null;
  description: string | null;
  price: number;
  discountedPrice: number;
  previewImage: string;
};

/**
 * Generate slug from product name and ID
 */
function generateSlug(name: string, id: number): string {
  const slugified = name
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slugified}-${id}`;
}

/**
 * Transform a raw product to a Meilisearch document
 */
function transformProduct(
  product: RawProduct,
  locale: "uk" | "en"
): MeilisearchDocument {
  const name =
    locale === "uk" ? (product.name_uk ?? "") : (product.name_en ?? "");
  const description =
    locale === "uk"
      ? product.product_description_uk
      : product.product_description_en;
  const brandName = product.brands
    ? locale === "uk"
      ? (product.brands.name_uk ?? null)
      : (product.brands.name_en ?? null)
    : null;
  const categoryName = product.categories
    ? locale === "uk"
      ? (product.categories.name_uk ?? null)
      : (product.categories.name_en ?? null)
    : null;

  return {
    id: String(product.id),
    slug: generateSlug(name, product.id),
    title: name,
    brandId: product.brand_id ? String(product.brand_id) : null,
    brandName,
    categoryIds: product.category_id ? [String(product.category_id)] : [],
    categoryNames: categoryName ? [categoryName] : [],
    tags: product.tags ?? [],
    colors: product.colors ?? [],
    gender: product.gender,
    description,
    price: product.price,
    discountedPrice: product.price,
    previewImage: product.preview_image ?? "",
  };
}

async function sync(): Promise<void> {
  console.log("Starting Meilisearch sync...\n");

  // Fetch all products from Supabase
  console.log("Fetching products from Supabase...");
  const { data: products, error } = await supabase.from("products").select(`
    *,
    brands (name_uk, name_en),
    categories (name_uk, name_en)
  `);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    process.exit(1);
  }

  console.log(`Found ${products.length} products\n`);

  // Transform products for each locale
  const rawProducts = products as RawProduct[];
  const ukDocuments = rawProducts.map((p) => transformProduct(p, "uk"));
  const enDocuments = rawProducts.map((p) => transformProduct(p, "en"));

  // Index to Ukrainian locale
  console.log("Indexing to products_uk...");
  const ukIndex = meilisearch.index("products_uk");
  const ukTask = await ukIndex.addDocuments(ukDocuments, { primaryKey: "id" });
  console.log(`  Task ${ukTask.taskUid} created`);
  await meilisearch.tasks.waitForTask(ukTask.taskUid);
  console.log(`  Indexed ${ukDocuments.length} documents`);

  // Index to English locale
  console.log("Indexing to products_en...");
  const enIndex = meilisearch.index("products_en");
  const enTask = await enIndex.addDocuments(enDocuments, { primaryKey: "id" });
  console.log(`  Task ${enTask.taskUid} created`);
  await meilisearch.tasks.waitForTask(enTask.taskUid);
  console.log(`  Indexed ${enDocuments.length} documents`);

  console.log("\nSync complete!");
  console.log(`\nSummary:`);
  console.log(`  - products_uk: ${ukDocuments.length} documents`);
  console.log(`  - products_en: ${enDocuments.length} documents`);
}

sync().catch((error) => {
  console.error("Sync failed:", error);
  process.exit(1);
});
