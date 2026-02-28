import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getBrandManager } from "@/lib/cabinet-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const brandManager = await getBrandManager(supabase);

    if (!brandManager || brandManager.status !== "active") {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!brandManager.brandId) {
      return NextResponse.json(
        { data: null, error: "No brand associated" },
        { status: 400 }
      );
    }

    // Fetch current product to get is_active state
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, is_active")
      .eq("id", id)
      .eq("brand_id", brandManager.brandId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { data: null, error: "Product not found" },
        { status: 404 }
      );
    }

    const newIsActive = !(product.is_active ?? true);

    const { error: updateError } = await supabase
      .from("products")
      .update({ is_active: newIsActive })
      .eq("id", id);

    if (updateError) {
      console.error("Toggle active error:", updateError);
      return NextResponse.json(
        { data: null, error: "Failed to toggle product status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { isActive: newIsActive },
      error: null,
    });
  } catch (error) {
    console.error("Toggle active error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
