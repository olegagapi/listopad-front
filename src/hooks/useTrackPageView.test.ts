import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTrackPageView } from "./useTrackPageView";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

import { trackEvent } from "@/lib/analytics";

const mockTrackEvent = vi.mocked(trackEvent);

describe("useTrackPageView", () => {
  beforeEach(() => {
    mockTrackEvent.mockClear();
  });

  it("calls trackEvent once on mount with correct params", () => {
    renderHook(() =>
      useTrackPageView({ eventType: "brand_page_view", brandId: 1 })
    );
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith({
      eventType: "brand_page_view",
      brandId: 1,
      productId: undefined,
    });
  });

  it("includes productId when provided", () => {
    renderHook(() =>
      useTrackPageView({ eventType: "product_view", brandId: 2, productId: 42 })
    );
    expect(mockTrackEvent).toHaveBeenCalledWith({
      eventType: "product_view",
      brandId: 2,
      productId: 42,
    });
  });

  it("does not double-fire on re-render", () => {
    const { rerender } = renderHook(() =>
      useTrackPageView({ eventType: "brand_page_view", brandId: 1 })
    );
    rerender();
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
  });
});
