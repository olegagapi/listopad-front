import { describe, it, expect } from "vitest";
import {
  buildFilterString,
  buildSortArray,
  documentToProduct,
  INDEX_NAMES,
  INDEX_SETTINGS,
} from "./meilisearch";
import type { MeilisearchProductDocument } from "@/types/search";
import type { SearchOptions, SortOption } from "@/types/search";

describe("INDEX_NAMES", () => {
  it("has correct index names for both locales", () => {
    expect(INDEX_NAMES.uk).toBe("products_uk");
    expect(INDEX_NAMES.en).toBe("products_en");
  });
});

describe("INDEX_SETTINGS", () => {
  it("has searchable attributes configured", () => {
    expect(INDEX_SETTINGS.searchableAttributes).toContain("title");
    expect(INDEX_SETTINGS.searchableAttributes).toContain("brandName");
    expect(INDEX_SETTINGS.searchableAttributes).toContain("description");
  });

  it("has filterable attributes configured", () => {
    expect(INDEX_SETTINGS.filterableAttributes).toContain("brandId");
    expect(INDEX_SETTINGS.filterableAttributes).toContain("categoryIds");
    expect(INDEX_SETTINGS.filterableAttributes).toContain("colors");
    expect(INDEX_SETTINGS.filterableAttributes).toContain("gender");
    expect(INDEX_SETTINGS.filterableAttributes).toContain("price");
  });

  it("has sortable attributes configured", () => {
    expect(INDEX_SETTINGS.sortableAttributes).toContain("price");
    expect(INDEX_SETTINGS.sortableAttributes).toContain("discountedPrice");
  });
});

describe("buildFilterString", () => {
  const baseOptions: SearchOptions = { locale: "uk" };

  it("returns empty string when no filters provided", () => {
    expect(buildFilterString(baseOptions)).toBe("");
  });

  describe("category filter", () => {
    it("builds single category filter", () => {
      const options: SearchOptions = {
        ...baseOptions,
        categoryIds: ["1"],
      };
      expect(buildFilterString(options)).toBe('(categoryIds = "1")');
    });

    it("builds multiple category filter with OR logic", () => {
      const options: SearchOptions = {
        ...baseOptions,
        categoryIds: ["1", "2"],
      };
      expect(buildFilterString(options)).toBe(
        '(categoryIds = "1" OR categoryIds = "2")'
      );
    });

    it("ignores empty categoryIds array", () => {
      const options: SearchOptions = {
        ...baseOptions,
        categoryIds: [],
      };
      expect(buildFilterString(options)).toBe("");
    });
  });

  describe("brand filter", () => {
    it("builds single brand filter", () => {
      const options: SearchOptions = {
        ...baseOptions,
        brandIds: ["10"],
      };
      expect(buildFilterString(options)).toBe('(brandId = "10")');
    });

    it("builds multiple brand filter with OR logic", () => {
      const options: SearchOptions = {
        ...baseOptions,
        brandIds: ["10", "20"],
      };
      expect(buildFilterString(options)).toBe(
        '(brandId = "10" OR brandId = "20")'
      );
    });
  });

  describe("gender filter", () => {
    it("builds single gender filter", () => {
      const options: SearchOptions = {
        ...baseOptions,
        genders: ["female"],
      };
      expect(buildFilterString(options)).toBe('(gender = "female")');
    });

    it("builds multiple gender filter with OR logic", () => {
      const options: SearchOptions = {
        ...baseOptions,
        genders: ["male", "female"],
      };
      expect(buildFilterString(options)).toBe(
        '(gender = "male" OR gender = "female")'
      );
    });
  });

  describe("color filter", () => {
    it("builds single color filter", () => {
      const options: SearchOptions = {
        ...baseOptions,
        colors: ["black"],
      };
      expect(buildFilterString(options)).toBe('(colors = "black")');
    });

    it("builds multiple color filter with OR logic", () => {
      const options: SearchOptions = {
        ...baseOptions,
        colors: ["black", "white"],
      };
      expect(buildFilterString(options)).toBe(
        '(colors = "black" OR colors = "white")'
      );
    });
  });

  describe("price filter", () => {
    it("builds minimum price filter", () => {
      const options: SearchOptions = {
        ...baseOptions,
        minPrice: 100,
      };
      expect(buildFilterString(options)).toBe("discountedPrice >= 100");
    });

    it("builds maximum price filter", () => {
      const options: SearchOptions = {
        ...baseOptions,
        maxPrice: 1000,
      };
      expect(buildFilterString(options)).toBe("discountedPrice <= 1000");
    });

    it("builds price range filter", () => {
      const options: SearchOptions = {
        ...baseOptions,
        minPrice: 100,
        maxPrice: 1000,
      };
      expect(buildFilterString(options)).toBe(
        "discountedPrice >= 100 AND discountedPrice <= 1000"
      );
    });

    it("handles zero as minimum price", () => {
      const options: SearchOptions = {
        ...baseOptions,
        minPrice: 0,
      };
      expect(buildFilterString(options)).toBe("discountedPrice >= 0");
    });
  });

  describe("combined filters", () => {
    it("combines multiple filter types with AND logic", () => {
      const options: SearchOptions = {
        ...baseOptions,
        categoryIds: ["1"],
        brandIds: ["10"],
        genders: ["female"],
        colors: ["black"],
        minPrice: 100,
        maxPrice: 1000,
      };
      const result = buildFilterString(options);

      expect(result).toContain('(categoryIds = "1")');
      expect(result).toContain('(brandId = "10")');
      expect(result).toContain('(gender = "female")');
      expect(result).toContain('(colors = "black")');
      expect(result).toContain("discountedPrice >= 100");
      expect(result).toContain("discountedPrice <= 1000");
      expect(result.split(" AND ").length).toBe(6);
    });

    it("combines category and gender filters", () => {
      const options: SearchOptions = {
        ...baseOptions,
        categoryIds: ["1", "2"],
        genders: ["female"],
      };
      expect(buildFilterString(options)).toBe(
        '(categoryIds = "1" OR categoryIds = "2") AND (gender = "female")'
      );
    });
  });
});

describe("buildSortArray", () => {
  it("returns undefined for undefined sort", () => {
    expect(buildSortArray(undefined)).toBeUndefined();
  });

  it('returns undefined for "relevance" sort', () => {
    expect(buildSortArray("relevance")).toBeUndefined();
  });

  it("returns array with sort option for price:asc", () => {
    expect(buildSortArray("price:asc")).toEqual(["price:asc"]);
  });

  it("returns array with sort option for price:desc", () => {
    expect(buildSortArray("price:desc")).toEqual(["price:desc"]);
  });

  it("returns array with sort option for discountedPrice:asc", () => {
    expect(buildSortArray("discountedPrice:asc")).toEqual([
      "discountedPrice:asc",
    ]);
  });

  it("returns array with sort option for discountedPrice:desc", () => {
    expect(buildSortArray("discountedPrice:desc")).toEqual([
      "discountedPrice:desc",
    ]);
  });
});

describe("documentToProduct", () => {
  const createDocument = (
    overrides: Partial<MeilisearchProductDocument> = {}
  ): MeilisearchProductDocument => ({
    id: "123",
    slug: "test-product-123",
    title: "Test Product",
    brandId: "10",
    brandName: "Test Brand",
    categoryIds: ["1", "2"],
    categoryNames: ["Category 1", "Category 2"],
    tags: ["tag1", "tag2"],
    colors: ["black", "white"],
    gender: "female",
    description: "Test description",
    price: 1000,
    discountedPrice: 800,
    previewImage: "https://example.com/image.jpg",
    ...overrides,
  });

  it("transforms document to product with all fields", () => {
    const doc = createDocument();
    const product = documentToProduct(doc);

    expect(product.id).toBe("123");
    expect(product.slug).toBe("test-product-123");
    expect(product.title).toBe("Test Product");
    expect(product.brandId).toBe("10");
    expect(product.brandName).toBe("Test Brand");
    expect(product.categoryIds).toEqual(["1", "2"]);
    expect(product.categoryNames).toEqual(["Category 1", "Category 2"]);
    expect(product.tags).toEqual(["tag1", "tag2"]);
    expect(product.colors).toEqual(["black", "white"]);
    expect(product.gender).toBe("female");
    expect(product.description).toBe("Test description");
    expect(product.price).toBe(1000);
    expect(product.discountedPrice).toBe(800);
  });

  it("sets currency to UAH", () => {
    const product = documentToProduct(createDocument());
    expect(product.currency).toBe("UAH");
  });

  it("sets reviews to 0", () => {
    const product = documentToProduct(createDocument());
    expect(product.reviews).toBe(0);
  });

  it("handles null brandId", () => {
    const doc = createDocument({ brandId: null });
    const product = documentToProduct(doc);
    expect(product.brandId).toBeUndefined();
  });

  it("handles null brandName", () => {
    const doc = createDocument({ brandName: null });
    const product = documentToProduct(doc);
    expect(product.brandName).toBeUndefined();
  });

  it("handles null gender", () => {
    const doc = createDocument({ gender: null });
    const product = documentToProduct(doc);
    expect(product.gender).toBeUndefined();
  });

  it("handles empty previewImage", () => {
    const doc = createDocument({ previewImage: "" });
    const product = documentToProduct(doc);
    expect(product.imgs.thumbnails).toEqual([]);
    expect(product.imgs.previews).toEqual([]);
  });

  it("populates imgs from previewImage", () => {
    const doc = createDocument({ previewImage: "https://example.com/img.jpg" });
    const product = documentToProduct(doc);
    expect(product.imgs.thumbnails).toEqual(["https://example.com/img.jpg"]);
    expect(product.imgs.previews).toEqual(["https://example.com/img.jpg"]);
  });

  it("sets externalUrl and instagramUrl to null", () => {
    const product = documentToProduct(createDocument());
    expect(product.externalUrl).toBeNull();
    expect(product.instagramUrl).toBeNull();
  });

  it("sets shortDescription to null", () => {
    const product = documentToProduct(createDocument());
    expect(product.shortDescription).toBeNull();
  });
});
