import React from "react";
import BlogGridWithSidebar from "@/components/BlogGridWithSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog Grid Page | NextCommerce Nextjs E-commerce template",
  description: "This is Blog Grid Page for NextCommerce Template",
  // other metadata
};

import { listProducts } from "@/lib/supabase-data";

export const revalidate = 60;

const BlogGridSidebarPage = async () => {
  const products = await listProducts({ limit: 3 });

  return (
    <main>
      <BlogGridWithSidebar products={products} />
    </main>
  );
};

export default BlogGridSidebarPage;
