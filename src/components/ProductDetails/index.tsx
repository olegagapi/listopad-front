"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Newsletter from "../Common/Newsletter";
import RecentlyViewdItems from "../ShopDetails/RecentlyViewd";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useTranslations } from "next-intl";
import { ZoomIcon, CheckCircleIcon } from "@/components/Icons";
import WishlistButton from "@/components/Common/WishlistButton";

import { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetails = ({ product, relatedProducts }: ProductDetailsProps) => {
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const t = useTranslations("ProductItem");

  const [activeTab, setActiveTab] = useState("tabOne");

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

  const [activeColor, setActiveColor] = useState(() =>
    product?.colors?.[0] ?? ""
  );

  const handlePreviewSlider = () => {
    openPreviewModal();
  };

  return (
    <>
      <Breadcrumb title={"Shop Details"} pages={["shop details"]} />

      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
            <div className="lg:max-w-[570px] w-full">
              <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-champagne-200 p-4 sm:p-7.5 relative flex items-center justify-center">
                <div>
                  <button
                    onClick={handlePreviewSlider}
                    aria-label="button for zoom"
                    className="gallery__Image w-11 h-11 rounded-[5px] bg-lavender flex items-center justify-center ease-out duration-200 text-onyx hover:text-malachite absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                  >
                    <ZoomIcon />
                  </button>

                  <Image
                    src={product.imgs?.previews[previewImg] ?? ""}
                    alt={product.title}
                    width={400}
                    height={400}
                  />
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                {product.imgs?.thumbnails.map((item: string, key: number) => (
                  <button
                    onClick={() => setPreviewImg(key)}
                    key={key}
                    className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-champagne-200 shadow-1 ease-out duration-200 border-2 hover:border-malachite ${key === previewImg
                      ? "border-malachite"
                      : "border-transparent"
                      }`}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={item}
                      alt="thumbnail"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* <!-- product content --> */}
            <div className="max-w-[539px] w-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-onyx" data-testid="product-title">
                  {product.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircleIcon />
                  <span className="text-green"> In Stock </span>
                </div>
              </div>

              <h3 className="font-medium text-custom-1 mb-4.5" data-testid="product-price">
                <span className="text-sm sm:text-base text-onyx">
                  {product.price} {product.currency}
                </span>
                {product.discountedPrice && product.discountedPrice < product.price && (
                  <span className="line-through ml-2">
                    {product.discountedPrice} {product.currency}
                  </span>
                )}
              </h3>

              {product.shortDescription && (
                <p className="text-slate mb-6" data-testid="product-description">
                  {product.shortDescription}
                </p>
              )}

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-4.5 border-y border-champagne-400 mt-7.5 mb-9 py-9">
                  {/* <!-- Color selector --> */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="min-w-[65px]">
                        <h4 className="font-medium text-onyx">Color:</h4>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {product.colors?.map((color: string, key: number) => (
                          <label
                            key={key}
                            htmlFor={color}
                            className="cursor-pointer select-none flex items-center"
                          >
                            <div className="relative">
                              <input
                                type="radio"
                                name="color"
                                id={color}
                                className="sr-only"
                                onChange={() => setActiveColor(color)}
                              />
                              <div
                                className={`flex items-center justify-center w-5.5 h-5.5 rounded-full ${activeColor === color && "border"
                                  }`}
                                style={{ borderColor: `${color}` }}
                              >
                                <span
                                  className="block w-3 h-3 rounded-full"
                                  style={{ backgroundColor: `${color}` }}
                                ></span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4.5">
                  <a
                    href={product.externalUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="external-link"
                    className="inline-flex font-medium text-onyx bg-malachite py-3 px-7 rounded-md ease-out duration-200 hover:bg-malachite-dark"
                  >
                    {t("visitShop")}
                  </a>

                  <WishlistButton product={product} size="large" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-champagne-200 py-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* <!--== tab header start ==--> */}
          <div className="flex flex-wrap items-center bg-champagne-50 rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
            {tabs.map((item, key) => (
              <button
                key={key}
                onClick={() => setActiveTab(item.id)}
                className={`font-medium lg:text-lg ease-out duration-200 hover:text-malachite relative before:h-0.5 before:bg-malachite before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${activeTab === item.id
                  ? "text-malachite before:w-full"
                  : "text-onyx before:w-0"
                  }`}
              >
                {item.title}
              </button>
            ))}
          </div>
          {/* <!--== tab header end ==--> */}

          {/* <!--== tab content start ==--> */}
          {/* <!-- tab content one: Description --> */}
          <div>
            <div
              className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${activeTab === "tabOne" ? "flex" : "hidden"
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
          {/* <!-- tab content one end --> */}

          {/* <!-- tab content two: Additional Information --> */}
          <div>
            <div
              className={`rounded-xl bg-champagne-50 shadow-1 p-4 sm:p-6 mt-10 ${activeTab === "tabTwo" ? "block" : "hidden"
                }`}
            >
              {/* <!-- Brand --> */}
              {product.brandName && (
                <div className="rounded-md even:bg-champagne flex py-4 px-4 sm:px-5">
                  <div className="max-w-[450px] min-w-[140px] w-full">
                    <p className="text-sm sm:text-base text-onyx">Brand</p>
                  </div>
                  <div className="w-full">
                    <p className="text-sm sm:text-base text-onyx">{product.brandName}</p>
                  </div>
                </div>
              )}

              {/* <!-- Gender --> */}
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

              {/* <!-- Categories --> */}
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

              {/* <!-- Colors --> */}
              {product.colors && product.colors.length > 0 && (
                <div className="rounded-md even:bg-champagne flex py-4 px-4 sm:px-5">
                  <div className="max-w-[450px] min-w-[140px] w-full">
                    <p className="text-sm sm:text-base text-onyx">Available Colors</p>
                  </div>
                  <div className="w-full">
                    <p className="text-sm sm:text-base text-onyx capitalize">
                      {product.colors.join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {/* <!-- Tags --> */}
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
          {/* <!-- tab content two end --> */}
        </div>
      </section>

      <RecentlyViewdItems products={relatedProducts} />

      <Newsletter />
    </>
  );
};

export default ProductDetails;
