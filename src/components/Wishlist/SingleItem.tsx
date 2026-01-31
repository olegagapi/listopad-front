import React from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

import { removeItemFromWishlist } from "@/redux/features/wishlist-slice";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { RemoveCircleIcon, WarningCircleIcon } from "@/components/Icons";

interface WishlistItem {
  id: string | number;
  slug: string;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  currency?: string;
  status?: string;
  externalUrl?: string | null;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
}

const SingleItem = ({ item }: { item: WishlistItem }) => {
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("ProductItem");

  const handleRemoveFromWishlist = () => {
    dispatch(removeItemFromWishlist(item.id));
  };

  return (
    <div className="flex items-center border-t border-champagne-400 py-5 px-10" data-testid="wishlist-item">
      <div className="min-w-[83px]">
        <button
          onClick={() => handleRemoveFromWishlist()}
          aria-label="button for remove product from wishlist"
          data-testid="remove-wishlist-item"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-champagne-200 border border-champagne-400 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <RemoveCircleIcon />
        </button>
      </div>

      <div className="min-w-[387px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="flex items-center justify-center rounded-[5px] bg-champagne-200 max-w-[80px] w-full h-17.5">
              <Image src={item.imgs?.thumbnails[0]} alt="product" width={200} height={200} />
            </div>

            <div>
              <h3 className="text-onyx ease-out duration-200 hover:text-malachite">
                <Link href={`/products/${item.slug}`}>{item.title}</Link>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-[205px]">
        <p className="text-onyx">{item.discountedPrice} {item.currency}</p>
      </div>

      <div className="min-w-[265px]">
        <div className="flex items-center gap-1.5">
          <WarningCircleIcon />
          <span className="text-red"> Out of Stock </span>
        </div>
      </div>

      <div className="min-w-[150px] flex justify-end">
        <a
          href={item.externalUrl || "/shop-details"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-onyx hover:text-white bg-champagne border border-champagne-400 py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-malachite hover:border-champagne-400"
        >
          {t("visitShop")}
        </a>
      </div>
    </div>
  );
};

export default SingleItem;
