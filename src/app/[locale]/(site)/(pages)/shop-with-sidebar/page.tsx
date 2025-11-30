import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { listProducts, listCategories, getColors, getGenders } from "@/lib/supabase-data";

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

const ShopWithSidebarPage = async () => {
  const products = await listProducts();
  const categories = await listCategories();
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
