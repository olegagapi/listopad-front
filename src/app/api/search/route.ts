import { NextRequest } from "next/server";
import { searchProducts } from "@/lib/meilisearch";
import {
  parseCommaSeparated,
  parseNumber,
  parseBoolean,
  validateLocale,
  validateSort,
  validateGenders,
  validateColors,
} from "@/lib/apiValidation";
import type { SearchOptions, SearchResponse } from "@/types/search";

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
