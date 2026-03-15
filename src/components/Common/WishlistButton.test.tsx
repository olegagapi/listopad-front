import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import WishlistButton from "./WishlistButton";
import type { Product } from "@/types/product";
import { defaultProduct } from "@/lib/defaultProduct";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn() },
}));

import { trackEvent } from "@/lib/analytics";
import toast from "react-hot-toast";

const mockTrackEvent = vi.mocked(trackEvent);
const mockToast = vi.mocked(toast.success);

const product: Product = {
  ...defaultProduct,
  id: "42",
  slug: "test-product-42",
  title: "Test Product",
  price: 500,
  brandId: "7",
};

describe("WishlistButton", () => {
  beforeEach(() => {
    mockTrackEvent.mockClear();
    mockToast.mockClear();
  });

  it("renders heart icon", () => {
    renderWithProviders(<WishlistButton product={product} />);
    const button = screen.getByTestId("wishlist-toggle");
    expect(button).toBeInTheDocument();
  });

  it("shows 'Add to wishlist' label when not in wishlist", () => {
    renderWithProviders(<WishlistButton product={product} />);
    expect(screen.getByLabelText("Add to wishlist")).toBeInTheDocument();
  });

  it("shows 'Remove from wishlist' label when in wishlist", () => {
    renderWithProviders(<WishlistButton product={product} />, {
      preloadedState: {
        wishlistReducer: {
          items: [
            { id: "42", slug: "test-product-42", title: "Test Product", price: 500 },
          ],
        },
      },
    });
    expect(screen.getByLabelText("Remove from wishlist")).toBeInTheDocument();
  });

  it("dispatches toggleWishlistItem on click", () => {
    const { store } = renderWithProviders(<WishlistButton product={product} />);

    fireEvent.click(screen.getByTestId("wishlist-toggle"));

    const items = store.getState().wishlistReducer.items;
    expect(items).toHaveLength(1);
    expect(items[0]!.id).toBe("42");
  });

  it("tracks analytics on add (not remove)", () => {
    renderWithProviders(<WishlistButton product={product} />);

    fireEvent.click(screen.getByTestId("wishlist-toggle"));

    expect(mockTrackEvent).toHaveBeenCalledWith({
      eventType: "wishlist_add",
      brandId: 7,
      productId: 42,
    });
  });

  it("does not track analytics on remove", () => {
    renderWithProviders(<WishlistButton product={product} />, {
      preloadedState: {
        wishlistReducer: {
          items: [
            { id: "42", slug: "test-product-42", title: "Test Product", price: 500 },
          ],
        },
      },
    });

    fireEvent.click(screen.getByTestId("wishlist-toggle"));

    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it("shows toast on add", () => {
    renderWithProviders(<WishlistButton product={product} />);

    fireEvent.click(screen.getByTestId("wishlist-toggle"));

    expect(mockToast).toHaveBeenCalledWith("Added to wishlist");
  });

  it("shows toast on remove", () => {
    renderWithProviders(<WishlistButton product={product} />, {
      preloadedState: {
        wishlistReducer: {
          items: [
            { id: "42", slug: "test-product-42", title: "Test Product", price: 500 },
          ],
        },
      },
    });

    fireEvent.click(screen.getByTestId("wishlist-toggle"));

    expect(mockToast).toHaveBeenCalledWith("Removed from wishlist");
  });
});
