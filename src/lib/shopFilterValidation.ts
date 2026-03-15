import type { Gender, PrimeColor } from "@/types/product";
import type { SortOption } from "@/types/search";

const VALID_GENDERS: Gender[] = ["male", "female", "unisex"];
const VALID_COLORS: PrimeColor[] = [
  "white", "black", "grey", "red", "green", "blue",
  "yellow", "brown", "orange", "cyan", "magenta",
  "indigo", "silver", "gold",
];
const VALID_SORT_OPTIONS: SortOption[] = [
  "relevance",
  "price:asc",
  "price:desc",
];

export function isValidGender(value: string): value is Gender {
  return VALID_GENDERS.includes(value as Gender);
}

export function isValidColor(value: string): value is PrimeColor {
  return VALID_COLORS.includes(value as PrimeColor);
}

export function isValidSort(value: string): value is SortOption {
  return VALID_SORT_OPTIONS.includes(value as SortOption);
}

export function parseArrayParam(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

export function parseNumberParam(value: string | null): number | null {
  if (!value) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}
