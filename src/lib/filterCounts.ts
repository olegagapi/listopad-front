import { Product, Gender } from "@/types/product";
import { Category } from "@/types/category";

/**
 * Calculates the number of products in each category.
 * For parent categories, includes products from all descendant categories.
 *
 * @param products - Array of all products
 * @param categories - Array of all categories
 * @param descendantsMap - Map of category ID to descendant IDs
 * @returns Map of category ID to product count
 */
export function calculateCategoryCounts(
  products: Product[],
  categories: Category[],
  descendantsMap: Map<string, Set<string>>
): Map<string, number> {
  const counts = new Map<string, number>();

  // First, count products directly in each category
  const directCounts = new Map<string, number>();
  for (const product of products) {
    for (const categoryId of product.categoryIds) {
      const current = directCounts.get(categoryId) ?? 0;
      directCounts.set(categoryId, current + 1);
    }
  }

  // For each category, sum direct count + all descendant counts
  for (const category of categories) {
    const categoryId = String(category.id);
    let total = directCounts.get(categoryId) ?? 0;

    const descendants = descendantsMap.get(categoryId);
    if (descendants) {
      descendants.forEach((descendantId) => {
        total += directCounts.get(descendantId) ?? 0;
      });
    }

    counts.set(categoryId, total);
  }

  return counts;
}

/**
 * Calculates the number of products for each gender.
 *
 * @param products - Array of all products
 * @returns Map of gender to product count
 */
export function calculateGenderCounts(
  products: Product[]
): Map<Gender, number> {
  const counts = new Map<Gender, number>();

  for (const product of products) {
    if (product.gender) {
      const current = counts.get(product.gender) ?? 0;
      counts.set(product.gender, current + 1);
    }
  }

  return counts;
}
