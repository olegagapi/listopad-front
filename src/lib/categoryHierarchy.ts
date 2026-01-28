import { Category } from "@/types/category";

/**
 * Builds a map of category ID to all its descendant category IDs.
 * This enables hierarchical category filtering where selecting a parent
 * category also includes all its children and grandchildren.
 *
 * @param categories - Array of all categories
 * @returns Map where key is category ID and value is Set of all descendant IDs
 */
export function buildCategoryDescendantsMap(
  categories: Category[]
): Map<string, Set<string>> {
  const childrenMap = new Map<string, string[]>();
  const descendantsMap = new Map<string, Set<string>>();

  // Build parent -> children mapping
  for (const category of categories) {
    const categoryId = String(category.id);
    if (!childrenMap.has(categoryId)) {
      childrenMap.set(categoryId, []);
    }

    if (category.parentId) {
      const parentChildren = childrenMap.get(category.parentId) ?? [];
      parentChildren.push(categoryId);
      childrenMap.set(category.parentId, parentChildren);
    }
  }

  // Recursively collect all descendants for a category
  function collectDescendants(categoryId: string): Set<string> {
    // Return cached result if already computed
    const cached = descendantsMap.get(categoryId);
    if (cached) {
      return cached;
    }

    const descendants = new Set<string>();
    const children = childrenMap.get(categoryId) ?? [];

    for (const childId of children) {
      descendants.add(childId);
      // Recursively add grandchildren
      const grandchildren = collectDescendants(childId);
      grandchildren.forEach((grandchildId) => {
        descendants.add(grandchildId);
      });
    }

    descendantsMap.set(categoryId, descendants);
    return descendants;
  }

  // Compute descendants for all categories
  for (const category of categories) {
    collectDescendants(String(category.id));
  }

  return descendantsMap;
}

/**
 * Expands a list of selected category IDs to include all their descendants.
 * Used when filtering products - selecting a parent category should match
 * products in any descendant category.
 *
 * @param selectedIds - Array of selected category IDs
 * @param descendantsMap - Map from buildCategoryDescendantsMap
 * @returns Array of all category IDs (selected + their descendants)
 */
export function expandCategorySelection(
  selectedIds: string[],
  descendantsMap: Map<string, Set<string>>
): string[] {
  const expanded = new Set<string>(selectedIds);

  for (const id of selectedIds) {
    const descendants = descendantsMap.get(id);
    if (descendants) {
      descendants.forEach((descendantId) => {
        expanded.add(descendantId);
      });
    }
  }

  return Array.from(expanded);
}
