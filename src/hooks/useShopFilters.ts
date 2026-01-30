"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FilterState, emptyFilters, FILTER_PARAMS } from "@/types/filters";
import { Gender, PrimeColor } from "@/types/product";
import type { SortOption } from "@/types/search";

const VALID_GENDERS: Gender[] = ["male", "female", "unisex"];
const VALID_COLORS: PrimeColor[] = [
  "white", "black", "grey", "red", "green", "blue",
  "yellow", "brown", "orange", "cyan", "magenta",
  "indigo", "silver", "gold"
];
const VALID_SORT_OPTIONS: SortOption[] = [
  "relevance",
  "price:asc",
  "price:desc",
  "discountedPrice:asc",
  "discountedPrice:desc",
];

function isValidGender(value: string): value is Gender {
  return VALID_GENDERS.includes(value as Gender);
}

function isValidColor(value: string): value is PrimeColor {
  return VALID_COLORS.includes(value as PrimeColor);
}

function isValidSort(value: string): value is SortOption {
  return VALID_SORT_OPTIONS.includes(value as SortOption);
}

function parseArrayParam(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

function parseNumberParam(value: string | null): number | null {
  if (!value) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

export type UseShopFiltersReturn = {
  filters: FilterState;
  setFilters: (partial: Partial<FilterState>) => void;
  clearFilters: () => void;
  setQuery: (query: string) => void;
  setCategories: (categories: string[]) => void;
  setGenders: (genders: Gender[]) => void;
  setColors: (colors: PrimeColor[]) => void;
  setPrice: (from: number | null, to: number | null) => void;
  setSort: (sort: SortOption) => void;
};

export function useShopFilters(): UseShopFiltersReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo<FilterState>(() => {
    const queryParam = searchParams.get(FILTER_PARAMS.query);
    const categoryParam = searchParams.get(FILTER_PARAMS.category);
    const genderParam = searchParams.get(FILTER_PARAMS.gender);
    const colorParam = searchParams.get(FILTER_PARAMS.color);
    const minPriceParam = searchParams.get(FILTER_PARAMS.minPrice);
    const maxPriceParam = searchParams.get(FILTER_PARAMS.maxPrice);
    const sortParam = searchParams.get(FILTER_PARAMS.sort);

    const categories = parseArrayParam(categoryParam);
    const gendersRaw = parseArrayParam(genderParam);
    const colorsRaw = parseArrayParam(colorParam);

    return {
      query: queryParam ?? "",
      categories,
      genders: gendersRaw.filter(isValidGender),
      colors: colorsRaw.filter(isValidColor),
      price: {
        from: parseNumberParam(minPriceParam),
        to: parseNumberParam(maxPriceParam),
      },
      sort: sortParam && isValidSort(sortParam) ? sortParam : "relevance",
    };
  }, [searchParams]);

  const updateUrl = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams();

      if (newFilters.query) {
        params.set(FILTER_PARAMS.query, newFilters.query);
      }
      if (newFilters.categories.length > 0) {
        params.set(FILTER_PARAMS.category, newFilters.categories.join(","));
      }
      if (newFilters.genders.length > 0) {
        params.set(FILTER_PARAMS.gender, newFilters.genders.join(","));
      }
      if (newFilters.colors.length > 0) {
        params.set(FILTER_PARAMS.color, newFilters.colors.join(","));
      }
      if (newFilters.price.from !== null) {
        params.set(FILTER_PARAMS.minPrice, String(newFilters.price.from));
      }
      if (newFilters.price.to !== null) {
        params.set(FILTER_PARAMS.maxPrice, String(newFilters.price.to));
      }
      if (newFilters.sort && newFilters.sort !== "relevance") {
        params.set(FILTER_PARAMS.sort, newFilters.sort);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  const setFilters = useCallback(
    (partial: Partial<FilterState>) => {
      const newFilters = { ...filters, ...partial };
      updateUrl(newFilters);
    },
    [filters, updateUrl]
  );

  const clearFilters = useCallback(() => {
    updateUrl(emptyFilters);
  }, [updateUrl]);

  const setCategories = useCallback(
    (categories: string[]) => {
      setFilters({ categories });
    },
    [setFilters]
  );

  const setGenders = useCallback(
    (genders: Gender[]) => {
      setFilters({ genders });
    },
    [setFilters]
  );

  const setColors = useCallback(
    (colors: PrimeColor[]) => {
      setFilters({ colors });
    },
    [setFilters]
  );

  const setPrice = useCallback(
    (from: number | null, to: number | null) => {
      setFilters({ price: { from, to } });
    },
    [setFilters]
  );

  const setQuery = useCallback(
    (query: string) => {
      setFilters({ query });
    },
    [setFilters]
  );

  const setSort = useCallback(
    (sort: SortOption) => {
      setFilters({ sort });
    },
    [setFilters]
  );

  return {
    filters,
    setFilters,
    clearFilters,
    setQuery,
    setCategories,
    setGenders,
    setColors,
    setPrice,
    setSort,
  };
}
