import { Product } from "@/types/product";
import { FilterState } from "@/types/filters";

/**
 * Filters products based on the provided filter state.
 *
 * Filter logic:
 * - Categories: OR logic (product matches if any selected category matches)
 * - Genders: OR logic (product matches if its gender is in selected list)
 * - Colors: OR logic (product matches if any of its colors is in selected list)
 * - Price: Range filter (product price must be within min/max bounds)
 *
 * Between filter types, AND logic applies (all active filters must pass).
 */
export function filterProducts(
  products: Product[],
  filters: FilterState
): Product[] {
  return products.filter((product) => {
    // Category filter (OR logic)
    if (filters.categories.length > 0) {
      const hasMatchingCategory = product.categoryIds.some((catId) =>
        filters.categories.includes(String(catId))
      );
      if (!hasMatchingCategory) return false;
    }

    // Gender filter (OR logic)
    if (filters.genders.length > 0) {
      // Products without gender are excluded when gender filter is active
      if (!product.gender) return false;
      if (!filters.genders.includes(product.gender)) return false;
    }

    // Color filter (OR logic)
    if (filters.colors.length > 0) {
      // Products with empty colors array are hidden when color filter is active
      if (product.colors.length === 0) return false;
      const hasMatchingColor = product.colors.some((color) =>
        filters.colors.includes(color)
      );
      if (!hasMatchingColor) return false;
    }

    // Price filter (range)
    if (filters.price.from !== null && product.price < filters.price.from) {
      return false;
    }
    if (filters.price.to !== null && product.price > filters.price.to) {
      return false;
    }

    return true;
  });
}

/**
 * Check if any filters are active.
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.categories.length > 0 ||
    filters.genders.length > 0 ||
    filters.colors.length > 0 ||
    filters.price.from !== null ||
    filters.price.to !== null
  );
}
