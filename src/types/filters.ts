import { Gender, PrimeColor } from "./product";
import type { SortOption } from "./search";

export type PriceRange = {
  min: number;
  max: number;
};

export type SelectedPrice = {
  from: number | null;
  to: number | null;
};

export type FilterState = {
  query: string;
  categories: string[];
  genders: Gender[];
  colors: PrimeColor[];
  price: SelectedPrice;
  sort: SortOption;
};

export const emptyFilters: FilterState = {
  query: "",
  categories: [],
  genders: [],
  colors: [],
  price: { from: null, to: null },
  sort: "relevance",
};

// URL parameter names
export const FILTER_PARAMS = {
  query: "q",
  category: "category",
  gender: "gender",
  color: "color",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  sort: "sort",
} as const;
