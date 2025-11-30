import React from "react";
import BlogDetailsWithSidebar from "@/components/BlogDetailsWithSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog Details Page | NextCommerce Nextjs E-commerce template",
  description: "This is Blog Details Page for NextCommerce Template",
  // other metadata
};

import { listProducts } from "@/lib/supabase-data";

export const revalidate = 60;

const BlogDetailsWithSidebarPage = async () => {
  const products = await listProducts({ limit: 3 });

  return (
    <main>
      <BlogDetailsWithSidebar products={products} />
    </main>
  );
};

export default BlogDetailsWithSidebarPage;
