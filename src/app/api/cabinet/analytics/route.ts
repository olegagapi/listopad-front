import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getBrandManager } from "@/lib/cabinet-auth";

type DailyCount = {
  date: string;
  brandPageViews: number;
  productViews: number;
  externalClicks: number;
  wishlistAdds: number;
};

type AnalyticsResponse = {
  data: {
    daily: DailyCount[];
    totals: {
      brandPageViews: number;
      productViews: number;
      externalClicks: number;
      wishlistAdds: number;
    };
    days: number;
  } | null;
  error: string | null;
};

const VALID_DAYS = [7, 14, 30, 90] as const;

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();
    const brandManager = await getBrandManager(supabase);

    if (!brandManager || brandManager.status !== "active") {
      return NextResponse.json(
        { data: null, error: "Unauthorized" } satisfies AnalyticsResponse,
        { status: 401 }
      );
    }

    if (!brandManager.brandId) {
      return NextResponse.json(
        { data: null, error: "No brand associated" } satisfies AnalyticsResponse,
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const daysParam = parseInt(searchParams.get("days") ?? "30", 10);
    const days = VALID_DAYS.includes(daysParam as (typeof VALID_DAYS)[number])
      ? daysParam
      : 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const { data: events, error } = await supabase
      .from("analytics_events")
      .select("event_type, created_at")
      .eq("brand_id", brandManager.brandId)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Analytics fetch error:", error);
      return NextResponse.json(
        { data: null, error: "Failed to fetch analytics" } satisfies AnalyticsResponse,
        { status: 500 }
      );
    }

    // Pre-populate all days in range
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

    for (const event of events ?? []) {
      const dateStr = new Date(event.created_at as string)
        .toISOString()
        .split("T")[0]!;
      const day = dailyMap.get(dateStr);
      if (!day) continue;

      const eventType = event.event_type as string;
      switch (eventType) {
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

    const response: AnalyticsResponse = {
      data: { daily, totals, days },
      error: null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" } satisfies AnalyticsResponse,
      { status: 500 }
    );
  }
}
