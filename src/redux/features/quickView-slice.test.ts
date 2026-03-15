import { describe, it, expect } from "vitest";
import reducer, { updateQuickView, resetQuickView } from "./quickView-slice";
import { defaultProduct } from "@/lib/defaultProduct";
import type { Product } from "@/types/product";

const sampleProduct: Product = {
  ...defaultProduct,
  id: "42",
  slug: "summer-top-42",
  title: "Summer Top",
  price: 500,
};

describe("quickView-slice", () => {
  it("sets product via updateQuickView", () => {
    const state = reducer(undefined, updateQuickView(sampleProduct));
    expect(state.value.id).toBe("42");
    expect(state.value.title).toBe("Summer Top");
  });

  it("replaces previous product", () => {
    const state1 = reducer(undefined, updateQuickView(sampleProduct));
    const another = { ...sampleProduct, id: "99", title: "Another" };
    const state2 = reducer(state1, updateQuickView(another));
    expect(state2.value.id).toBe("99");
  });

  it("resets to defaultProduct", () => {
    const state1 = reducer(undefined, updateQuickView(sampleProduct));
    const state2 = reducer(state1, resetQuickView());
    expect(state2.value).toEqual(defaultProduct);
  });

  it("starts with defaultProduct", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state.value).toEqual(defaultProduct);
  });
});
