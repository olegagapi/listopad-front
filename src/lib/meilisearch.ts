import { MeiliSearch, Index, SearchParams, SearchResponse } from "meilisearch";
import type {
  MeilisearchProductDocument,
  SearchOptions,
  SearchResult,
  FacetDistribution,
  SortOption,
} from "@/types/search";
import type { Product } from "@/types/product";

// Environment variables validation
const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST;
const MEILISEARCH_ADMIN_API_KEY = process.env.MEILISEARCH_ADMIN_API_KEY;
const MEILISEARCH_SEARCH_API_KEY = process.env.MEILISEARCH_SEARCH_API_KEY;

/**
 * Get Meilisearch admin client (for indexing operations)
 */
export function getAdminClient(): MeiliSearch {
  if (!MEILISEARCH_HOST) {
    throw new Error("MEILISEARCH_HOST environment variable is not set");
  }
  if (!MEILISEARCH_ADMIN_API_KEY) {
    throw new Error("MEILISEARCH_ADMIN_API_KEY environment variable is not set");
  }

  return new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_ADMIN_API_KEY,
  });
}

/**
 * Get Meilisearch search client (for search operations)
 */
export function getSearchClient(): MeiliSearch {
  if (!MEILISEARCH_HOST) {
    throw new Error("MEILISEARCH_HOST environment variable is not set");
  }
  if (!MEILISEARCH_SEARCH_API_KEY) {
    throw new Error("MEILISEARCH_SEARCH_API_KEY environment variable is not set");
  }

  return new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_SEARCH_API_KEY,
  });
}

/**
 * Index names by locale
 */
export const INDEX_NAMES = {
  uk: "products_uk",
  en: "products_en",
} as const;

/**
 * Get product index for a specific locale
 */
export function getProductIndex(
  client: MeiliSearch,
  locale: "uk" | "en"
): Index<MeilisearchProductDocument> {
  return client.index(INDEX_NAMES[locale]);
}

/**
 * Index settings configuration
 */
export const INDEX_SETTINGS = {
  searchableAttributes: [
    "title",
    "brandName",
    "categoryNames",
    "tags",
    "description",
  ],
  filterableAttributes: [
    "brandId",
    "categoryIds",
    "colors",
    "gender",
    "price",
    "discountedPrice",
  ],
  sortableAttributes: ["price", "discountedPrice"],
  typoTolerance: {
    enabled: true,
  },
  faceting: {
    maxValuesPerFacet: 100,
  },
};

/**
 * Embedder configuration for hybrid search
 */
export const EMBEDDER_CONFIG = {
  source: "openAi" as const,
  model: "text-embedding-3-small",
  documentTemplate: "{{doc.title}} {{doc.brandName}} {{doc.description}}",
  apiKey: process.env.OPENAI_API_KEY,
};

/**
 * Build filter string from search options
 */
export function buildFilterString(options: SearchOptions): string {
  const filters: string[] = [];

  if (options.categoryIds && options.categoryIds.length > 0) {
    const categoryFilter = options.categoryIds
      .map((id) => `categoryIds = "${id}"`)
      .join(" OR ");
    filters.push(`(${categoryFilter})`);
  }

  if (options.brandIds && options.brandIds.length > 0) {
    const brandFilter = options.brandIds
      .map((id) => `brandId = "${id}"`)
      .join(" OR ");
    filters.push(`(${brandFilter})`);
  }

  if (options.genders && options.genders.length > 0) {
    const genderFilter = options.genders
      .map((g) => `gender = "${g}"`)
      .join(" OR ");
    filters.push(`(${genderFilter})`);
  }

  if (options.colors && options.colors.length > 0) {
    const colorFilter = options.colors
      .map((c) => `colors = "${c}"`)
      .join(" OR ");
    filters.push(`(${colorFilter})`);
  }

  if (options.minPrice !== undefined) {
    filters.push(`discountedPrice >= ${options.minPrice}`);
  }

  if (options.maxPrice !== undefined) {
    filters.push(`discountedPrice <= ${options.maxPrice}`);
  }

  return filters.join(" AND ");
}

/**
 * Build sort array from sort option
 */
export function buildSortArray(sort?: SortOption): string[] | undefined {
  if (!sort || sort === "relevance") {
    return undefined;
  }

  return [sort];
}

/**
 * Transform Meilisearch document to Product type
 */
export function documentToProduct(doc: MeilisearchProductDocument): Product {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    reviews: 0,
    price: doc.price,
    discountedPrice: doc.discountedPrice,
    currency: "UAH",
    brandId: doc.brandId ?? undefined,
    brandName: doc.brandName ?? undefined,
    categoryIds: doc.categoryIds,
    categoryNames: doc.categoryNames,
    tags: doc.tags,
    colors: doc.colors,
    gender: doc.gender ?? undefined,
    description: doc.description,
    shortDescription: null,
    externalUrl: null,
    instagramUrl: null,
    imgs: {
      thumbnails: doc.previewImage ? [doc.previewImage] : [],
      previews: doc.previewImage ? [doc.previewImage] : [],
    },
  };
}

/**
 * Perform search with all options
 */
export async function searchProducts(
  options: SearchOptions
): Promise<SearchResult> {
  const client = getSearchClient();
  const index = getProductIndex(client, options.locale);

  const page = options.page ?? 1;
  const limit = options.limit ?? 12;

  const searchParams: SearchParams = {
    filter: buildFilterString(options),
    sort: buildSortArray(options.sort),
    page,
    hitsPerPage: limit,
    facets: ["brandId", "categoryIds", "colors", "gender"],
  };

  // Enable hybrid search if requested and embedders are configured
  if (options.hybrid) {
    searchParams.hybrid = {
      embedder: "default",
      semanticRatio: 0.5,
    };
  }

  const query = options.query ?? "";
  const response: SearchResponse<MeilisearchProductDocument> =
    await index.search(query, searchParams);

  const hits = response.hits.map(documentToProduct);
  const totalHits = response.estimatedTotalHits ?? response.totalHits ?? 0;
  const totalPages = Math.ceil(totalHits / limit);

  return {
    hits,
    totalHits,
    page,
    totalPages,
    processingTimeMs: response.processingTimeMs,
    facetDistribution: (response.facetDistribution ?? {}) as FacetDistribution,
    query,
  };
}
