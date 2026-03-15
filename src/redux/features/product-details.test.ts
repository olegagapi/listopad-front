import { describe, it, expect } from "vitest";
import reducer, { updateproductDetails } from "./product-details";
import { defaultProduct } from "@/lib/defaultProduct";
import type { Product } from "@/types/product";

const sampleProduct: Product = {
  ...defaultProduct,
  id: "10",
  slug: "blue-jeans-10",
  title: "Blue Jeans",
  price: 1200,
};

describe("product-details slice", () => {
  it("sets product via updateproductDetails", () => {
    const state = reducer(undefined, updateproductDetails(sampleProduct));
    expect(state.value.id).toBe("10");
    expect(state.value.title).toBe("Blue Jeans");
  });

  it("replaces previous product", () => {
    const state1 = reducer(undefined, updateproductDetails(sampleProduct));
    const another = { ...sampleProduct, id: "20", title: "Red Skirt" };
    const state2 = reducer(state1, updateproductDetails(another));
    expect(state2.value.id).toBe("20");
  });

  it("starts with defaultProduct", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state.value).toEqual(defaultProduct);
  });
});
