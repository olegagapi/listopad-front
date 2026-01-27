import Home from "@/components/Home";
import { listCategories, listProducts, listPromotions, Locale } from "@/lib/supabase-data";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dataLocale = (locale === 'uk' || locale === 'en' ? locale : 'uk') as Locale;
  const categories = await listCategories(dataLocale);
  const newArrivals = await listProducts({ limit: 8, locale: dataLocale });
  const bestSellers = await listProducts({ limit: 6, locale: dataLocale });
  const promotionsResult = await listPromotions();
  const promotions = promotionsResult.data ?? [];

  return (
    <>
      <Home
        categories={categories}
        newArrivals={newArrivals}
        bestSellers={bestSellers}
        promotions={promotions}
        locale={locale}
      />
    </>
  );
}
