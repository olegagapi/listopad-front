import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { listProducts, listCategories, getColors, getGenders } from "@/lib/supabase-data";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

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
