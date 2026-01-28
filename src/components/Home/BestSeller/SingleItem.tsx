"use client";
import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";

import Image from "next/image";
import Link from "next/link";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { EyeIcon, CartIcon, HeartIcon } from "@/components/Icons";

const SingleItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // view on seller website
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
    <div className="group" data-testid="product-item">
      <div className="relative overflow-hidden rounded-lg bg-champagne-200 min-h-[403px]">
        <div className="text-center px-4 py-7.5">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="flex items-center gap-1">
              <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
              <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
              <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
              <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
              <Image src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
            </div>

            <p className="text-custom-sm">({item.reviews})</p>
          </div>

          <h3 className="font-medium text-onyx ease-out duration-200 hover:text-malachite mb-1.5">
            <Link href="/shop-details" data-testid="product-link">
              <span data-testid="product-title">{item.title}</span>
            </Link>
          </h3>

          <span className="flex items-center justify-center gap-2 font-medium text-lg" data-testid="product-price">
            <span className="text-onyx">${item.discountedPrice}</span>
            <span className="text-slate line-through">${item.price}</span>
          </span>
        </div>

        <div className="flex justify-center items-center">
          <Image src={item.imgs.previews[0]} alt="" width={280} height={280} />
        </div>

        <div className="absolute right-0 bottom-0 translate-x-full u-w-full flex flex-col gap-2 p-5.5 ease-linear duration-300 group-hover:translate-x-0">
          <button
            onClick={() => {
              handleQuickViewUpdate();
              openModal();
            }}
            aria-label="button for quick view"
            id="bestOne"
            data-testid="quick-view-btn"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-onyx bg-lavender hover:bg-lavender-dark"
          >
            <EyeIcon />
          </button>

          <a
            href={item.externalUrl || "/shop-details"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="view on seller website"
            id="addCartOne"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-onyx bg-lavender hover:bg-lavender-dark"
          >
            <CartIcon />
          </a>

          <button
            onClick={() => {
              handleItemToWishList();
            }}
            aria-label="button for add to fav"
            id="addFavOne"
            data-testid="wishlist-toggle"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-onyx bg-lavender hover:bg-lavender-dark"
          >
            <HeartIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
