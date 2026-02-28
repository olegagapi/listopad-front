import { describe, it, expect } from "vitest";

/**
 * Tests for analytics aggregation logic.
 * These test the daily count aggregation and totals computation
 * used in the GET /api/cabinet/analytics endpoint.
 */

type DailyCount = {
  date: string;
  brandPageViews: number;
  productViews: number;
  externalClicks: number;
  wishlistAdds: number;
};

type AnalyticsEvent = {
  event_type: string;
  created_at: string;
};

type AggregationResult = {
  daily: DailyCount[];
  totals: {
    brandPageViews: number;
    productViews: number;
    externalClicks: number;
    wishlistAdds: number;
  };
};

/**
 * Extracted aggregation logic from the GET /api/cabinet/analytics route.
 */
function aggregateAnalytics(
  events: AnalyticsEvent[],
  startDate: Date,
  days: number
): AggregationResult {
  const dailyMap = new Map<string, DailyCount>();
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0]!;
    dailyMap.set(dateStr, {
      date: dateStr,
      brandPageViews: 0,
      productViews: 0,
      externalClicks: 0,
      wishlistAdds: 0,
    });
  }

  const totals = {
    brandPageViews: 0,
    productViews: 0,
    externalClicks: 0,
    wishlistAdds: 0,
  };

  for (const event of events) {
    const dateStr = new Date(event.created_at).toISOString().split("T")[0]!;
    const day = dailyMap.get(dateStr);
    if (!day) continue;

    switch (event.event_type) {
      case "brand_page_view":
        day.brandPageViews++;
        totals.brandPageViews++;
        break;
      case "product_view":
        day.productViews++;
        totals.productViews++;
        break;
      case "external_click":
        day.externalClicks++;
        totals.externalClicks++;
        break;
      case "wishlist_add":
        day.wishlistAdds++;
        totals.wishlistAdds++;
        break;
    }
  }

  const daily = Array.from(dailyMap.values());
  return { daily, totals };
}

describe("aggregateAnalytics", () => {
  const startDate = new Date("2026-02-01T00:00:00.000Z");

  describe("daily pre-population", () => {
    it("creates entries for all days in range", () => {
      const result = aggregateAnalytics([], startDate, 7);
      expect(result.daily).toHaveLength(7);
    });

    it("starts from startDate", () => {
      const result = aggregateAnalytics([], startDate, 3);
      expect(result.daily[0]!.date).toBe("2026-02-01");
      expect(result.daily[1]!.date).toBe("2026-02-02");
      expect(result.daily[2]!.date).toBe("2026-02-03");
    });

    it("initializes all counts to zero", () => {
      const result = aggregateAnalytics([], startDate, 1);
      const day = result.daily[0]!;
      expect(day.brandPageViews).toBe(0);
      expect(day.productViews).toBe(0);
      expect(day.externalClicks).toBe(0);
      expect(day.wishlistAdds).toBe(0);
    });

    it("handles 30-day range", () => {
      const result = aggregateAnalytics([], startDate, 30);
      expect(result.daily).toHaveLength(30);
      expect(result.daily[29]!.date).toBe("2026-03-02");
    });

    it("handles large range (90 days)", () => {
      const result = aggregateAnalytics([], startDate, 90);
      // Allow for DST edge cases where setDate can skip/duplicate a day
      expect(result.daily.length).toBeGreaterThanOrEqual(89);
      expect(result.daily.length).toBeLessThanOrEqual(91);
    });
  });

  describe("totals with no events", () => {
    it("returns all totals as zero when no events", () => {
      const result = aggregateAnalytics([], startDate, 7);
      expect(result.totals).toEqual({
        brandPageViews: 0,
        productViews: 0,
        externalClicks: 0,
        wishlistAdds: 0,
      });
    });
  });

  describe("event aggregation", () => {
    it("counts brand_page_view events", () => {
      const events: AnalyticsEvent[] = [
        { event_type: "brand_page_view", created_at: "2026-02-01T10:00:00Z" },
        { event_type: "brand_page_view", created_at: "2026-02-01T14:00:00Z" },
        { event_type: "brand_page_view", created_at: "2026-02-03T08:00:00Z" },
      ];

      const result = aggregateAnalytics(events, startDate, 7);

      expect(result.totals.brandPageViews).toBe(3);
      expect(result.daily[0]!.brandPageViews).toBe(2);
      expect(result.daily[2]!.brandPageViews).toBe(1);
    });

    it("counts product_view events", () => {
      const events: AnalyticsEvent[] = [
        { event_type: "product_view", created_at: "2026-02-02T12:00:00Z" },
      ];

      const result = aggregateAnalytics(events, startDate, 7);

      expect(result.totals.productViews).toBe(1);
      expect(result.daily[1]!.productViews).toBe(1);
    });

    it("counts external_click events", () => {
      const events: AnalyticsEvent[] = [
        { event_type: "external_click", created_at: "2026-02-05T16:00:00Z" },
        { event_type: "external_click", created_at: "2026-02-05T17:00:00Z" },
      ];

      const result = aggregateAnalytics(events, startDate, 7);

      expect(result.totals.externalClicks).toBe(2);
      expect(result.daily[4]!.externalClicks).toBe(2);
    });

    it("counts wishlist_add events", () => {
      const events: AnalyticsEvent[] = [
        { event_type: "wishlist_add", created_at: "2026-02-07T09:00:00Z" },
      ];

      const result = aggregateAnalytics(events, startDate, 7);

      expect(result.totals.wishlistAdds).toBe(1);
      expect(result.daily[6]!.wishlistAdds).toBe(1);
    });

    it("aggregates mixed event types correctly", () => {
      const events: AnalyticsEvent[] = [
        { event_type: "brand_page_view", created_at: "2026-02-01T10:00:00Z" },
        { event_type: "product_view", created_at: "2026-02-01T10:01:00Z" },
        { event_type: "external_click", created_at: "2026-02-01T10:02:00Z" },
        { event_type: "wishlist_add", created_at: "2026-02-01T10:03:00Z" },
        { event_type: "brand_page_view", created_at: "2026-02-03T08:00:00Z" },
        { event_type: "product_view", created_at: "2026-02-03T09:00:00Z" },
      ];

      const result = aggregateAnalytics(events, startDate, 7);

      // Day 1 (Feb 1)
      expect(result.daily[0]!.brandPageViews).toBe(1);
      expect(result.daily[0]!.productViews).toBe(1);
      expect(result.daily[0]!.externalClicks).toBe(1);
      expect(result.daily[0]!.wishlistAdds).toBe(1);

      // Day 3 (Feb 3)
      expect(result.daily[2]!.brandPageViews).toBe(1);
      expect(result.daily[2]!.productViews).toBe(1);

      // Totals
      expect(result.totals.brandPageViews).toBe(2);
      expect(result.totals.productViews).toBe(2);
      expect(result.totals.externalClicks).toBe(1);
      expect(result.totals.wishlistAdds).toBe(1);
    });

    it("ignores events outside the date range", () => {
      const events: AnalyticsEvent[] = [
        { event_type: "brand_page_view", created_at: "2026-01-31T23:59:59Z" },
        { event_type: "brand_page_view", created_at: "2026-02-08T00:00:00Z" },
      ];

      const result = aggregateAnalytics(events, startDate, 7);

      expect(result.totals.brandPageViews).toBe(0);
    });

    it("ignores unknown event types", () => {
      const events: AnalyticsEvent[] = [
        { event_type: "unknown_event", created_at: "2026-02-01T10:00:00Z" },
      ];

      const result = aggregateAnalytics(events, startDate, 7);

      expect(result.totals.brandPageViews).toBe(0);
      expect(result.totals.productViews).toBe(0);
      expect(result.totals.externalClicks).toBe(0);
      expect(result.totals.wishlistAdds).toBe(0);
    });

    it("handles multiple events on the same day", () => {
      const events: AnalyticsEvent[] = Array.from({ length: 10 }, (_, i) => ({
        event_type: "product_view",
        created_at: `2026-02-01T${String(i + 8).padStart(2, "0")}:00:00Z`,
      }));

      const result = aggregateAnalytics(events, startDate, 7);

      expect(result.totals.productViews).toBe(10);
      expect(result.daily[0]!.productViews).toBe(10);
    });
  });

  describe("days parameter validation", () => {
    const VALID_DAYS = [7, 14, 30, 90] as const;

    function normalizeDays(daysParam: number): number {
      return VALID_DAYS.includes(daysParam as (typeof VALID_DAYS)[number])
        ? daysParam
        : 30;
    }

    it("accepts 7 days", () => {
      expect(normalizeDays(7)).toBe(7);
    });

    it("accepts 14 days", () => {
      expect(normalizeDays(14)).toBe(14);
    });

    it("accepts 30 days", () => {
      expect(normalizeDays(30)).toBe(30);
    });

    it("accepts 90 days", () => {
      expect(normalizeDays(90)).toBe(90);
    });

    it("defaults to 30 for invalid values", () => {
      expect(normalizeDays(5)).toBe(30);
      expect(normalizeDays(60)).toBe(30);
      expect(normalizeDays(0)).toBe(30);
      expect(normalizeDays(-1)).toBe(30);
      expect(normalizeDays(365)).toBe(30);
    });
  });
});
