"use client";

import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Newsletter from "../Common/Newsletter";
import RecentlyViewdItems from "../ShopDetails/RecentlyViewd";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { Link } from "@/i18n/routing";
import { generateSlug } from "@/lib/supabase-data";
import { ProductView } from "./ProductView";
import { Product } from "@/types/product";
import { useTrackPageView } from "@/hooks/useTrackPageView";

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetails = ({
  product,
  relatedProducts,
}: ProductDetailsProps): React.ReactElement => {
  const { openPreviewModal } = usePreviewSlider();
  const [activeTab, setActiveTab] = useState("tabOne");

  useTrackPageView({
    eventType: "product_view",
    brandId: product.brandId ? Number(product.brandId) : 0,
    productId: Number(product.id),
  });

  const tabs = [
    {
      id: "tabOne",
      title: "Description",
    },
    {
      id: "tabTwo",
      title: "Additional Information",
    },
  ];

  const handleZoomClick = (): void => {
    openPreviewModal();
  };

  return (
    <>
      <Breadcrumb title={"Shop Details"} pages={["shop details"]} />

      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <ProductView
            product={product}
            variant="full"
            onZoomClick={handleZoomClick}
          />
        </div>
      </section>

      <section className="overflow-hidden bg-champagne-200 py-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Tab header */}
          <div className="flex flex-wrap items-center bg-champagne-50 rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
            {tabs.map((item, key) => (
              <button
                key={key}
                onClick={() => setActiveTab(item.id)}
                className={`font-medium lg:text-lg ease-out duration-200 hover:text-malachite relative before:h-0.5 before:bg-malachite before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${
                  activeTab === item.id
                    ? "text-malachite before:w-full"
                    : "text-onyx before:w-0"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* Tab content: Description */}
          <div>
            <div
              className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${
                activeTab === "tabOne" ? "flex" : "hidden"
              }`}
            >
              <div className="max-w-full w-full">
                <h2 className="font-medium text-2xl text-onyx mb-7">
                  Description
                </h2>

                {product.description ? (
                  <p className="text-slate whitespace-pre-line">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-slate">
                    No description available for this product.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tab content: Additional Information */}
          <div>
            <div
              className={`rounded-xl bg-champagne-50 shadow-1 p-4 sm:p-6 mt-10 ${
                activeTab === "tabTwo" ? "block" : "hidden"
              }`}
            >
              {/* Brand */}
              {product.brandName && product.brandId && (
                <div className="rounded-md even:bg-champagne flex py-4 px-4 sm:px-5">
                  <div className="max-w-[450px] min-w-[140px] w-full">
                    <p className="text-sm sm:text-base text-onyx">Brand</p>
                  </div>
                  <div className="w-full">
                    <Link
                      href={`/brands/${generateSlug(product.brandName, Number(product.brandId))}`}
                      className="text-sm sm:text-base text-malachite hover:underline"
                    >
                      {product.brandName}
                    </Link>
                  </div>
                </div>
              )}

              {/* Gender */}
              <div className="rounded-md even:bg-champagne flex py-4 px-4 sm:px-5">
                <div className="max-w-[450px] min-w-[140px] w-full">
                  <p className="text-sm sm:text-base text-onyx">Gender</p>
                </div>
                <div className="w-full">
                  <p className="text-sm sm:text-base text-onyx capitalize">
                    {product.gender || "Unisex"}
                  </p>
                </div>
              </div>

              {/* Categories */}
              {product.categoryNames && product.categoryNames.length > 0 && (
                <div className="rounded-md even:bg-champagne flex py-4 px-4 sm:px-5">
                  <div className="max-w-[450px] min-w-[140px] w-full">
                    <p className="text-sm sm:text-base text-onyx">Category</p>
                  </div>
                  <div className="w-full">
                    <p className="text-sm sm:text-base text-onyx">
                      {product.categoryNames.join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="rounded-md even:bg-champagne flex py-4 px-4 sm:px-5">
                  <div className="max-w-[450px] min-w-[140px] w-full">
                    <p className="text-sm sm:text-base text-onyx">
                      Available Colors
                    </p>
                  </div>
                  <div className="w-full">
                    <p className="text-sm sm:text-base text-onyx capitalize">
                      {product.colors.join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="rounded-md even:bg-champagne flex py-4 px-4 sm:px-5">
                  <div className="max-w-[450px] min-w-[140px] w-full">
                    <p className="text-sm sm:text-base text-onyx">Tags</p>
                  </div>
                  <div className="w-full">
                    <p className="text-sm sm:text-base text-onyx">
                      {product.tags.join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewdItems products={relatedProducts} />

      <Newsletter />
    </>
  );
};

export default ProductDetails;
