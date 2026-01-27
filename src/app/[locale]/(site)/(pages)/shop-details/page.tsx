import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { listProducts, Locale } from "@/lib/supabase-data";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("shopDetailsTitle"),
    description: t("shopDetailsDescription"),
  };
}

export const revalidate = 60;

const ShopDetailsPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const dataLocale = (locale === 'uk' || locale === 'en' ? locale : 'uk') as Locale;
  const otherProducts = await listProducts({ limit: 4, locale: dataLocale });

  return (
    <main>
      <ShopDetails otherProducts={otherProducts} />
    </main>
  );
};

export default ShopDetailsPage;
