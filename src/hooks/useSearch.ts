"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale } from "next-intl";
import type { SearchResult, FacetDistribution, SortOption } from "@/types/search";
import type { Product, Gender, PrimeColor } from "@/types/product";

export type UseSearchOptions = {
  query?: string;
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
  debounceMs?: number;
};

export type UseSearchReturn = {
  results: Product[];
  totalHits: number;
  totalPages: number;
  page: number;
  facets: FacetDistribution;
  processingTimeMs: number;
  isLoading: boolean;
  error: string | null;
  search: (query: string) => void;
  refetch: () => void;
};

const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Hook for searching products with debouncing and facet support
 */
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const locale = useLocale() as "uk" | "en";
  const [results, setResults] = useState<Product[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(options.page ?? 1);
  const [facets, setFacets] = useState<FacetDistribution>({});
  const [processingTimeMs, setProcessingTimeMs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(options.query ?? "");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;

  const performSearch = useCallback(
    async (query: string) => {
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

        if (query) {
          params.set("q", query);
        }
        if (options.categoryIds && options.categoryIds.length > 0) {
          params.set("category", options.categoryIds.join(","));
        }
        if (options.brandIds && options.brandIds.length > 0) {
          params.set("brand", options.brandIds.join(","));
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
        if (options.hybrid) {
          params.set("hybrid", "true");
        }

        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const json = await response.json() as {
          data: SearchResult | null;
          error: string | null;
        };

        if (json.error) {
          throw new Error(json.error);
        }

        if (json.data) {
          setResults(json.data.hits);
          setTotalHits(json.data.totalHits);
          setTotalPages(json.data.totalPages);
          setPage(json.data.page);
          setFacets(json.data.facetDistribution);
          setProcessingTimeMs(json.data.processingTimeMs);
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
    },
    [locale, options]
  );

  const search = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Clear any pending debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Debounce the search
      debounceRef.current = setTimeout(() => {
        performSearch(query);
      }, debounceMs);
    },
    [performSearch, debounceMs]
  );

  const refetch = useCallback(() => {
    performSearch(searchQuery);
  }, [performSearch, searchQuery]);

  // Initial search and search when options change
  useEffect(() => {
    performSearch(options.query ?? "");
  }, [
    locale,
    options.categoryIds?.join(","),
    options.brandIds?.join(","),
    options.genders?.join(","),
    options.colors?.join(","),
    options.minPrice,
    options.maxPrice,
    options.sort,
    options.page,
    options.limit,
    options.hybrid,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
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
    facets,
    processingTimeMs,
    isLoading,
    error,
    search,
    refetch,
  };
}

/**
 * Lightweight hook for instant search in header
 * Only performs search, doesn't track facets or pagination
 */
export function useInstantSearch(debounceMs: number = 300): {
  results: Product[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => void;
  clear: () => void;
  query: string;
} {
  const locale = useLocale() as "uk" | "en";
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);

      // Clear any pending debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // If empty query, clear results immediately
      if (!searchQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Debounce the search
      debounceRef.current = setTimeout(async () => {
        // Cancel any pending request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
          const params = new URLSearchParams({
            q: searchQuery,
            locale,
            limit: "5",
          });

          const response = await fetch(`/api/search?${params.toString()}`, {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
          }

          const json = await response.json() as {
            data: SearchResult | null;
            error: string | null;
          };

          if (json.error) {
            throw new Error(json.error);
          }

          if (json.data) {
            setResults(json.data.hits);
          }
          setError(null);
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            return;
          }
          const errorMessage =
            err instanceof Error ? err.message : "An unexpected error occurred";
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }, debounceMs);
    },
    [locale, debounceMs]
  );

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    clear,
    query,
  };
}
