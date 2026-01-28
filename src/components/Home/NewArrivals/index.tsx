import React from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import { Product } from "@/types/product";
import { useTranslations } from "next-intl";
import { ShoppingBagIcon } from "@/components/Icons";

interface NewArrivalProps {
  products: Product[];
}

const NewArrival = ({ products }: NewArrivalProps) => {
  const t = useTranslations("Home.NewArrival");

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-onyx mb-1.5">
              <span className="text-malachite">
                <ShoppingBagIcon />
              </span>
              {t("subtitle")}
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-onyx">
              {t("title")}
            </h2>
          </div>

          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-lavender-dark border bg-lavender text-onyx ease-out duration-200 hover:bg-lavender-dark hover:border-lavender-dark"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
          {/* <!-- New Arrivals item --> */}
          {products.map((item, key) => (
            <ProductItem item={item} key={key} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
