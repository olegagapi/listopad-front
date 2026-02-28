"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

type PageViewParams = {
  eventType: "brand_page_view" | "product_view";
  brandId: number;
  productId?: number;
};

/**
 * Hook that fires a page view event once on mount.
 * Uses a ref guard to prevent duplicate fires in StrictMode.
 */
export function useTrackPageView({ eventType, brandId, productId }: PageViewParams): void {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    trackEvent({ eventType, brandId, productId });
  }, [eventType, brandId, productId]);
}
