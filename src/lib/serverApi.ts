import { Product } from "@/types/product";
import { getBaseUrl } from "./getBaseUrl";

type FetchProductsArgs = {
  limit?: number;
  search?: string;
  revalidate?: number;
};

export async function fetchProductsFromApi(
  options: FetchProductsArgs = {},
): Promise<Product[]> {
  const baseUrl = getBaseUrl();
  const params = new URLSearchParams();

  if (options.limit) {
    params.set("limit", options.limit.toString());
  }

  if (options.search) {
    params.set("search", options.search);
  }

  const query = params.toString();
  const target = `${baseUrl}/api/products${query ? `?${query}` : ""}`;

  try {
    const res = await fetch(target, {
      next: { revalidate: options.revalidate ?? 120 },
    });

    if (!res.ok) {
      console.error("Failed to fetch products from API", res.status, await res.text());
      return [];
    }

    const data = (await res.json()) as { products?: Product[] };
    return data.products ?? [];
  } catch (error) {
    console.error("Unable to reach products API", error);
    return [];
  }
}
