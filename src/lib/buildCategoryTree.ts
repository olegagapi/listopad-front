import type { Category } from "@/types/category";

export type CategoryWithChildren = Category & { children: CategoryWithChildren[] };

export function buildCategoryTree(categories: Category[]): CategoryWithChildren[] {
  const result: CategoryWithChildren[] = [];
  const map = new Map<string, CategoryWithChildren>();

  categories.forEach((cat) => {
    map.set(String(cat.id), { ...cat, children: [] });
  });

  categories.forEach((cat) => {
    const node = map.get(String(cat.id));
    if (node) {
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children.push(node);
      } else {
        result.push(node);
      }
    }
  });

  return result;
}
