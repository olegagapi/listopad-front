import { listProducts, ListProductsOptions } from "@/lib/airtable";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const options: ListProductsOptions = {};

  const limitParam = searchParams.get("limit");
  if (limitParam) {
    const limitValue = Number(limitParam);
    if (!Number.isNaN(limitValue) && limitValue > 0) {
      options.limit = limitValue;
    }
  }

  const brandId = searchParams.get("brand");
  if (brandId) {
    options.brandId = brandId;
  }

  const categoryId = searchParams.get("category");
  if (categoryId) {
    options.categoryId = categoryId;
  }

  const search = searchParams.get("search");
  if (search) {
    options.search = search;
  }

  try {
    const products = await listProducts(options);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Failed to fetch products", error);
    return NextResponse.json({ error: "Unable to fetch products" }, { status: 500 });
  }
}
