import { describe, it, expect } from "vitest";
import { filterProducts, hasActiveFilters } from "./filterProducts";
import { Product, PrimeColor, Gender } from "@/types/product";
import { FilterState, emptyFilters } from "@/types/filters";

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

describe("filterProducts", () => {
  describe("category filter", () => {
    it("returns all products when no categories selected", () => {
      const products = [
        createProduct({ id: "1", categoryIds: ["1"] }),
        createProduct({ id: "2", categoryIds: ["2"] }),
      ];
      const result = filterProducts(products, emptyFilters);
      expect(result).toHaveLength(2);
    });

    it("filters products by single category", () => {
      const products = [
        createProduct({ id: "1", categoryIds: ["1"] }),
        createProduct({ id: "2", categoryIds: ["2"] }),
        createProduct({ id: "3", categoryIds: ["1"] }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        categories: ["1"],
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(["1", "3"]);
    });

    it("filters products with OR logic for multiple categories", () => {
      const products = [
        createProduct({ id: "1", categoryIds: ["1"] }),
        createProduct({ id: "2", categoryIds: ["2"] }),
        createProduct({ id: "3", categoryIds: ["3"] }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        categories: ["1", "2"],
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(["1", "2"]);
    });

    it("matches product with any of its categories", () => {
      const products = [
        createProduct({ id: "1", categoryIds: ["1", "2"] }),
        createProduct({ id: "2", categoryIds: ["3"] }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        categories: ["2"],
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("1");
    });
  });

  describe("gender filter", () => {
    it("returns all products when no genders selected", () => {
      const products = [
        createProduct({ id: "1", gender: "male" }),
        createProduct({ id: "2", gender: "female" }),
      ];
      const result = filterProducts(products, emptyFilters);
      expect(result).toHaveLength(2);
    });

    it("filters products by single gender", () => {
      const products = [
        createProduct({ id: "1", gender: "male" }),
        createProduct({ id: "2", gender: "female" }),
        createProduct({ id: "3", gender: "male" }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        genders: ["male"],
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(["1", "3"]);
    });

    it("filters products with OR logic for multiple genders", () => {
      const products = [
        createProduct({ id: "1", gender: "male" }),
        createProduct({ id: "2", gender: "female" }),
        createProduct({ id: "3", gender: "unisex" }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        genders: ["male", "female"],
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(["1", "2"]);
    });

    it("excludes products without gender when gender filter is active", () => {
      const products = [
        createProduct({ id: "1", gender: "male" }),
        createProduct({ id: "2", gender: undefined }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        genders: ["male"],
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("1");
    });
  });

  describe("color filter", () => {
    it("returns all products when no colors selected", () => {
      const products = [
        createProduct({ id: "1", colors: ["black"] }),
        createProduct({ id: "2", colors: ["white"] }),
      ];
      const result = filterProducts(products, emptyFilters);
      expect(result).toHaveLength(2);
    });

    it("filters products by single color", () => {
      const products = [
        createProduct({ id: "1", colors: ["black"] }),
        createProduct({ id: "2", colors: ["white"] }),
        createProduct({ id: "3", colors: ["black", "red"] }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        colors: ["black"],
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(["1", "3"]);
    });

    it("filters products with OR logic for multiple colors", () => {
      const products = [
        createProduct({ id: "1", colors: ["black"] }),
        createProduct({ id: "2", colors: ["white"] }),
        createProduct({ id: "3", colors: ["red"] }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        colors: ["black", "white"],
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(["1", "2"]);
    });

    it("excludes products with empty colors array when color filter is active", () => {
      const products = [
        createProduct({ id: "1", colors: ["black"] }),
        createProduct({ id: "2", colors: [] }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        colors: ["black"],
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("1");
    });
  });

  describe("price filter", () => {
    it("returns all products when no price range set", () => {
      const products = [
        createProduct({ id: "1", price: 100 }),
        createProduct({ id: "2", price: 500 }),
        createProduct({ id: "3", price: 1000 }),
      ];
      const result = filterProducts(products, emptyFilters);
      expect(result).toHaveLength(3);
    });

    it("filters by minimum price", () => {
      const products = [
        createProduct({ id: "1", price: 100 }),
        createProduct({ id: "2", price: 500 }),
        createProduct({ id: "3", price: 1000 }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        price: { from: 500, to: null },
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(["2", "3"]);
    });

    it("filters by maximum price", () => {
      const products = [
        createProduct({ id: "1", price: 100 }),
        createProduct({ id: "2", price: 500 }),
        createProduct({ id: "3", price: 1000 }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        price: { from: null, to: 500 },
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(["1", "2"]);
    });

    it("filters by price range", () => {
      const products = [
        createProduct({ id: "1", price: 100 }),
        createProduct({ id: "2", price: 500 }),
        createProduct({ id: "3", price: 1000 }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        price: { from: 200, to: 800 },
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("2");
    });

    it("includes products at boundary prices", () => {
      const products = [
        createProduct({ id: "1", price: 500 }),
        createProduct({ id: "2", price: 1000 }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        price: { from: 500, to: 1000 },
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
    });
  });

  describe("combined filters", () => {
    it("applies AND logic between different filter types", () => {
      const products = [
        createProduct({ id: "1", categoryIds: ["1"], gender: "female", colors: ["black"], price: 500 }),
        createProduct({ id: "2", categoryIds: ["1"], gender: "male", colors: ["black"], price: 500 }),
        createProduct({ id: "3", categoryIds: ["2"], gender: "female", colors: ["black"], price: 500 }),
        createProduct({ id: "4", categoryIds: ["1"], gender: "female", colors: ["white"], price: 500 }),
        createProduct({ id: "5", categoryIds: ["1"], gender: "female", colors: ["black"], price: 2000 }),
      ];
      const filters: FilterState = {
        categories: ["1"],
        genders: ["female"],
        colors: ["black"],
        price: { from: 0, to: 1000 },
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("1");
    });

    it("returns empty array when no products match all criteria", () => {
      const products = [
        createProduct({ id: "1", categoryIds: ["1"], gender: "male" }),
        createProduct({ id: "2", categoryIds: ["2"], gender: "female" }),
      ];
      const filters: FilterState = {
        ...emptyFilters,
        categories: ["1"],
        genders: ["female"],
      };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(0);
    });
  });
});

describe("hasActiveFilters", () => {
  it("returns false for empty filters", () => {
    expect(hasActiveFilters(emptyFilters)).toBe(false);
  });

  it("returns true when categories are selected", () => {
    const filters: FilterState = { ...emptyFilters, categories: ["1"] };
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it("returns true when genders are selected", () => {
    const filters: FilterState = { ...emptyFilters, genders: ["male"] };
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it("returns true when colors are selected", () => {
    const filters: FilterState = { ...emptyFilters, colors: ["black"] };
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it("returns true when min price is set", () => {
    const filters: FilterState = { ...emptyFilters, price: { from: 100, to: null } };
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it("returns true when max price is set", () => {
    const filters: FilterState = { ...emptyFilters, price: { from: null, to: 1000 } };
    expect(hasActiveFilters(filters)).toBe(true);
  });
});
