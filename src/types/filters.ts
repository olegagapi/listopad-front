import { Gender, PrimeColor } from "./product";

export type PriceRange = {
  min: number;
  max: number;
};

export type SelectedPrice = {
  from: number | null;
  to: number | null;
};

export type FilterState = {
  categories: string[];
  genders: Gender[];
  colors: PrimeColor[];
  price: SelectedPrice;
};

export const emptyFilters: FilterState = {
  categories: [],
  genders: [],
  colors: [],
  price: { from: null, to: null },
};

// URL parameter names
export const FILTER_PARAMS = {
  category: "category",
  gender: "gender",
  color: "color",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
} as const;
