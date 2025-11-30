import Home from "@/components/Home";
import { Metadata } from "next";
import { listCategories, listProducts } from "@/lib/supabase-data";

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

export default async function HomePage() {
  const categories = await listCategories();
  const newArrivals = await listProducts({ limit: 8 });
  const bestSellers = await listProducts({ limit: 6 }); // Fetch best sellers

  return (
    <>
      <Home categories={categories} newArrivals={newArrivals} bestSellers={bestSellers} />
    </>
  );
}
