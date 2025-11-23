import { getProductBySlug } from "@/lib/airtable";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ product: null }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Failed to fetch product", error);
    return NextResponse.json({ error: "Unable to fetch product" }, { status: 500 });
  }
}
