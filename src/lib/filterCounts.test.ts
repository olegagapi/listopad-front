import { describe, it, expect } from "vitest";
import { calculateCategoryCounts, calculateGenderCounts } from "./filterCounts";
import { Product, PrimeColor, Gender } from "@/types/product";
import { Category } from "@/types/category";

const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "1",
  slug: "test-product-1",
  title: "Test Product",
  reviews: 0,
  price: 1000,
  discountedPrice: 1000,
  currency: "UAH",
  categoryIds: ["1"],
  categoryNames: ["Category 1"],
  tags: [],
  colors: ["black"] as PrimeColor[],
  gender: "female" as Gender,
  imgs: { previews: [], thumbnails: [] },
  ...overrides,
});

const createCategory = (id: string, parentId?: string | null): Category => ({
  id,
  name: `Category ${id}`,
  parentId,
});

describe("calculateCategoryCounts", () => {
  it("counts products in each category", () => {
    const products = [
      createProduct({ id: "1", categoryIds: ["1"] }),
      createProduct({ id: "2", categoryIds: ["1"] }),
      createProduct({ id: "3", categoryIds: ["2"] }),
    ];
    const categories: Category[] = [
      createCategory("1"),
      createCategory("2"),
    ];
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set()],
      ["2", new Set()],
    ]);

    const result = calculateCategoryCounts(products, categories, descendantsMap);

    expect(result.get("1")).toBe(2);
    expect(result.get("2")).toBe(1);
  });

  it("includes descendant counts in parent category", () => {
    const products = [
      createProduct({ id: "1", categoryIds: ["1"] }),
      createProduct({ id: "2", categoryIds: ["2"] }),
      createProduct({ id: "3", categoryIds: ["3"] }),
    ];
    // Hierarchy: 1 -> 2 -> 3
    const categories: Category[] = [
      createCategory("1"),
      createCategory("2", "1"),
      createCategory("3", "2"),
    ];
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set(["2", "3"])],
      ["2", new Set(["3"])],
      ["3", new Set()],
    ]);

    const result = calculateCategoryCounts(products, categories, descendantsMap);

    expect(result.get("1")).toBe(3); // 1 direct + 1 from "2" + 1 from "3"
    expect(result.get("2")).toBe(2); // 1 direct + 1 from "3"
    expect(result.get("3")).toBe(1); // 1 direct
  });

  it("handles products in multiple categories", () => {
    const products = [
      createProduct({ id: "1", categoryIds: ["1", "2"] }),
    ];
    const categories: Category[] = [
      createCategory("1"),
      createCategory("2"),
    ];
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set()],
      ["2", new Set()],
    ]);

    const result = calculateCategoryCounts(products, categories, descendantsMap);

    expect(result.get("1")).toBe(1);
    expect(result.get("2")).toBe(1);
  });

  it("returns 0 for categories with no products", () => {
    const products = [
      createProduct({ id: "1", categoryIds: ["1"] }),
    ];
    const categories: Category[] = [
      createCategory("1"),
      createCategory("2"),
    ];
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set()],
      ["2", new Set()],
    ]);

    const result = calculateCategoryCounts(products, categories, descendantsMap);

    expect(result.get("1")).toBe(1);
    expect(result.get("2")).toBe(0);
  });

  it("handles empty products array", () => {
    const products: Product[] = [];
    const categories: Category[] = [
      createCategory("1"),
    ];
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set()],
    ]);

    const result = calculateCategoryCounts(products, categories, descendantsMap);

    expect(result.get("1")).toBe(0);
  });

  it("handles complex hierarchy with multiple branches", () => {
    // Tree:
    // 1 (parent)
    // ├── 2 (child)
    // │   └── 4 (grandchild)
    // └── 3 (child)
    const products = [
      createProduct({ id: "p1", categoryIds: ["1"] }),
      createProduct({ id: "p2", categoryIds: ["2"] }),
      createProduct({ id: "p3", categoryIds: ["3"] }),
      createProduct({ id: "p4", categoryIds: ["4"] }),
    ];
    const categories: Category[] = [
      createCategory("1"),
      createCategory("2", "1"),
      createCategory("3", "1"),
      createCategory("4", "2"),
    ];
    const descendantsMap = new Map<string, Set<string>>([
      ["1", new Set(["2", "3", "4"])],
      ["2", new Set(["4"])],
      ["3", new Set()],
      ["4", new Set()],
    ]);

    const result = calculateCategoryCounts(products, categories, descendantsMap);

    expect(result.get("1")).toBe(4); // All products
    expect(result.get("2")).toBe(2); // p2 + p4
    expect(result.get("3")).toBe(1); // p3
    expect(result.get("4")).toBe(1); // p4
  });
});

describe("calculateGenderCounts", () => {
  it("counts products by gender", () => {
    const products = [
      createProduct({ id: "1", gender: "female" }),
      createProduct({ id: "2", gender: "female" }),
      createProduct({ id: "3", gender: "male" }),
    ];

    const result = calculateGenderCounts(products);

    expect(result.get("female")).toBe(2);
    expect(result.get("male")).toBe(1);
  });

  it("counts unisex products", () => {
    const products = [
      createProduct({ id: "1", gender: "unisex" }),
      createProduct({ id: "2", gender: "unisex" }),
    ];

    const result = calculateGenderCounts(products);

    expect(result.get("unisex")).toBe(2);
  });

  it("ignores products without gender", () => {
    const products = [
      createProduct({ id: "1", gender: "female" }),
      createProduct({ id: "2", gender: undefined }),
    ];

    const result = calculateGenderCounts(products);

    expect(result.get("female")).toBe(1);
    expect(result.get("male")).toBeUndefined();
    expect(result.get("unisex")).toBeUndefined();
  });

  it("returns empty map for empty products array", () => {
    const result = calculateGenderCounts([]);

    expect(result.size).toBe(0);
  });

  it("handles all gender types", () => {
    const products = [
      createProduct({ id: "1", gender: "female" }),
      createProduct({ id: "2", gender: "male" }),
      createProduct({ id: "3", gender: "unisex" }),
    ];

    const result = calculateGenderCounts(products);

    expect(result.get("female")).toBe(1);
    expect(result.get("male")).toBe(1);
    expect(result.get("unisex")).toBe(1);
  });
});
