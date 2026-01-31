import { notFound } from "next/navigation";
import { getProductBySlug, listProducts, Locale } from "@/lib/supabase-data";
import ProductDetails from "@/components/ProductDetails";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dataLocale = (locale === "uk" || locale === "en" ? locale : "uk") as Locale;
  const product = await getProductBySlug(slug, dataLocale);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.title} | Listopad`,
    description: product.shortDescription || product.description || "",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dataLocale = (locale === "uk" || locale === "en" ? locale : "uk") as Locale;

  const product = await getProductBySlug(slug, dataLocale);
  if (!product) {
    notFound();
  }

  const relatedProducts = await listProducts({ limit: 4, locale: dataLocale });

  return (
    <main>
      <ProductDetails product={product} relatedProducts={relatedProducts} />
    </main>
  );
}
