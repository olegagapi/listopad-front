import { listCategories, Locale } from "@/lib/supabase-data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: Locale = localeParam === 'uk' || localeParam === 'en' ? localeParam : 'uk';

  try {
    const categories = await listCategories(locale);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return NextResponse.json({ error: "Unable to fetch categories" }, { status: 500 });
  }
}
