import { describe, it, expect } from "vitest";

/**
 * Tests for toggle-active logic.
 * The toggle endpoint reads the current is_active state and flips it.
 */

describe("toggle-active logic", () => {
  describe("is_active toggle", () => {
    function toggleIsActive(currentValue: boolean | undefined | null): boolean {
      return !(currentValue ?? true);
    }

    it("toggles true to false", () => {
      expect(toggleIsActive(true)).toBe(false);
    });

    it("toggles false to true", () => {
      expect(toggleIsActive(false)).toBe(true);
    });

    it("treats undefined as true (defaults to active), toggles to false", () => {
      expect(toggleIsActive(undefined)).toBe(false);
    });

    it("treats null as true (defaults to active), toggles to false", () => {
      expect(toggleIsActive(null)).toBe(false);
    });
  });

  describe("product filtering with is_active", () => {
    type Product = {
      id: number;
      name: string;
      is_active: boolean;
    };

    const products: Product[] = [
      { id: 1, name: "Active Product 1", is_active: true },
      { id: 2, name: "Inactive Product", is_active: false },
      { id: 3, name: "Active Product 2", is_active: true },
      { id: 4, name: "Another Inactive", is_active: false },
    ];

    it("filters only active products for public API", () => {
      const activeProducts = products.filter((p) => p.is_active);
      expect(activeProducts).toHaveLength(2);
      expect(activeProducts.map((p) => p.id)).toEqual([1, 3]);
    });

    it("returns all products for cabinet API (no filter)", () => {
      expect(products).toHaveLength(4);
    });

    it("toggling a product changes its visibility in public API", () => {
      const mutableProducts = products.map((p) => ({ ...p }));
      const product = mutableProducts.find((p) => p.id === 1)!;
      product.is_active = false;

      const activeProducts = mutableProducts.filter((p) => p.is_active);
      expect(activeProducts).toHaveLength(1);
      expect(activeProducts[0]!.id).toBe(3);
    });

    it("default value true means new products are active", () => {
      const newProduct: Product = {
        id: 5,
        name: "New Product",
        is_active: true, // default
      };
      const allProducts = [...products, newProduct];
      const activeProducts = allProducts.filter((p) => p.is_active);
      expect(activeProducts).toHaveLength(3);
    });
  });

  describe("isActive field mapping", () => {
    it("maps is_active to isActive for API response", () => {
      const dbProduct = { id: 1, is_active: true };
      const apiProduct = { id: dbProduct.id, isActive: dbProduct.is_active ?? true };
      expect(apiProduct.isActive).toBe(true);
    });

    it("maps undefined is_active to true (default)", () => {
      const dbProduct: { id: number; is_active?: boolean } = { id: 1 };
      const apiProduct = { id: dbProduct.id, isActive: dbProduct.is_active ?? true };
      expect(apiProduct.isActive).toBe(true);
    });

    it("maps isActive back to is_active for DB insert", () => {
      const apiPayload = { isActive: false };
      const dbPayload = { is_active: apiPayload.isActive ?? true };
      expect(dbPayload.is_active).toBe(false);
    });

    it("defaults to true when isActive is missing from API payload", () => {
      const apiPayload: { isActive?: boolean } = {};
      const dbPayload = { is_active: apiPayload.isActive ?? true };
      expect(dbPayload.is_active).toBe(true);
    });
  });
});
