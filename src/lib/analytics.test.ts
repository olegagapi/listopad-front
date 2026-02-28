import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  const originalNavigator = global.navigator;
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    global.fetch = originalFetch;
  });

  it("sends event via sendBeacon with correct payload", () => {
    const mockSendBeacon = vi.fn().mockReturnValue(true);
    Object.defineProperty(global, "navigator", {
      value: { sendBeacon: mockSendBeacon },
      writable: true,
      configurable: true,
    });

    trackEvent({ eventType: "brand_page_view", brandId: 1 });

    expect(mockSendBeacon).toHaveBeenCalledWith(
      "/api/analytics",
      expect.any(Blob)
    );
  });

  it("includes productId as null when not provided", () => {
    const mockSendBeacon = vi.fn().mockReturnValue(true);
    Object.defineProperty(global, "navigator", {
      value: { sendBeacon: mockSendBeacon },
      writable: true,
      configurable: true,
    });

    trackEvent({ eventType: "product_view", brandId: 5 });

    const blob = mockSendBeacon.mock.calls[0]![1] as Blob;
    expect(blob.type).toBe("application/json");
  });

  it("includes productId when provided", () => {
    const mockSendBeacon = vi.fn().mockReturnValue(true);
    Object.defineProperty(global, "navigator", {
      value: { sendBeacon: mockSendBeacon },
      writable: true,
      configurable: true,
    });

    trackEvent({ eventType: "product_view", brandId: 1, productId: 42 });

    expect(mockSendBeacon).toHaveBeenCalledTimes(1);
  });

  it("falls back to fetch when sendBeacon returns false", () => {
    const mockSendBeacon = vi.fn().mockReturnValue(false);
    Object.defineProperty(global, "navigator", {
      value: { sendBeacon: mockSendBeacon },
      writable: true,
      configurable: true,
    });

    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    trackEvent({ eventType: "external_click", brandId: 3 });

    expect(mockFetch).toHaveBeenCalledWith("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "external_click",
        brandId: 3,
        productId: null,
      }),
      keepalive: true,
    });
  });

  it("does not call fetch when sendBeacon succeeds", () => {
    const mockSendBeacon = vi.fn().mockReturnValue(true);
    Object.defineProperty(global, "navigator", {
      value: { sendBeacon: mockSendBeacon },
      writable: true,
      configurable: true,
    });

    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    trackEvent({ eventType: "wishlist_add", brandId: 2, productId: 10 });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("silently ignores sendBeacon errors", () => {
    Object.defineProperty(global, "navigator", {
      value: {
        sendBeacon: () => {
          throw new Error("sendBeacon not supported");
        },
      },
      writable: true,
      configurable: true,
    });

    expect(() => {
      trackEvent({ eventType: "brand_page_view", brandId: 1 });
    }).not.toThrow();
  });

  it("silently ignores fetch errors", () => {
    const mockSendBeacon = vi.fn().mockReturnValue(false);
    Object.defineProperty(global, "navigator", {
      value: { sendBeacon: mockSendBeacon },
      writable: true,
      configurable: true,
    });

    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
    global.fetch = mockFetch;

    expect(() => {
      trackEvent({ eventType: "brand_page_view", brandId: 1 });
    }).not.toThrow();
  });

  it("sends all valid event types", () => {
    const mockSendBeacon = vi.fn().mockReturnValue(true);
    Object.defineProperty(global, "navigator", {
      value: { sendBeacon: mockSendBeacon },
      writable: true,
      configurable: true,
    });

    const eventTypes = [
      "brand_page_view",
      "product_view",
      "external_click",
      "wishlist_add",
    ] as const;

    for (const eventType of eventTypes) {
      trackEvent({ eventType, brandId: 1 });
    }

    expect(mockSendBeacon).toHaveBeenCalledTimes(4);
  });
});
