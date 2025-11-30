import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Details Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Details Page for NextCommerce Template",
  // other metadata
};

import { listProducts } from "@/lib/supabase-data";

export const revalidate = 60;

const ShopDetailsPage = async () => {
  const otherProducts = await listProducts({ limit: 4 });

  return (
    <main>
      <ShopDetails otherProducts={otherProducts} />
    </main>
  );
};

export default ShopDetailsPage;
