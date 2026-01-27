import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { listProducts, Locale } from "@/lib/supabase-data";

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

const ShopWithoutSidebarPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const dataLocale = (locale === 'uk' || locale === 'en' ? locale : 'uk') as Locale;
  const products = await listProducts({ locale: dataLocale });

  return (
    <main>
      <ShopWithoutSidebar products={products} />
    </main>
  );
};

export default ShopWithoutSidebarPage;
