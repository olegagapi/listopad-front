import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

const VALID_EVENT_TYPES = [
  "brand_page_view",
  "product_view",
  "external_click",
  "wishlist_add",
] as const;

type EventType = (typeof VALID_EVENT_TYPES)[number];

function isValidEventType(value: unknown): value is EventType {
  return (
    typeof value === "string" &&
    VALID_EVENT_TYPES.includes(value as EventType)
  );
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { data: null, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { eventType, brandId, productId } = body as Record<string, unknown>;

    if (!isValidEventType(eventType)) {
      return NextResponse.json(
        { data: null, error: "Invalid event type" },
        { status: 400 }
      );
    }

    if (typeof brandId !== "number" || !Number.isInteger(brandId)) {
      return NextResponse.json(
        { data: null, error: "Invalid brand ID" },
        { status: 400 }
      );
    }

    if (
      productId !== undefined &&
      productId !== null &&
      (typeof productId !== "number" || !Number.isInteger(productId))
    ) {
      return NextResponse.json(
        { data: null, error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("analytics_events").insert({
      event_type: eventType,
      brand_id: brandId,
      product_id: productId ?? null,
    });

    if (error) {
      console.error("Analytics insert error:", error);
      return NextResponse.json(
        { data: null, error: "Failed to record event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
