import { getProductBySlug } from "@/lib/airtable";
import { NextResponse } from "next/server";

type RouteContext = {
  params: {
    slug: string;
  };
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const product = await getProductBySlug(context.params.slug);

    if (!product) {
      return NextResponse.json({ product: null }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Failed to fetch product", error);
    return NextResponse.json({ error: "Unable to fetch product" }, { status: 500 });
  }
}
