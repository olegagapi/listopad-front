"use client";
import React, { useEffect, useState } from "react";

import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { resetQuickView } from "@/redux/features/quickView-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useTranslations } from "next-intl";
import { CloseIcon, ZoomIcon, CheckCircleIcon, HeartIcon, ImagePlaceholderIcon } from "@/components/Icons";

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const t = useTranslations("ProductItem");

  const dispatch = useDispatch<AppDispatch>();

  // get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value);

  const [activePreview, setActivePreview] = useState(0);

  // preview modal
  const handlePreviewSlider = () => {
    dispatch(updateproductDetails(product));

    openPreviewModal();
  };

  // view on seller website (open external link)
  const handleAddToCart = () => {
    const url = product?.externalUrl || "/shop-details";
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    closeModal();
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, closeModal]);

  return (
    <div
      className={`${isModalOpen ? "z-99999" : "hidden"
        } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-onyx/70 sm:px-8 px-4 py-5`}
      data-testid="quick-view-modal"
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-champagne-50 p-7.5 relative modal-content">
          <button
            onClick={() => closeModal()}
            aria-label="button for close modal"
            data-testid="modal-close"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-onyx"
          >
            <CloseIcon />
          </button>

          <div className="flex flex-wrap items-center gap-12.5">
            <div className="max-w-[526px] w-full">
              <div className="flex gap-5">
                <div className="flex flex-col gap-5">
                  {product.imgs.thumbnails?.map((img, key) => (
                    <button
                      onClick={() => setActivePreview(key)}
                      key={key}
                      className={`flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-champagne ease-out duration-200 hover:border-2 hover:border-malachite ${activePreview === key && "border-2 border-malachite"
                        }`}
                    >
                      <Image
                        src={img || ""}
                        alt="thumbnail"
                        width={61}
                        height={61}
                        className="aspect-square"
                      />
                    </button>
                  ))}
                </div>

                <div className="relative z-1 overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-champagne rounded-lg border border-champagne-400">
                  <div>
                    <button
                      onClick={handlePreviewSlider}
                      aria-label="button for zoom"
                      className="gallery__Image w-10 h-10 rounded-[5px] bg-lavender flex items-center justify-center ease-out duration-200 text-onyx hover:text-malachite absolute top-4 lg:top-8 right-4 lg:right-8 z-50"
                    >
                      <ZoomIcon />
                    </button>

                    {product?.imgs?.previews?.[activePreview] ? (
                      <Image
                        src={product.imgs.previews[activePreview]}
                        alt="products-details"
                        width={400}
                        height={400}
                      />
                    ) : (
                      <div className="w-[400px] h-[400px] flex items-center justify-center">
                        <ImagePlaceholderIcon size={64} className="text-slate opacity-50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-[445px] w-full">
              <span className="inline-block text-custom-xs font-medium text-white py-1 px-3 bg-green mb-6.5">
                SALE 20% OFF
              </span>

              <h3 className="font-semibold text-xl xl:text-heading-5 text-onyx mb-4">
                {product.title}
              </h3>

              <div className="flex flex-wrap items-center gap-5 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon />
                  <span className="font-medium text-onyx"> In Stock </span>
                </div>
              </div>

              <p className="text-slate">
                {product.shortDescription || product.description || ""}
              </p>

              <div className="mt-6 mb-7.5">
                <h4 className="font-semibold text-lg text-onyx mb-3.5">Price</h4>

                <span className="flex items-center gap-2">
                  <span className="font-semibold text-onyx text-xl xl:text-heading-4">
                    ${product.discountedPrice}
                  </span>
                  <span className="font-medium text-slate text-lg xl:text-2xl line-through">
                    ${product.price}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleAddToCart()}
                  data-testid="modal-external-link"
                  className={`inline-flex font-medium text-onyx bg-malachite py-3 px-7 rounded-md ease-out duration-200 hover:bg-malachite-dark
                  `}
                >
                  {t("visitShop")}
                </button>

                <button
                  className={`inline-flex items-center gap-2 font-medium text-onyx bg-lavender py-3 px-6 rounded-md border border-lavender-dark ease-out duration-200 hover:bg-lavender-dark hover:border-lavender-dark`}
                >
                  <HeartIcon size={20} />
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
