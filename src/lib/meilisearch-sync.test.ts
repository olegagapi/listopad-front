import { describe, it, expect, vi } from "vitest";
import type { PrimeColor, Gender } from "@/types/product";

// Mock Supabase to prevent env var errors
vi.mock("./supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock meilisearch client functions
vi.mock("./meilisearch", () => ({
  getAdminClient: vi.fn(),
  getProductIndex: vi.fn(),
  INDEX_NAMES: { uk: "products_uk", en: "products_en" },
  INDEX_SETTINGS: {},
  EMBEDDER_CONFIG: {},
}));

// Import after mocking
import { transformProductToDocument } from "./meilisearch-sync";

type RawProduct = {
  id: number;
  name_uk: string | null;
  name_en: string | null;
  product_description_uk: string | null;
  product_description_en: string | null;
  price: number;
  brand_id: number | null;
  category_id: number | null;
  colors: PrimeColor[] | null;
  gender: Gender | null;
  tags: string[] | null;
  preview_image: string | null;
  brands: { name_uk: string | null; name_en: string | null } | null;
  categories: { name_uk: string | null; name_en: string | null } | null;
};

const createRawProduct = (overrides: Partial<RawProduct> = {}): RawProduct => ({
  id: 123,
  name_uk: "Тестовий продукт",
  name_en: "Test Product",
  product_description_uk: "Опис українською",
  product_description_en: "Description in English",
  price: 1000,
  brand_id: 10,
  category_id: 5,
  colors: ["black", "white"],
  gender: "female",
  tags: ["tag1", "tag2"],
  preview_image: "https://example.com/image.jpg",
  brands: { name_uk: "Бренд", name_en: "Brand" },
  categories: { name_uk: "Категорія", name_en: "Category" },
  ...overrides,
});

describe("transformProductToDocument", () => {
  describe("locale-specific content", () => {
    it("uses Ukrainian content for uk locale", () => {
      const product = createRawProduct();
      const doc = transformProductToDocument(product, "uk");

      expect(doc.title).toBe("Тестовий продукт");
      expect(doc.description).toBe("Опис українською");
      expect(doc.brandName).toBe("Бренд");
      expect(doc.categoryNames).toEqual(["Категорія"]);
    });

    it("uses English content for en locale", () => {
      const product = createRawProduct();
      const doc = transformProductToDocument(product, "en");

      expect(doc.title).toBe("Test Product");
      expect(doc.description).toBe("Description in English");
      expect(doc.brandName).toBe("Brand");
      expect(doc.categoryNames).toEqual(["Category"]);
    });
  });

  describe("id and slug", () => {
    it("converts numeric id to string", () => {
      const product = createRawProduct({ id: 456 });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.id).toBe("456");
    });

    it("generates slug from name and id", () => {
      const product = createRawProduct({ id: 789, name_uk: "Літня сукня" });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.slug).toContain("789");
    });

    it("generates locale-specific slug", () => {
      const product = createRawProduct({
        id: 100,
        name_uk: "Чорна сукня",
        name_en: "Black Dress",
      });
      const ukDoc = transformProductToDocument(product, "uk");
      const enDoc = transformProductToDocument(product, "en");

      expect(ukDoc.slug).toContain("100");
      expect(enDoc.slug).toBe("black-dress-100");
    });
  });

  describe("brand handling", () => {
    it("converts brand_id to string brandId", () => {
      const product = createRawProduct({ brand_id: 42 });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.brandId).toBe("42");
    });

    it("handles null brand_id", () => {
      const product = createRawProduct({ brand_id: null });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.brandId).toBeNull();
    });

    it("handles null brands relation", () => {
      const product = createRawProduct({ brands: null });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.brandName).toBeNull();
    });

    it("handles null brand name in locale", () => {
      const product = createRawProduct({
        brands: { name_uk: null, name_en: "Brand" },
      });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.brandName).toBeNull();
    });
  });

  describe("category handling", () => {
    it("converts category_id to string array", () => {
      const product = createRawProduct({ category_id: 15 });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.categoryIds).toEqual(["15"]);
    });

    it("handles null category_id", () => {
      const product = createRawProduct({ category_id: null });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.categoryIds).toEqual([]);
    });

    it("handles null categories relation", () => {
      const product = createRawProduct({ categories: null });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.categoryNames).toEqual([]);
    });

    it("handles null category name in locale", () => {
      const product = createRawProduct({
        categories: { name_uk: null, name_en: "Category" },
      });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.categoryNames).toEqual([]);
    });
  });

  describe("arrays and primitives", () => {
    it("preserves tags array", () => {
      const product = createRawProduct({ tags: ["sale", "new", "featured"] });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.tags).toEqual(["sale", "new", "featured"]);
    });

    it("handles null tags", () => {
      const product = createRawProduct({ tags: null });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.tags).toEqual([]);
    });

    it("preserves colors array", () => {
      const product = createRawProduct({ colors: ["red", "blue", "green"] });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.colors).toEqual(["red", "blue", "green"]);
    });

    it("handles null colors", () => {
      const product = createRawProduct({ colors: null });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.colors).toEqual([]);
    });

    it("preserves gender", () => {
      const product = createRawProduct({ gender: "male" });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.gender).toBe("male");
    });

    it("handles null gender", () => {
      const product = createRawProduct({ gender: null });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.gender).toBeNull();
    });

    it("preserves price", () => {
      const product = createRawProduct({ price: 2500 });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.price).toBe(2500);
    });

    it("sets discountedPrice to same as price", () => {
      const product = createRawProduct({ price: 1500 });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.discountedPrice).toBe(1500);
    });
  });

  describe("preview image", () => {
    it("preserves preview_image", () => {
      const product = createRawProduct({
        preview_image: "https://storage.example.com/product.webp",
      });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.previewImage).toBe("https://storage.example.com/product.webp");
    });

    it("handles null preview_image", () => {
      const product = createRawProduct({ preview_image: null });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.previewImage).toBe("");
    });
  });

  describe("fallback for missing locale content", () => {
    it("uses empty string when name is null", () => {
      const product = createRawProduct({ name_uk: null, name_en: null });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.title).toBe("");
    });

    it("uses null when description is null", () => {
      const product = createRawProduct({
        product_description_uk: null,
        product_description_en: null,
      });
      const doc = transformProductToDocument(product, "uk");
      expect(doc.description).toBeNull();
    });
  });
});
