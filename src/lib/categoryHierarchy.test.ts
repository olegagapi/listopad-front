import { describe, it, expect } from "vitest";
import { buildCategoryDescendantsMap, expandCategorySelection } from "./categoryHierarchy";
import { Category } from "@/types/category";

const createCategory = (id: string, parentId?: string | null): Category => ({
  id,
  name: `Category ${id}`,
  parentId,
});

describe("buildCategoryDescendantsMap", () => {
  it("returns empty sets for categories with no children", () => {
    const categories: Category[] = [
      createCategory("1"),
      createCategory("2"),
    ];
    const result = buildCategoryDescendantsMap(categories);

    expect(result.get("1")).toEqual(new Set());
    expect(result.get("2")).toEqual(new Set());
  });

  it("maps parent to direct children", () => {
    const categories: Category[] = [
      createCategory("1"),
      createCategory("2", "1"),
      createCategory("3", "1"),
    ];
    const result = buildCategoryDescendantsMap(categories);

    expect(result.get("1")).toEqual(new Set(["2", "3"]));
    expect(result.get("2")).toEqual(new Set());
    expect(result.get("3")).toEqual(new Set());
  });

  it("includes grandchildren in descendants", () => {
    const categories: Category[] = [
      createCategory("1"),
      createCategory("2", "1"),
      createCategory("3", "2"),
    ];
    const result = buildCategoryDescendantsMap(categories);

    expect(result.get("1")).toEqual(new Set(["2", "3"]));
    expect(result.get("2")).toEqual(new Set(["3"]));
    expect(result.get("3")).toEqual(new Set());
  });

  it("handles complex hierarchy with multiple branches", () => {
    // Tree structure:
    // 1
    // ├── 2
    // │   ├── 4
    // │   └── 5
    // └── 3
    //     └── 6
    const categories: Category[] = [
      createCategory("1"),
      createCategory("2", "1"),
      createCategory("3", "1"),
      createCategory("4", "2"),
      createCategory("5", "2"),
      createCategory("6", "3"),
    ];
    const result = buildCategoryDescendantsMap(categories);

    expect(result.get("1")).toEqual(new Set(["2", "3", "4", "5", "6"]));
    expect(result.get("2")).toEqual(new Set(["4", "5"]));
    expect(result.get("3")).toEqual(new Set(["6"]));
    expect(result.get("4")).toEqual(new Set());
    expect(result.get("5")).toEqual(new Set());
    expect(result.get("6")).toEqual(new Set());
  });

  it("handles categories with null parentId as root", () => {
    const categories: Category[] = [
      createCategory("1", null),
      createCategory("2", "1"),
    ];
    const result = buildCategoryDescendantsMap(categories);

    expect(result.get("1")).toEqual(new Set(["2"]));
  });

  it("handles empty categories array", () => {
    const result = buildCategoryDescendantsMap([]);
    expect(result.size).toBe(0);
  });
});

describe("expandCategorySelection", () => {
  it("returns the same IDs when no descendants exist", () => {
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set()],
      ["2", new Set()],
    ]);
    const result = expandCategorySelection(["1"], descendantsMap);

    expect(result).toEqual(["1"]);
  });

  it("expands selection to include direct descendants", () => {
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set(["2", "3"])],
      ["2", new Set()],
      ["3", new Set()],
    ]);
    const result = expandCategorySelection(["1"], descendantsMap);

    expect(result.sort()).toEqual(["1", "2", "3"]);
  });

  it("expands selection to include all nested descendants", () => {
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set(["2", "3", "4"])],
      ["2", new Set(["3", "4"])],
      ["3", new Set(["4"])],
      ["4", new Set()],
    ]);
    const result = expandCategorySelection(["1"], descendantsMap);

    expect(result.sort()).toEqual(["1", "2", "3", "4"]);
  });

  it("handles multiple selected categories", () => {
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set(["3"])],
      ["2", new Set(["4"])],
      ["3", new Set()],
      ["4", new Set()],
    ]);
    const result = expandCategorySelection(["1", "2"], descendantsMap);

    expect(result.sort()).toEqual(["1", "2", "3", "4"]);
  });

  it("deduplicates overlapping descendants", () => {
    // 1 and 2 both have 3 as descendant
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set(["2", "3"])],
      ["2", new Set(["3"])],
      ["3", new Set()],
    ]);
    const result = expandCategorySelection(["1", "2"], descendantsMap);

    expect(result.sort()).toEqual(["1", "2", "3"]);
  });

  it("returns empty array for empty selection", () => {
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set(["2"])],
    ]);
    const result = expandCategorySelection([], descendantsMap);

    expect(result).toEqual([]);
  });

  it("handles category IDs not in the map", () => {
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set(["2"])],
    ]);
    const result = expandCategorySelection(["999"], descendantsMap);

    expect(result).toEqual(["999"]);
  });
});
