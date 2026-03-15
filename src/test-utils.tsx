import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { NextIntlClientProvider } from "next-intl";
import wishlistReducer from "@/redux/features/wishlist-slice";
import quickViewReducer from "@/redux/features/quickView-slice";
import productDetailsReducer from "@/redux/features/product-details";
import type { RootState } from "@/redux/store";

// Minimal nested messages for tests — add keys as needed
const defaultMessages = {
  Wishlist: {
    addToWishlist: "Add to wishlist",
    removeFromWishlist: "Remove from wishlist",
  },
  Toast: {
    wishlistAdded: "Added to wishlist",
    wishlistRemoved: "Removed from wishlist",
  },
  ProductItem: {
    visitShop: "Visit shop",
  },
  Header: {
    genderSwitch: {
      women: "Women",
      men: "Men",
      all: "All",
    },
  },
};

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore;
  messages?: Record<string, unknown>;
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        wishlistReducer,
        quickViewReducer,
        productDetailsReducer,
      },
      preloadedState,
    }),
    messages,
    ...renderOptions
  }: CustomRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <NextIntlClientProvider locale="en" messages={(messages ?? defaultMessages) as Record<string, unknown>}>
          {children}
        </NextIntlClientProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
