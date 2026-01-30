/**
 * Shared validation and parsing utilities for API routes.
 */

import type { Gender, PrimeColor } from "@/types/product";
import type { SortOption } from "@/types/search";
import type { Locale } from "@/lib/supabase-data";

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
  "white", "black", "grey", "red", "green", "blue",
  "yellow", "brown", "orange", "cyan", "magenta",
  "indigo", "silver", "gold",
];

/**
 * Parses a comma-separated string into an array of trimmed strings.
 */
export function parseCommaSeparated(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * Parses a string value into a number, or returns undefined if invalid.
 */
export function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

/**
 * Parses a string value into a boolean.
 */
export function parseBoolean(value: string | null): boolean {
  return value === "true" || value === "1";
}

/**
 * Validates and returns a locale, defaulting to 'uk' if invalid.
 */
export function validateLocale(value: string | null): Locale {
  if (value && VALID_LOCALES.includes(value as Locale)) {
    return value as Locale;
  }
  return "uk";
}

/**
 * Validates and returns a sort option, defaulting to 'relevance' if invalid.
 */
export function validateSort(value: string | null): SortOption {
  if (value && VALID_SORT_OPTIONS.includes(value as SortOption)) {
    return value as SortOption;
  }
  return "relevance";
}

/**
 * Filters an array of strings to only include valid genders.
 */
export function validateGenders(values: string[]): Gender[] {
  return values.filter((v) => VALID_GENDERS.includes(v as Gender)) as Gender[];
}

/**
 * Filters an array of strings to only include valid colors.
 */
export function validateColors(values: string[]): PrimeColor[] {
  return values.filter((v) => VALID_COLORS.includes(v as PrimeColor)) as PrimeColor[];
}
