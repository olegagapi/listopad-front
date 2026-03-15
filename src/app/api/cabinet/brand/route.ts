import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getBrandManager } from "@/lib/cabinet-auth";

export async function GET(): Promise<Response> {
  try {
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

    const { data: brand, error } = await supabase
      .from("brands")
      .select("*")
      .eq("id", brandManager.brandId)
      .single();

    if (error || !brand) {
      return NextResponse.json(
        { data: null, error: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id: brand.id,
        nameUk: brand.name_uk,
        nameEn: brand.name_en,
        marketingDescUk: brand.marketing_desc_uk,
        marketingDescEn: brand.marketing_desc_en,
        externalUrl: brand.external_url,
        instagramUrl: brand.inst_url,
        logoUrl: brand.logo_url,
      },
      error: null,
    });
  } catch (error) {
    console.error("Brand GET error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<Response> {
  try {
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

    const body = await request.json();

    // Validate required fields
    if (!body.nameUk || !body.nameEn) {
      return NextResponse.json(
        { data: null, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("brands")
      .update({
        name_uk: body.nameUk,
        name_en: body.nameEn,
        marketing_desc_uk: body.marketingDescUk || null,
        marketing_desc_en: body.marketingDescEn || null,
        external_url: body.externalUrl || null,
        inst_url: body.instagramUrl || null,
        logo_url: body.logoUrl || null,
      })
      .eq("id", brandManager.brandId);

    if (error) {
      console.error("Brand update error:", error);
      return NextResponse.json(
        { data: null, error: "Failed to update brand" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { success: true },
      error: null,
    });
  } catch (error) {
    console.error("Brand PUT error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
