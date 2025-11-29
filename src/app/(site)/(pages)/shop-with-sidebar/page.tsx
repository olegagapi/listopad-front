import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { listProducts } from "@/lib/supabase-data";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

export const revalidate = 60;

const ShopWithSidebarPage = async () => {
  const products = await listProducts();

  return (
    <main>
      <ShopWithSidebar products={products} />
    </main>
  );
};

export default ShopWithSidebarPage;
