import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import SingleItem from "./SingleItem";

vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const item = {
  id: "10",
  slug: "blue-jeans-10",
  title: "Blue Jeans",
  price: 1200,
  currency: "UAH",
  externalUrl: "https://example.com/buy",
  imgs: {
    thumbnails: ["/img/thumb.jpg"],
    previews: ["/img/preview.jpg"],
  },
};

describe("SingleItem", () => {
  it("renders product title", () => {
    renderWithProviders(<SingleItem item={item} />);
    expect(screen.getByText("Blue Jeans")).toBeInTheDocument();
  });

  it("renders product price with currency", () => {
    renderWithProviders(<SingleItem item={item} />);
    expect(screen.getByText("1200 UAH")).toBeInTheDocument();
  });

  it("renders external link with target=_blank", () => {
    renderWithProviders(<SingleItem item={item} />);
    const link = screen.getByText("Visit shop");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("href", "https://example.com/buy");
  });

  it("dispatches removeItemFromWishlist on remove button click", () => {
    const { store } = renderWithProviders(<SingleItem item={item} />, {
      preloadedState: {
        wishlistReducer: {
          items: [
            { id: "10", slug: "blue-jeans-10", title: "Blue Jeans", price: 1200 },
          ],
        },
      },
    });

    fireEvent.click(screen.getByTestId("remove-wishlist-item"));

    expect(store.getState().wishlistReducer.items).toHaveLength(0);
  });

  it("renders link to product page", () => {
    renderWithProviders(<SingleItem item={item} />);
    const titleLink = screen.getByText("Blue Jeans").closest("a");
    expect(titleLink).toHaveAttribute("href", "/products/blue-jeans-10");
  });
});
