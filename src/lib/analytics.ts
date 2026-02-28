type TrackEventParams = {
  eventType:
    | "brand_page_view"
    | "product_view"
    | "external_click"
    | "wishlist_add";
  brandId: number;
  productId?: number;
};

/**
 * Fire-and-forget event tracking. Silently ignores errors.
 * Uses sendBeacon for reliability, with fetch fallback.
 */
export function trackEvent({ eventType, brandId, productId }: TrackEventParams): void {
  const payload = JSON.stringify({
    eventType,
    brandId,
    productId: productId ?? null,
  });

  try {
    const blob = new Blob([payload], { type: "application/json" });
    const sent = navigator.sendBeacon("/api/analytics", blob);

    if (!sent) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Silently ignore
      });
    }
  } catch {
    // Silently ignore
  }
}
