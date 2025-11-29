import { listCategories } from "@/lib/supabase-data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return NextResponse.json({ error: "Unable to fetch categories" }, { status: 500 });
  }
}
