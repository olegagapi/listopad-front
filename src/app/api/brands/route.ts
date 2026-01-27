import { listBrands, Locale } from "@/lib/supabase-data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: Locale = localeParam === 'uk' || localeParam === 'en' ? localeParam : 'uk';

  try {
    const brands = await listBrands(locale);
    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Failed to fetch brands", error);
    return NextResponse.json({ error: "Unable to fetch brands" }, { status: 500 });
  }
}
