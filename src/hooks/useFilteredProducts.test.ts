import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFilteredProducts } from "./useFilteredProducts";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

const mockApiResponse = {
  data: {
    products: [
      {
        id: "1",
        slug: "shirt-1",
        title: "Shirt",
        reviews: 0,
        price: 300,
        discountedPrice: 300,
        currency: "UAH",
        categoryIds: [],
        categoryNames: [],
        tags: [],
        colors: [],
        imgs: { thumbnails: [], previews: [] },
      },
    ],
    totalHits: 1,
    totalPages: 1,
    page: 1,
    counts: {
      categories: {},
      genders: { male: 0, female: 1, unisex: 0 },
      colors: {
        white: 0, black: 0, grey: 0, red: 0, green: 0, blue: 0,
        yellow: 0, brown: 0, orange: 0, cyan: 0, magenta: 0,
        indigo: 0, silver: 0, gold: 0,
      },
    },
  },
  error: null,
};

describe("useFilteredProducts", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches when enabled (default)", async () => {
    renderHook(() => useFilteredProducts());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      const url = vi.mocked(fetch).mock.calls[0]![0] as string;
      expect(url).toContain("/api/products");
      expect(url).toContain("locale=en");
    });
  });

  it("skips fetch when disabled", async () => {
    renderHook(() => useFilteredProducts({ enabled: false }));

    // Give it a tick to potentially fire
    await new Promise((r) => setTimeout(r, 10));
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sets results from response", async () => {
    const { result } = renderHook(() => useFilteredProducts());

    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
      expect(result.current.totalHits).toBe(1);
    });
  });

  it("builds URL with filter params", async () => {
    renderHook(() =>
      useFilteredProducts({
        categoryIds: ["1"],
        genders: ["female"],
        colors: ["blue"],
        minPrice: 50,
        maxPrice: 1000,
        sort: "price:desc",
      })
    );

    await waitFor(() => {
      const url = vi.mocked(fetch).mock.calls[0]![0] as string;
      expect(url).toContain("category=1");
      expect(url).toContain("gender=female");
      expect(url).toContain("color=blue");
      expect(url).toContain("minPrice=50");
      expect(url).toContain("maxPrice=1000");
      expect(url).toContain("sort=price%3Adesc");
    });
  });

  it("sets error on API error response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: null, error: "DB error" }),
      })
    );

    const { result } = renderHook(() => useFilteredProducts());

    await waitFor(() => {
      expect(result.current.error).toBe("DB error");
    });
  });

  it("sets error on HTTP failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        statusText: "Server Error",
      })
    );

    const { result } = renderHook(() => useFilteredProducts());

    await waitFor(() => {
      expect(result.current.error).toContain("Failed to fetch products");
    });
  });

  it("sets counts from response", async () => {
    const { result } = renderHook(() => useFilteredProducts());

    await waitFor(() => {
      expect(result.current.counts.genders.female).toBe(1);
    });
  });

  it("aborts on unmount", async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, "abort");

    const { unmount } = renderHook(() => useFilteredProducts());

    unmount();

    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});
