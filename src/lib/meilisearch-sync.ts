import { supabase } from "@/lib/supabase";
import {
  getAdminClient,
  getProductIndex,
  INDEX_NAMES,
  INDEX_SETTINGS,
  EMBEDDER_CONFIG,
} from "@/lib/meilisearch";
import { generateSlug } from "@/lib/slug";
import type { MeilisearchProductDocument } from "@/types/search";
import type { PrimeColor, Gender } from "@/types/product";

type Locale = "uk" | "en";

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

/**
 * Transform a raw product from Supabase to a Meilisearch document
 */
export function transformProductToDocument(
  product: RawProduct,
  locale: Locale
): MeilisearchProductDocument {
  const name =
    locale === "uk"
      ? (product.name_uk ?? "")
      : (product.name_en ?? "");
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

/**
 * Fetch all products from Supabase
 */
export async function fetchAllProducts(): Promise<RawProduct[]> {
  const { data, error } = await supabase.from("products").select(`
    *,
    brands (name_uk, name_en),
    categories (name_uk, name_en)
  `);

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data as RawProduct[];
}

/**
 * Fetch a single product by ID from Supabase
 */
export async function fetchProductById(
  productId: number
): Promise<RawProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
    *,
    brands (name_uk, name_en),
    categories (name_uk, name_en)
  `
    )
    .eq("id", productId)
    .single();

  if (error) {
    console.error(`Failed to fetch product ${productId}:`, error.message);
    return null;
  }

  return data as RawProduct;
}

/**
 * Index all products to both locale indexes
 */
export async function indexAllProducts(): Promise<{
  uk: number;
  en: number;
}> {
  const client = getAdminClient();
  const products = await fetchAllProducts();

  const ukDocuments = products.map((p) => transformProductToDocument(p, "uk"));
  const enDocuments = products.map((p) => transformProductToDocument(p, "en"));

  const ukIndex = getProductIndex(client, "uk");
  const enIndex = getProductIndex(client, "en");

  await Promise.all([
    ukIndex.addDocuments(ukDocuments, { primaryKey: "id" }),
    enIndex.addDocuments(enDocuments, { primaryKey: "id" }),
  ]);

  return {
    uk: ukDocuments.length,
    en: enDocuments.length,
  };
}

/**
 * Index a single product to both locale indexes
 */
export async function indexProduct(productId: number): Promise<void> {
  const client = getAdminClient();
  const product = await fetchProductById(productId);

  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  const ukDocument = transformProductToDocument(product, "uk");
  const enDocument = transformProductToDocument(product, "en");

  const ukIndex = getProductIndex(client, "uk");
  const enIndex = getProductIndex(client, "en");

  await Promise.all([
    ukIndex.addDocuments([ukDocument], { primaryKey: "id" }),
    enIndex.addDocuments([enDocument], { primaryKey: "id" }),
  ]);
}

/**
 * Delete a product from both locale indexes
 */
export async function deleteProduct(productId: number): Promise<void> {
  const client = getAdminClient();

  const ukIndex = getProductIndex(client, "uk");
  const enIndex = getProductIndex(client, "en");

  await Promise.all([
    ukIndex.deleteDocument(String(productId)),
    enIndex.deleteDocument(String(productId)),
  ]);
}

/**
 * Configure indexes with settings (searchable/filterable attributes, etc.)
 */
export async function configureIndexes(): Promise<void> {
  const client = getAdminClient();

  for (const locale of ["uk", "en"] as const) {
    const indexName = INDEX_NAMES[locale];

    // Create index if it doesn't exist
    await client.createIndex(indexName, { primaryKey: "id" });

    const index = client.index(indexName);

    // Update settings
    await index.updateSettings(INDEX_SETTINGS);

    console.log(`Configured index: ${indexName}`);
  }
}

/**
 * Configure embedders for hybrid search (requires OpenAI API key)
 */
export async function configureEmbedders(): Promise<void> {
  if (!EMBEDDER_CONFIG.apiKey) {
    console.warn(
      "OPENAI_API_KEY not set, skipping embedder configuration"
    );
    return;
  }

  const client = getAdminClient();

  for (const locale of ["uk", "en"] as const) {
    const index = getProductIndex(client, locale);

    await index.updateEmbedders({
      default: {
        source: EMBEDDER_CONFIG.source,
        model: EMBEDDER_CONFIG.model,
        documentTemplate: EMBEDDER_CONFIG.documentTemplate,
        apiKey: EMBEDDER_CONFIG.apiKey,
      },
    });

    console.log(`Configured embedder for index: ${INDEX_NAMES[locale]}`);
  }
}

/**
 * Full setup: configure indexes, embedders, and index all products
 */
export async function fullSetup(): Promise<void> {
  console.log("Configuring indexes...");
  await configureIndexes();

  console.log("Configuring embedders...");
  await configureEmbedders();

  console.log("Indexing all products...");
  const counts = await indexAllProducts();

  console.log(`Indexed ${counts.uk} products to products_uk`);
  console.log(`Indexed ${counts.en} products to products_en`);
  console.log("Setup complete!");
}
