"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale } from "next-intl";
import type { Product, Gender, PrimeColor } from "@/types/product";
import type { SortOption } from "@/types/search";

export type FilteredProductsOptions = {
  categoryIds?: string[];
  genders?: Gender[];
  colors?: PrimeColor[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
  enabled?: boolean;
};

export type FilteredProductsCounts = {
  categories: Record<string, number>;
  genders: Record<Gender, number>;
  colors: Record<PrimeColor, number>;
};

export type UseFilteredProductsReturn = {
  results: Product[];
  totalHits: number;
  totalPages: number;
  page: number;
  counts: FilteredProductsCounts;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

type ProductsApiResponse = {
  data: {
    products: Product[];
    totalHits: number;
    totalPages: number;
    page: number;
    counts: FilteredProductsCounts;
  } | null;
  error: string | null;
};

const DEFAULT_COUNTS: FilteredProductsCounts = {
  categories: {},
  genders: { male: 0, female: 0, unisex: 0 },
  colors: {
    white: 0, black: 0, grey: 0, red: 0, green: 0, blue: 0,
    yellow: 0, brown: 0, orange: 0, cyan: 0, magenta: 0,
    indigo: 0, silver: 0, gold: 0,
  },
};

/**
 * Hook for fetching filtered products from Supabase via /api/products.
 * Used in browse mode (when no search query is present).
 */
export function useFilteredProducts(
  options: FilteredProductsOptions = {}
): UseFilteredProductsReturn {
  const locale = useLocale() as "uk" | "en";
  const [results, setResults] = useState<Product[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(options.page ?? 1);
  const [counts, setCounts] = useState<FilteredProductsCounts>(DEFAULT_COUNTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async () => {
    // Skip if disabled
    if (options.enabled === false) {
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("locale", locale);

      if (options.categoryIds && options.categoryIds.length > 0) {
        params.set("category", options.categoryIds.join(","));
      }
      if (options.genders && options.genders.length > 0) {
        params.set("gender", options.genders.join(","));
      }
      if (options.colors && options.colors.length > 0) {
        params.set("color", options.colors.join(","));
      }
      if (options.minPrice !== undefined) {
        params.set("minPrice", String(options.minPrice));
      }
      if (options.maxPrice !== undefined) {
        params.set("maxPrice", String(options.maxPrice));
      }
      if (options.sort) {
        params.set("sort", options.sort);
      }
      if (options.page) {
        params.set("page", String(options.page));
      }
      if (options.limit) {
        params.set("limit", String(options.limit));
      }

      const response = await fetch(`/api/products?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const json = (await response.json()) as ProductsApiResponse;

      if (json.error) {
        throw new Error(json.error);
      }

      if (json.data) {
        setResults(json.data.products);
        setTotalHits(json.data.totalHits);
        setTotalPages(json.data.totalPages);
        setPage(json.data.page);
        setCounts(json.data.counts);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // Ignore aborted requests
        return;
      }
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [locale, options]);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch when options change
  useEffect(() => {
    fetchProducts();
  }, [
    locale,
    options.categoryIds?.join(","),
    options.genders?.join(","),
    options.colors?.join(","),
    options.minPrice,
    options.maxPrice,
    options.sort,
    options.page,
    options.limit,
    options.enabled,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    results,
    totalHits,
    totalPages,
    page,
    counts,
    isLoading,
    error,
    refetch,
  };
}
