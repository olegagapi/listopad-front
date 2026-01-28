import type { Product, Gender, PrimeColor } from "./product";

/**
 * Document structure for Meilisearch index
 */
export type MeilisearchProductDocument = {
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
 * Search options for the search API
 */
export type SearchOptions = {
  query?: string;
  locale: "uk" | "en";
  categoryIds?: string[];
  brandIds?: string[];
  genders?: Gender[];
  colors?: PrimeColor[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
  hybrid?: boolean;
};

/**
 * Supported sort options
 */
export type SortOption =
  | "relevance"
  | "price:asc"
  | "price:desc"
  | "discountedPrice:asc"
  | "discountedPrice:desc";

/**
 * Facet distribution from Meilisearch
 */
export type FacetDistribution = {
  brandId?: Record<string, number>;
  categoryIds?: Record<string, number>;
  colors?: Record<PrimeColor, number>;
  gender?: Record<Gender, number>;
};

/**
 * Search result from Meilisearch
 */
export type SearchResult = {
  hits: Product[];
  totalHits: number;
  page: number;
  totalPages: number;
  processingTimeMs: number;
  facetDistribution: FacetDistribution;
  query: string;
};

/**
 * Error response from search API
 */
export type SearchError = {
  data: null;
  error: string;
};

/**
 * Success response from search API
 */
export type SearchSuccess = {
  data: SearchResult;
  error: null;
};

/**
 * Search API response type
 */
export type SearchResponse = SearchSuccess | SearchError;

/**
 * Supabase webhook payload for product changes
 */
export type SupabaseWebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Record<string, unknown> | null;
  old_record: Record<string, unknown> | null;
};
