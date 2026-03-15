"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ZoomIcon, ImagePlaceholderIcon } from "@/components/Icons";
import WishlistButton from "@/components/Common/WishlistButton";
import { BrandLabel } from "@/components/Common/BrandLabel";
import { Product } from "@/types/product";

interface ProductViewProps {
  product: Product;
  variant: "compact" | "full";
  onClose?: () => void;
  onZoomClick?: () => void;
}

export function ProductView({
  product,
  variant,
  onClose,
  onZoomClick,
}: ProductViewProps): React.ReactElement {
  const t = useTranslations("ProductItem");
  const [previewImg, setPreviewImg] = useState(0);
  const isCompact = variant === "compact";

  // Sizing based on variant
  const thumbnailSize = isCompact ? 60 : 80;
  const thumbnailClasses = isCompact
    ? "w-15 h-15"
    : "w-15 sm:w-20 h-15 sm:h-20";
  const titleClasses = isCompact
    ? "text-xl"
    : "text-xl sm:text-2xl xl:text-custom-3";
  const brandSize = isCompact ? "small" : "medium";
  const containerMaxWidth = isCompact ? "max-w-[445px]" : "max-w-[539px]";

  const handleVisitShop = (): void => {
    const url = product?.externalUrl || "#";
    if (url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    onClose?.();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-12.5">
      {/* Image section with left thumbnails */}
      <div className={isCompact ? "max-w-[526px] w-full" : "lg:max-w-[570px] w-full"}>
        <div className="flex gap-4 sm:gap-5">
          {/* Thumbnails - left side vertical */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {product.imgs?.thumbnails?.map((item: string, key: number) => (
              <button
                onClick={() => setPreviewImg(key)}
                key={key}
                className={`flex items-center justify-center ${thumbnailClasses} overflow-hidden rounded-lg bg-champagne-200 shadow-1 ease-out duration-200 border-2 hover:border-malachite ${
                  key === previewImg ? "border-malachite" : "border-transparent"
                }`}
              >
                <Image
                  width={thumbnailSize}
                  height={thumbnailSize}
                  src={item}
                  alt="thumbnail"
                  className="aspect-square object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="relative z-1 overflow-hidden flex items-center justify-center w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[508px] bg-champagne-200 rounded-lg border border-champagne-400 shadow-1">
            <button
              onClick={onZoomClick}
              aria-label="button for zoom"
              className="gallery__Image w-10 h-10 sm:w-11 sm:h-11 rounded-[5px] bg-lavender flex items-center justify-center ease-out duration-200 text-white hover:text-malachite absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
            >
              <ZoomIcon />
            </button>

            {product?.imgs?.previews?.[previewImg] ? (
              <Image
                src={product.imgs.previews[previewImg]}
                alt={product.title}
                width={400}
                height={400}
              />
            ) : (
              <div className="w-[400px] h-[400px] flex items-center justify-center">
                <ImagePlaceholderIcon
                  size={64}
                  className="text-slate opacity-50"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product content */}
      <div className={`${containerMaxWidth} w-full`}>
        {/* Title */}
        <div className="flex items-center justify-between mb-3">
          <h2
            className={`font-semibold ${titleClasses} text-onyx`}
            data-testid="product-title"
          >
            {product.title}
          </h2>
        </div>

        {/* Brand */}
        {product.brandName && product.brandId && (
          <div className="mb-4">
            <BrandLabel
              brandId={product.brandId}
              brandName={product.brandName}
              brandLogoUrl={product.brandLogoUrl}
              onClick={onClose}
              size={brandSize}
            />
          </div>
        )}

        {/* Price */}
        <h3 className="font-medium text-custom-1 mb-4.5" data-testid="product-price">
          <span className={`${isCompact ? "text-xl xl:text-heading-4 font-semibold" : "text-sm sm:text-base"} text-onyx`}>
            {product.price} {product.currency}
          </span>
        </h3>

        {/* Description */}
        {(product.shortDescription || product.description) && (
          <p className="text-slate mb-6" data-testid="product-description">
            {product.shortDescription || product.description}
          </p>
        )}

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className={`flex flex-col gap-4.5 border-y border-champagne-400 ${isCompact ? "mt-5 mb-6 py-6" : "mt-7.5 mb-9 py-9"}`}>
            <div className="flex items-center gap-4">
              <div className="min-w-[65px]">
                <h4 className="font-medium text-onyx">Color:</h4>
              </div>

              <div className="flex items-center gap-2.5">
                {product.colors.map((color, key) => (
                  <div
                    key={key}
                    className="flex items-center justify-center w-5.5 h-5.5 rounded-full border"
                    style={{ borderColor: color }}
                  >
                    <span
                      className="block w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    ></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          {variant === "compact" ? (
            <button
              onClick={handleVisitShop}
              data-testid="modal-external-link"
              className="inline-flex font-medium text-white bg-malachite py-3 px-7 rounded-md ease-out duration-200 hover:bg-malachite-dark"
            >
              {t("visitShop")}
            </button>
          ) : (
            <a
              href={product.externalUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="external-link"
              className="inline-flex font-medium text-white bg-malachite py-3 px-7 rounded-md ease-out duration-200 hover:bg-malachite-dark"
            >
              {t("visitShop")}
            </a>
          )}

          <WishlistButton product={product} size="large" />
        </div>
      </div>
    </div>
  );
}

export default ProductView;
