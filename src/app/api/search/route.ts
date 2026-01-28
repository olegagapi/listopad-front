import { NextRequest } from "next/server";
import { searchProducts } from "@/lib/meilisearch";
import type { SearchOptions, SearchResponse, SortOption } from "@/types/search";
import type { Gender, PrimeColor } from "@/types/product";

const VALID_LOCALES = ["uk", "en"] as const;
const VALID_SORT_OPTIONS: SortOption[] = [
  "relevance",
  "price:asc",
  "price:desc",
  "discountedPrice:asc",
  "discountedPrice:desc",
];
const VALID_GENDERS: Gender[] = ["male", "female", "unisex"];
const VALID_COLORS: PrimeColor[] = [
  "white",
  "black",
  "grey",
  "red",
  "green",
  "blue",
  "yellow",
  "brown",
  "orange",
  "cyan",
  "magenta",
  "indigo",
  "silver",
  "gold",
];

function parseCommaSeparated(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

function parseBoolean(value: string | null): boolean {
  return value === "true" || value === "1";
}

function validateLocale(value: string | null): "uk" | "en" {
  if (value && VALID_LOCALES.includes(value as "uk" | "en")) {
    return value as "uk" | "en";
  }
  return "uk";
}

function validateSort(value: string | null): SortOption {
  if (value && VALID_SORT_OPTIONS.includes(value as SortOption)) {
    return value as SortOption;
  }
  return "relevance";
}

function validateGenders(values: string[]): Gender[] {
  return values.filter((v) =>
    VALID_GENDERS.includes(v as Gender)
  ) as Gender[];
}

function validateColors(values: string[]): PrimeColor[] {
  return values.filter((v) =>
    VALID_COLORS.includes(v as PrimeColor)
  ) as PrimeColor[];
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);

    const options: SearchOptions = {
      query: searchParams.get("q") ?? undefined,
      locale: validateLocale(searchParams.get("locale")),
      categoryIds: parseCommaSeparated(searchParams.get("category")),
      brandIds: parseCommaSeparated(searchParams.get("brand")),
      genders: validateGenders(parseCommaSeparated(searchParams.get("gender"))),
      colors: validateColors(parseCommaSeparated(searchParams.get("color"))),
      minPrice: parseNumber(searchParams.get("minPrice")),
      maxPrice: parseNumber(searchParams.get("maxPrice")),
      sort: validateSort(searchParams.get("sort")),
      page: parseNumber(searchParams.get("page")) ?? 1,
      limit: Math.min(parseNumber(searchParams.get("limit")) ?? 12, 100),
      hybrid: parseBoolean(searchParams.get("hybrid")),
    };

    const result = await searchProducts(options);

    const response: SearchResponse = {
      data: result,
      error: null,
    };

    return Response.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Search API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    const response: SearchResponse = {
      data: null,
      error: errorMessage,
    };

    return Response.json(response, { status: 500 });
  }
}
