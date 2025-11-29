import Home from "@/components/Home";
import { Metadata } from "next";
import { listCategories, listProducts } from "@/lib/supabase-data";

export const metadata: Metadata = {
  title: "NextCommerce | Nextjs E-commerce template",
  description: "This is Home for NextCommerce Template",
  // other metadata
};

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
