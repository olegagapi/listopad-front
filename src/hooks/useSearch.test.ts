import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSearch, useInstantSearch } from "./useSearch";
import type { SearchResult } from "@/types/search";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

const mockSearchResult: SearchResult = {
  hits: [
    {
      id: "1",
      slug: "dress-1",
      title: "Dress",
      reviews: 0,
      price: 500,
      discountedPrice: 500,
      currency: "UAH",
      categoryIds: [],
      categoryNames: [],
      tags: [],
      colors: [],
      imgs: { thumbnails: [], previews: [] },
    },
  ],
  totalHits: 1,
  page: 1,
  totalPages: 1,
  processingTimeMs: 5,
  facetDistribution: {},
  query: "dress",
};

function setupFetchSuccess(data: SearchResult) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data, error: null }),
    })
  );
}

describe("useSearch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches on mount with locale param", async () => {
    setupFetchSuccess(mockSearchResult);
    renderHook(() => useSearch());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      const url = vi.mocked(fetch).mock.calls[0]![0] as string;
      expect(url).toContain("locale=en");
    });
  });

  it("includes query param when provided", async () => {
    setupFetchSuccess(mockSearchResult);
    renderHook(() => useSearch({ query: "dress" }));

    await waitFor(() => {
      const url = vi.mocked(fetch).mock.calls[0]![0] as string;
      expect(url).toContain("q=dress");
    });
  });

  it("sets results on success", async () => {
    setupFetchSuccess(mockSearchResult);
    const { result } = renderHook(() => useSearch({ query: "dress" }));

    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
      expect(result.current.totalHits).toBe(1);
    });
  });

  it("sets error on API error response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ data: null, error: "Search index unavailable" }),
      })
    );

    const { result } = renderHook(() => useSearch({ query: "test" }));

    await waitFor(() => {
      expect(result.current.error).toBe("Search index unavailable");
    });
  });

  it("sets error on HTTP failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        statusText: "Internal Server Error",
      })
    );

    const { result } = renderHook(() => useSearch({ query: "test" }));

    await waitFor(() => {
      expect(result.current.error).toContain("Search failed");
    });
  });

  it("includes filter params in URL", async () => {
    setupFetchSuccess(mockSearchResult);
    renderHook(() =>
      useSearch({
        categoryIds: ["1", "2"],
        genders: ["female"],
        colors: ["red"],
        minPrice: 100,
        maxPrice: 500,
        sort: "price:asc",
      })
    );

    await waitFor(() => {
      const url = vi.mocked(fetch).mock.calls[0]![0] as string;
      expect(url).toContain("category=1%2C2");
      expect(url).toContain("gender=female");
      expect(url).toContain("color=red");
      expect(url).toContain("minPrice=100");
      expect(url).toContain("maxPrice=500");
      expect(url).toContain("sort=price%3Aasc");
    });
  });

  it("debounces search calls", async () => {
    setupFetchSuccess(mockSearchResult);
    vi.useFakeTimers();

    const { result } = renderHook(() => useSearch({ debounceMs: 200 }));

    // Flush initial mount fetch
    await vi.advanceTimersByTimeAsync(0);

    const callsAfterMount = vi.mocked(fetch).mock.calls.length;

    act(() => {
      result.current.search("a");
      result.current.search("ab");
      result.current.search("abc");
    });

    // Before debounce, no additional call
    expect(vi.mocked(fetch).mock.calls.length).toBe(callsAfterMount);

    // After debounce, one additional call
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    expect(vi.mocked(fetch).mock.calls.length).toBe(callsAfterMount + 1);
    const lastUrl = vi.mocked(fetch).mock.calls.at(-1)![0] as string;
    expect(lastUrl).toContain("q=abc");

    vi.useRealTimers();
  });

  it("aborts previous request on new search", async () => {
    setupFetchSuccess(mockSearchResult);
    const abortSpy = vi.spyOn(AbortController.prototype, "abort");

    const { result } = renderHook(() => useSearch());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    // refetch triggers a new request, which should abort the old one
    act(() => {
      result.current.refetch();
    });

    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});

describe("useInstantSearch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("fetches with q param after debounce", async () => {
    setupFetchSuccess(mockSearchResult);
    vi.useFakeTimers();

    const { result } = renderHook(() => useInstantSearch(100));

    act(() => {
      result.current.search("test");
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(fetch).toHaveBeenCalled();
    const url = vi.mocked(fetch).mock.calls[0]![0] as string;
    expect(url).toContain("q=test");
    expect(url).toContain("limit=5");
  });

  it("clears results for empty query", () => {
    const { result } = renderHook(() => useInstantSearch(100));

    act(() => {
      result.current.search("");
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("clear() resets state", async () => {
    setupFetchSuccess(mockSearchResult);
    vi.useFakeTimers();

    const { result } = renderHook(() => useInstantSearch(100));

    act(() => {
      result.current.search("test");
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    act(() => {
      result.current.clear();
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.query).toBe("");
    expect(result.current.error).toBeNull();
  });
});
