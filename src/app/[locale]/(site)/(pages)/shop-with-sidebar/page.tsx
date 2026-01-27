import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { listProducts, listCategories, getColors, getGenders, Locale } from "@/lib/supabase-data";

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
  const products = await listProducts({ locale: dataLocale });
  const categories = await listCategories(dataLocale);
  const colors = await getColors();
  const genders = await getGenders();

  return (
    <main>
      <ShopWithSidebar
        products={products}
        categories={categories}
        colors={colors}
        genders={genders}
      />
    </main>
  );
};

export default ShopWithSidebarPage;
