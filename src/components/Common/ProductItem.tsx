"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";

import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { EyeIcon, CartIcon, HeartIcon } from "@/components/Icons";

const ProductItem = ({ item }: { item: Product }) => {
  const t = useTranslations("ProductItem");
  const { openModal } = useModalContext();

  const dispatch = useDispatch<AppDispatch>();

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        ...item,
        status: "available",
        quantity: 1,
      }),
    );
  };

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

  return (
    <div className="group" data-testid="product-item">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-champagne-200 min-h-[270px] mb-4">
        <Image src={item.imgs.previews[0]} alt="" width={250} height={250} />

        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <button
            onClick={() => {
              openModal();
              handleQuickViewUpdate();
            }}
            id="newOne"
            aria-label="button for quick view"
            data-testid="quick-view-btn"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-onyx bg-lavender hover:bg-lavender-dark"
          >
            <EyeIcon />
          </button>

          <a
            href={item.externalUrl || "/shop-details"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("visitShopLabel")}
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-onyx bg-lavender hover:bg-lavender-dark"
          >
            <CartIcon />
          </a>

          <button
            onClick={() => handleItemToWishList()}
            aria-label="button for favorite select"
            id="favOne"
            data-testid="wishlist-toggle"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-onyx bg-lavender hover:bg-lavender-dark"
          >
            <HeartIcon />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1">
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
        </div>

        <p className="text-custom-sm">({item.reviews})</p>
      </div>

      <h3
        className="font-medium text-onyx ease-out duration-200 hover:text-malachite mb-1.5"
        onClick={() => handleProductDetails()}
      >
        <Link href="/shop-details" data-testid="product-link">
          <span data-testid="product-title">{item.title}</span>
        </Link>
      </h3>

      <span className="flex items-center gap-2 font-medium text-lg" data-testid="product-price">
        <span className="text-onyx">${item.discountedPrice}</span>
        <span className="text-slate line-through">${item.price}</span>
      </span>
    </div>
  );
};

export default ProductItem;
