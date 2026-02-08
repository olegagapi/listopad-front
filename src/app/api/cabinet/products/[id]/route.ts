import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getBrandManager } from "@/lib/cabinet-auth";

export async function GET(
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

    const { data: product, error } = await supabase
      .from("products")
      .select("*, categories(name_uk, name_en)")
      .eq("id", id)
      .eq("brand_id", brandManager.brandId)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { data: null, error: "Product not found" },
        { status: 404 }
      );
    }

    const formattedProduct = {
      id: product.id,
      nameUk: product.name_uk,
      nameEn: product.name_en,
      price: product.price,
      discountedPrice: product.discounted_price,
      descriptionUk: product.product_description_uk,
      descriptionEn: product.product_description_en,
      categoryId: product.category_id,
      categoryName: product.categories?.name_uk ?? product.categories?.name_en ?? "",
      colors: product.colors ?? [],
      tags: product.tags ?? [],
      gender: product.gender,
      previewImage: product.preview_image,
      images: product.images ?? [],
      externalUrl: product.external_url,
      instagramUrl: product.inst_url,
    };

    return NextResponse.json({
      data: formattedProduct,
      error: null,
    });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Check product belongs to this brand
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .eq("brand_id", brandManager.brandId)
      .single();

    if (!existingProduct) {
      return NextResponse.json(
        { data: null, error: "Product not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.nameUk || !body.nameEn || !body.price) {
      return NextResponse.json(
        { data: null, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("products")
      .update({
        name_uk: body.nameUk,
        name_en: body.nameEn,
        price: body.price,
        discounted_price: body.discountedPrice || null,
        product_description_uk: body.descriptionUk || null,
        product_description_en: body.descriptionEn || null,
        category_id: body.categoryId || null,
        colors: body.colors || [],
        tags: body.tags || [],
        gender: body.gender || null,
        preview_image: body.images?.[0] || null,
        images: body.images?.slice(1) || [],
        external_url: body.externalUrl || null,
        inst_url: body.instagramUrl || null,
      })
      .eq("id", id);

    if (error) {
      console.error("Product update error:", error);
      return NextResponse.json(
        { data: null, error: "Failed to update product" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { success: true },
      error: null,
    });
  } catch (error) {
    console.error("Product PUT error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check product belongs to this brand
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .eq("brand_id", brandManager.brandId)
      .single();

    if (!existingProduct) {
      return NextResponse.json(
        { data: null, error: "Product not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Product delete error:", error);
      return NextResponse.json(
        { data: null, error: "Failed to delete product" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { success: true },
      error: null,
    });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
