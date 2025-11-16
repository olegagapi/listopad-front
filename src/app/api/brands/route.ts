import { listBrands } from "@/lib/airtable";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await listBrands();
    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Failed to fetch brands", error);
    return NextResponse.json({ error: "Unable to fetch brands" }, { status: 500 });
  }
}
