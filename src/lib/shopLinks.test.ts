import { describe, it, expect } from "vitest";
import { buildShopLink } from "./shopLinks";

describe("buildShopLink", () => {
  it("returns base path for empty params", () => {
    expect(buildShopLink({})).toBe("/shop-with-sidebar");
  });

  it("returns base path when all values are undefined", () => {
    expect(buildShopLink({ category: undefined, gender: undefined })).toBe(
      "/shop-with-sidebar"
    );
  });

  it("builds link with category only", () => {
    expect(buildShopLink({ category: "5" })).toBe(
      "/shop-with-sidebar?category=5"
    );
  });

  it("builds link with gender only", () => {
    expect(buildShopLink({ gender: "female" })).toBe(
      "/shop-with-sidebar?gender=female"
    );
  });

  it("builds link with both category and gender", () => {
    const result = buildShopLink({ category: "3", gender: "male" });
    expect(result).toContain("category=3");
    expect(result).toContain("gender=male");
    expect(result).toMatch(/^\/shop-with-sidebar\?/);
  });

  it("coerces numeric categoryId via string param", () => {
    expect(buildShopLink({ category: String(42) })).toBe(
      "/shop-with-sidebar?category=42"
    );
  });
});
