import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { listProducts, listCategories, getColors, getGenders, getPriceRange, Locale } from "@/lib/supabase-data";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("shopTitle"),
    description: t("shopDescription"),
  };
}

export const revalidate = 60;

const ShopWithSidebarPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const dataLocale = (locale === 'uk' || locale === 'en' ? locale : 'uk') as Locale;

  const [products, categories, colors, genders, priceRange] = await Promise.all([
    listProducts({ locale: dataLocale }),
    listCategories(dataLocale),
    getColors(),
    getGenders(),
    getPriceRange(),
  ]);

  return (
    <main>
      <ShopWithSidebar
        products={products}
        categories={categories}
        colors={colors}
        genders={genders}
        priceRange={priceRange}
      />
    </main>
  );
};

export default ShopWithSidebarPage;
