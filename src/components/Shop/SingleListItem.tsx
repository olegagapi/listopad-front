"use client";
import React from "react";

import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";

import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { EyeIcon, CartIcon, HeartIcon } from "@/components/Icons";

const SingleListItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("ProductItem");

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // view on seller website (open external link)
  const handleAddToCart = () => {
    const url = item.externalUrl || "/shop-details";
    if (typeof window !== "undefined" && url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
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

  return (
    <div className="group rounded-lg bg-champagne-50 shadow-1" data-testid="product-item">
      <div className="flex">
        <div className="shadow-list relative overflow-hidden flex items-center justify-center max-w-[270px] w-full sm:min-h-[270px] p-4">
          <Image src={item.imgs.previews[0]} alt="" width={250} height={250} />

          <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
            <button
              onClick={() => {
                openModal();
                handleQuickViewUpdate();
              }}
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
              data-testid="wishlist-toggle"
              className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-onyx bg-lavender hover:bg-lavender-dark"
            >
              <HeartIcon />
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center justify-center sm:justify-between py-5 px-4 sm:px-7.5 lg:pl-11 lg:pr-12">
          <div>
            <h3 className="font-medium text-onyx ease-out duration-200 hover:text-malachite mb-1.5">
              <Link href="/shop-details" data-testid="product-link">
                <span data-testid="product-title">{item.title}</span>
              </Link>
            </h3>

            <span className="flex items-center gap-2 font-medium text-lg" data-testid="product-price">
              <span className="text-onyx">${item.discountedPrice}</span>
              <span className="text-slate line-through">${item.price}</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex items-center gap-1">
              <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
              <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
              <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
              <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
              <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
            </div>

            <p className="text-custom-sm">({item.reviews})</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
