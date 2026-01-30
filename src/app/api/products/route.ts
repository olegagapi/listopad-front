import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { listCategories } from "@/lib/supabase-data";
import { buildCategoryDescendantsMap, expandCategorySelection } from "@/lib/categoryHierarchy";
import { generateSlug } from "@/lib/slug";
import {
  parseCommaSeparated,
  parseNumber,
  validateLocale,
  validateSort,
  validateGenders,
  validateColors,
} from "@/lib/apiValidation";
import type { Product, Gender, PrimeColor } from "@/types/product";

type ProductsResponse = {
  data: {
    products: Product[];
    totalHits: number;
    totalPages: number;
    page: number;
    counts: {
      categories: Record<string, number>;
      genders: Record<Gender, number>;
      colors: Record<PrimeColor, number>;
    };
  };
  error: null;
} | {
  data: null;
  error: string;
};

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);

    const locale = validateLocale(searchParams.get("locale"));
    const categoryIds = parseCommaSeparated(searchParams.get("category"));
    const genders = validateGenders(parseCommaSeparated(searchParams.get("gender")));
    const colors = validateColors(parseCommaSeparated(searchParams.get("color")));
    const minPrice = parseNumber(searchParams.get("minPrice"));
    const maxPrice = parseNumber(searchParams.get("maxPrice"));
    const sort = validateSort(searchParams.get("sort"));
    const page = Math.max(1, parseNumber(searchParams.get("page")) ?? 1);
    const limit = Math.min(Math.max(1, parseNumber(searchParams.get("limit")) ?? 12), 100);

    // Fetch categories to build hierarchy
    const categories = await listCategories(locale);
    const descendantsMap = buildCategoryDescendantsMap(categories);

    // Expand selected categories to include descendants
    const expandedCategoryIds = categoryIds.length > 0
      ? expandCategorySelection(categoryIds, descendantsMap)
      : [];

    // Build base query for products
    let query = supabase.from("products").select(`
      *,
      brands (name_uk, name_en),
      categories (name_uk, name_en)
    `);

    // Apply category filter
    if (expandedCategoryIds.length > 0) {
      query = query.in("category_id", expandedCategoryIds);
    }

    // Apply gender filter
    if (genders.length > 0) {
      query = query.in("gender", genders);
    }

    // Apply color filter (products must have at least one matching color)
    if (colors.length > 0) {
      query = query.overlaps("colors", colors);
    }

    // Apply price filters
    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }

    // Apply sorting
    switch (sort) {
      case "price:asc":
        query = query.order("price", { ascending: true });
        break;
      case "price:desc":
        query = query.order("price", { ascending: false });
        break;
      case "discountedPrice:asc":
        query = query.order("price", { ascending: true });
        break;
      case "discountedPrice:desc":
        query = query.order("price", { ascending: false });
        break;
      default:
        // relevance - order by id (newest first) when no search query
        query = query.order("id", { ascending: false });
    }

    // Get total count with same filters
    let countQuery = supabase.from("products").select("*", { count: "exact", head: true });

    if (expandedCategoryIds.length > 0) {
      countQuery = countQuery.in("category_id", expandedCategoryIds);
    }
    if (genders.length > 0) {
      countQuery = countQuery.in("gender", genders);
    }
    if (colors.length > 0) {
      countQuery = countQuery.overlaps("colors", colors);
    }
    if (minPrice !== undefined) {
      countQuery = countQuery.gte("price", minPrice);
    }
    if (maxPrice !== undefined) {
      countQuery = countQuery.lte("price", maxPrice);
    }

    const { count: totalCount } = await countQuery;
    const totalHits = totalCount ?? 0;
    const totalPages = Math.ceil(totalHits / limit);

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Execute main query
    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Transform products
    const products: Product[] = (data ?? []).map((prod: Record<string, unknown>) => {
      const images = (prod.images as string[] | null) ?? [];
      const preview = prod.preview_image ? [prod.preview_image as string] : [];
      const productName = locale === "uk"
        ? String(prod.name_uk ?? "")
        : String(prod.name_en ?? "");
      const description = locale === "uk"
        ? (prod.product_description_uk as string | null)
        : (prod.product_description_en as string | null);
      const brands = prod.brands as Record<string, unknown> | null;
      const categoriesRec = prod.categories as Record<string, unknown> | null;
      const brandName = brands
        ? (locale === "uk" ? String(brands.name_uk ?? "") : String(brands.name_en ?? ""))
        : undefined;
      const categoryName = categoriesRec
        ? (locale === "uk" ? String(categoriesRec.name_uk ?? "") : String(categoriesRec.name_en ?? ""))
        : undefined;

      return {
        id: String(prod.id),
        slug: generateSlug(productName, prod.id as number),
        title: productName,
        reviews: 0,
        price: prod.price as number,
        discountedPrice: prod.price as number,
        currency: "UAH",
        brandId: prod.brand_id ? String(prod.brand_id) : undefined,
        brandName,
        categoryIds: prod.category_id ? [String(prod.category_id)] : [],
        categoryNames: categoryName ? [categoryName] : [],
        tags: (prod.tags as string[] | null) ?? [],
        colors: (prod.colors as PrimeColor[] | null) ?? [],
        gender: prod.gender as Gender | undefined,
        description,
        shortDescription: description ? description.slice(0, 100) + "..." : null,
        externalUrl: prod.external_url as string | null,
        instagramUrl: prod.inst_url as string | null,
        imgs: {
          previews: preview.length > 0 ? preview : images,
          thumbnails: preview.length > 0 ? preview : images,
        },
      };
    });

    // Calculate facet counts from ALL products (not just current page)
    const countsResult = await calculateFacetCounts(categories, descendantsMap);

    const response: ProductsResponse = {
      data: {
        products,
        totalHits,
        totalPages,
        page,
        counts: countsResult,
      },
      error: null,
    };

    return Response.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Products API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    const response: ProductsResponse = {
      data: null,
      error: errorMessage,
    };

    return Response.json(response, { status: 500 });
  }
}

/**
 * Calculate facet counts for categories, genders, and colors.
 * Returns total products per option without filters applied,
 * so users can see how many products exist in each filter option.
 */
async function calculateFacetCounts(
  categories: { id: string | number; parentId?: string | null }[],
  descendantsMap: Map<string, Set<string>>
): Promise<{
  categories: Record<string, number>;
  genders: Record<Gender, number>;
  colors: Record<PrimeColor, number>;
}> {
  // Fetch all products for counting (only need category_id, gender, colors fields)
  const { data: allProducts, error } = await supabase
    .from("products")
    .select("category_id, gender, colors");

  if (error || !allProducts) {
    console.error("Error fetching products for counts:", error);
    return {
      categories: {},
      genders: {} as Record<Gender, number>,
      colors: {} as Record<PrimeColor, number>,
    };
  }

  // Count products per category (direct assignments)
  const directCategoryCounts = new Map<string, number>();
  for (const product of allProducts) {
    const catId = product.category_id ? String(product.category_id) : null;
    if (catId) {
      const current = directCategoryCounts.get(catId) ?? 0;
      directCategoryCounts.set(catId, current + 1);
    }
  }

  // Calculate hierarchical category counts
  const categoryCounts: Record<string, number> = {};
  for (const category of categories) {
    const categoryId = String(category.id);
    let total = directCategoryCounts.get(categoryId) ?? 0;

    const descendants = descendantsMap.get(categoryId);
    if (descendants) {
      descendants.forEach((descendantId) => {
        total += directCategoryCounts.get(descendantId) ?? 0;
      });
    }

    categoryCounts[categoryId] = total;
  }

  // Count products per gender
  const genderCounts: Record<Gender, number> = {
    male: 0,
    female: 0,
    unisex: 0,
  };
  for (const product of allProducts) {
    const gender = product.gender as Gender | null;
    if (gender && gender in genderCounts) {
      genderCounts[gender]++;
    }
  }

  // Count products per color
  const colorCounts: Record<PrimeColor, number> = {
    white: 0, black: 0, grey: 0, red: 0, green: 0, blue: 0,
    yellow: 0, brown: 0, orange: 0, cyan: 0, magenta: 0,
    indigo: 0, silver: 0, gold: 0,
  };
  for (const product of allProducts) {
    const productColors = (product.colors as PrimeColor[] | null) ?? [];
    for (const color of productColors) {
      if (color in colorCounts) {
        colorCounts[color]++;
      }
    }
  }

  return { categories: categoryCounts, genders: genderCounts, colors: colorCounts };
}
