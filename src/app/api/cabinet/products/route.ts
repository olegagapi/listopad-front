import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getBrandManager } from "@/lib/cabinet-auth";

export async function GET(request: NextRequest): Promise<Response> {
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const { data: products, error, count } = await supabase
      .from("products")
      .select("*, categories(name_uk, name_en)", { count: "exact" })
      .eq("brand_id", brandManager.brandId)
      .order("id", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Products fetch error:", error);
      return NextResponse.json(
        { data: null, error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name_uk ?? p.name_en ?? "",
      nameUk: p.name_uk,
      nameEn: p.name_en,
      price: p.price,
      discountedPrice: p.discounted_price,
      categoryId: p.category_id,
      categoryName: p.categories?.name_uk ?? p.categories?.name_en ?? "",
      previewImage: p.preview_image,
      colors: p.colors ?? [],
      gender: p.gender,
      isActive: p.is_active ?? true,
    }));

    return NextResponse.json({
      data: {
        products: formattedProducts,
        total: count ?? 0,
        limit,
        offset,
      },
      error: null,
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
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
    if (!body.nameUk || !body.nameEn || !body.price) {
      return NextResponse.json(
        { data: null, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name_uk: body.nameUk,
        name_en: body.nameEn,
        price: body.price,
        discounted_price: body.discountedPrice || null,
        product_description_uk: body.descriptionUk || null,
        product_description_en: body.descriptionEn || null,
        category_id: body.categoryId || null,
        brand_id: brandManager.brandId,
        colors: body.colors || [],
        tags: body.tags || [],
        gender: body.gender || null,
        preview_image: body.images?.[0] || null,
        images: body.images?.slice(1) || [],
        external_url: body.externalUrl || null,
        inst_url: body.instagramUrl || null,
        is_active: body.isActive ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Product creation error:", error);
      return NextResponse.json(
        { data: null, error: "Failed to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { id: product.id },
      error: null,
    });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
