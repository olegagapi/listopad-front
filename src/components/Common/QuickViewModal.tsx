"use client";

import React, { useEffect } from "react";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { updateproductDetails } from "@/redux/features/product-details";
import { CloseIcon } from "@/components/Icons";
import { ProductView } from "@/components/ProductDetails/ProductView";
import { Product } from "@/types/product";

const QuickViewModal = (): React.ReactElement => {
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const dispatch = useDispatch<AppDispatch>();

  const product = useAppSelector((state) => state.quickViewReducer.value);

  const handleZoomClick = (): void => {
    dispatch(updateproductDetails(product));
    openPreviewModal();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (!target.closest(".modal-content")) {
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
      className={`${
        isModalOpen ? "z-99999" : "hidden"
      } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-onyx/70 sm:px-8 px-4 py-5`}
      data-testid="quick-view-modal"
    >
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-champagne-50 p-7.5 relative modal-content">
          <button
            onClick={() => closeModal()}
            aria-label="button for close modal"
            data-testid="modal-close"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-onyx"
          >
            <CloseIcon />
          </button>

          <ProductView
            product={product as Product}
            variant="compact"
            onClose={closeModal}
            onZoomClick={handleZoomClick}
          />
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
