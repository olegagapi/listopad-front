"use client";

import { useTranslations } from "next-intl";
import { Product } from "@/types/product";
import SingleGridItem from "@/components/Shop/SingleGridItem";

interface BrandProductGridProps {
  products: Product[];
}

const BrandProductGrid = ({ products }: BrandProductGridProps) => {
  const t = useTranslations("Brand");

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate text-lg">{t("noProducts")}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-semibold text-xl text-onyx mb-6">
        {t("products")} ({products.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <SingleGridItem key={product.id} item={product} />
        ))}
      </div>
    </div>
  );
};

export default BrandProductGrid;
