"use client";

import { Brand } from "@/types/brand";
import { Product } from "@/types/product";
import BrandHeader from "./BrandHeader";
import BrandProductGrid from "./BrandProductGrid";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Newsletter from "@/components/Common/Newsletter";
import { useTrackPageView } from "@/hooks/useTrackPageView";

interface BrandPageProps {
  brand: Brand;
  products: Product[];
}

const BrandPage = ({ brand, products }: BrandPageProps) => {
  useTrackPageView({
    eventType: "brand_page_view",
    brandId: Number(brand.id),
  });

  return (
    <>
      <Breadcrumb title={brand.name} pages={["brands", brand.name]} />

      <section className="overflow-hidden pb-20 pt-5 lg:pt-20 xl:pt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <BrandHeader brand={brand} />
          <BrandProductGrid products={products} />
        </div>
      </section>

      <Newsletter />
    </>
  );
};

export default BrandPage;
