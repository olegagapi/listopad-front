import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer, {
  addItemToWishlist,
  type WishListItem,
} from "@/redux/features/wishlist-slice";
import quickViewReducer from "@/redux/features/quickView-slice";
import productDetailsReducer from "@/redux/features/product-details";
import { useWishlistPersistence } from "./useWishlistPersistence";

const STORAGE_KEY = "listopad_wishlist";

const item1: WishListItem = {
  id: "1",
  slug: "dress-1",
  title: "Dress",
  price: 100,
};

function mockLocalStorage() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { store.set(key, value); }),
    removeItem: vi.fn((key: string) => { store.delete(key); }),
    clear: vi.fn(() => { store.clear(); }),
    get length() { return store.size; },
    key: vi.fn((index: number) => [...store.keys()][index] ?? null),
  };
}

function createStore() {
  return configureStore({
    reducer: {
      wishlistReducer,
      quickViewReducer,
      productDetailsReducer,
    },
  });
}

function createWrapper(store: ReturnType<typeof createStore>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(Provider, { store }, children);
  };
}

describe("useWishlistPersistence", () => {
  let storage: ReturnType<typeof mockLocalStorage>;

  beforeEach(() => {
    storage = mockLocalStorage();
    vi.stubGlobal("localStorage", storage);
  });

  it("loads items from localStorage on mount", () => {
    storage.setItem(STORAGE_KEY, JSON.stringify([item1]));
    const store = createStore();
    renderHook(() => useWishlistPersistence(), {
      wrapper: createWrapper(store),
    });

    expect(store.getState().wishlistReducer.items).toHaveLength(1);
    expect(store.getState().wishlistReducer.items[0]!.id).toBe("1");
  });

  it("handles empty localStorage", () => {
    const store = createStore();
    renderHook(() => useWishlistPersistence(), {
      wrapper: createWrapper(store),
    });
    expect(store.getState().wishlistReducer.items).toHaveLength(0);
  });

  it("handles corrupted localStorage gracefully", () => {
    storage.getItem.mockReturnValueOnce("not-json{{{");
    const store = createStore();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderHook(() => useWishlistPersistence(), {
      wrapper: createWrapper(store),
    });

    expect(store.getState().wishlistReducer.items).toHaveLength(0);
    consoleSpy.mockRestore();
  });

  it("handles non-array JSON gracefully", () => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ not: "array" }));
    const store = createStore();
    renderHook(() => useWishlistPersistence(), {
      wrapper: createWrapper(store),
    });
    expect(store.getState().wishlistReducer.items).toHaveLength(0);
  });

  it("saves to localStorage when items change", () => {
    const store = createStore();
    renderHook(() => useWishlistPersistence(), {
      wrapper: createWrapper(store),
    });

    act(() => {
      store.dispatch(addItemToWishlist(item1));
    });

    expect(storage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.stringContaining('"id":"1"')
    );
  });
});
