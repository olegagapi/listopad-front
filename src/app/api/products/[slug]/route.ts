import { getProductBySlug, Locale } from "@/lib/supabase-data";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: Locale = localeParam === 'uk' || localeParam === 'en' ? localeParam : 'uk';

  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug, locale);

    if (!product) {
      return NextResponse.json({ product: null }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Failed to fetch product", error);
    return NextResponse.json({ error: "Unable to fetch product" }, { status: 500 });
  }
}
