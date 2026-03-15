import { describe, it, expect } from "vitest";
import { buildCategoryTree } from "./buildCategoryTree";
import type { Category } from "@/types/category";

function cat(id: string | number, parentId?: string | null, name?: string): Category {
  return { id, parentId: parentId ?? null, name: name ?? `Cat ${id}` };
}

describe("buildCategoryTree", () => {
  it("returns empty array for empty input", () => {
    expect(buildCategoryTree([])).toEqual([]);
  });

  it("puts all items at root when no parents", () => {
    const result = buildCategoryTree([cat("1"), cat("2")]);
    expect(result).toHaveLength(2);
    expect(result[0]!.children).toEqual([]);
    expect(result[1]!.children).toEqual([]);
  });

  it("nests a single child under its parent", () => {
    const result = buildCategoryTree([cat("1"), cat("2", "1")]);
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("1");
    expect(result[0]!.children).toHaveLength(1);
    expect(result[0]!.children[0]!.id).toBe("2");
  });

  it("nests multiple children under one parent", () => {
    const result = buildCategoryTree([
      cat("1"),
      cat("2", "1"),
      cat("3", "1"),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]!.children).toHaveLength(2);
  });

  it("builds multi-level nesting", () => {
    const result = buildCategoryTree([
      cat("1"),
      cat("2", "1"),
      cat("3", "2"),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]!.children[0]!.children[0]!.id).toBe("3");
  });

  it("treats orphan parentId (non-existent parent) as root", () => {
    const result = buildCategoryTree([cat("1", "999")]);
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("1");
  });

  it("treats null parentId as root", () => {
    const result = buildCategoryTree([cat("1", null)]);
    expect(result).toHaveLength(1);
  });

  it("handles numeric ids by converting to string keys", () => {
    const result = buildCategoryTree([
      cat(1),
      cat(2, "1"),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]!.children).toHaveLength(1);
  });

  it("preserves category properties", () => {
    const result = buildCategoryTree([cat("1", null, "Clothing")]);
    expect(result[0]!.name).toBe("Clothing");
  });

  it("handles mixed root and nested categories", () => {
    const result = buildCategoryTree([
      cat("1"),
      cat("2"),
      cat("3", "1"),
      cat("4", "2"),
    ]);
    expect(result).toHaveLength(2);
    expect(result[0]!.children).toHaveLength(1);
    expect(result[1]!.children).toHaveLength(1);
  });
});
