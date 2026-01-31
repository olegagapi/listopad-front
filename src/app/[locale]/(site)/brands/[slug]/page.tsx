import { notFound } from "next/navigation";
import { getBrandBySlug, listProducts, Locale } from "@/lib/supabase-data";
import BrandPage from "@/components/Brand";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dataLocale = (locale === "uk" || locale === "en" ? locale : "uk") as Locale;
  const brand = await getBrandBySlug(slug, dataLocale);

  if (!brand) {
    return { title: "Brand Not Found" };
  }

  return {
    title: `${brand.name} | Listopad`,
    description: brand.description || `Browse products from ${brand.name}`,
  };
}

export default async function BrandPageRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dataLocale = (locale === "uk" || locale === "en" ? locale : "uk") as Locale;

  const brand = await getBrandBySlug(slug, dataLocale);
  if (!brand) {
    notFound();
  }

  const products = await listProducts({ brandId: brand.id, locale: dataLocale });

  return (
    <main>
      <BrandPage brand={brand} products={products} />
    </main>
  );
}
