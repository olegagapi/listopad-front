import { describe, it, expect } from "vitest";
import reducer, {
  addItemToWishlist,
  removeItemFromWishlist,
  removeAllItemsFromWishlist,
  toggleWishlistItem,
  hydrateWishlist,
  type WishListItem,
} from "./wishlist-slice";

const item1: WishListItem = {
  id: "1",
  slug: "dress-1",
  title: "Dress",
  price: 100,
};

const item2: WishListItem = {
  id: "2",
  slug: "shirt-2",
  title: "Shirt",
  price: 200,
};

describe("wishlist-slice", () => {
  const empty = { items: [] };

  describe("addItemToWishlist", () => {
    it("adds item to empty wishlist", () => {
      const state = reducer(empty, addItemToWishlist(item1));
      expect(state.items).toHaveLength(1);
      expect(state.items[0]!.id).toBe("1");
    });

    it("prevents duplicate items", () => {
      const withOne = reducer(empty, addItemToWishlist(item1));
      const state = reducer(withOne, addItemToWishlist(item1));
      expect(state.items).toHaveLength(1);
    });

    it("adds different items", () => {
      const withOne = reducer(empty, addItemToWishlist(item1));
      const state = reducer(withOne, addItemToWishlist(item2));
      expect(state.items).toHaveLength(2);
    });
  });

  describe("removeItemFromWishlist", () => {
    it("removes item by id", () => {
      const withOne = reducer(empty, addItemToWishlist(item1));
      const state = reducer(withOne, removeItemFromWishlist("1"));
      expect(state.items).toHaveLength(0);
    });

    it("no-op when item not found", () => {
      const withOne = reducer(empty, addItemToWishlist(item1));
      const state = reducer(withOne, removeItemFromWishlist("999"));
      expect(state.items).toHaveLength(1);
    });
  });

  describe("removeAllItemsFromWishlist", () => {
    it("clears all items", () => {
      let state = reducer(empty, addItemToWishlist(item1));
      state = reducer(state, addItemToWishlist(item2));
      state = reducer(state, removeAllItemsFromWishlist());
      expect(state.items).toHaveLength(0);
    });

    it("handles already empty list", () => {
      const state = reducer(empty, removeAllItemsFromWishlist());
      expect(state.items).toHaveLength(0);
    });
  });

  describe("toggleWishlistItem", () => {
    it("adds when absent", () => {
      const state = reducer(empty, toggleWishlistItem(item1));
      expect(state.items).toHaveLength(1);
    });

    it("removes when present", () => {
      const withOne = reducer(empty, addItemToWishlist(item1));
      const state = reducer(withOne, toggleWishlistItem(item1));
      expect(state.items).toHaveLength(0);
    });
  });

  describe("hydrateWishlist", () => {
    it("replaces entire array", () => {
      const state = reducer(empty, hydrateWishlist([item1, item2]));
      expect(state.items).toHaveLength(2);
    });

    it("handles empty hydration", () => {
      const withOne = reducer(empty, addItemToWishlist(item1));
      const state = reducer(withOne, hydrateWishlist([]));
      expect(state.items).toHaveLength(0);
    });
  });
});
