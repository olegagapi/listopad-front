"use client";

import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { toggleWishlistItem } from "@/redux/features/wishlist-slice";
import { HeartIcon } from "@/components/Icons";
import { Product } from "@/types/product";

interface WishlistButtonProps {
  product: Product;
  size?: "small" | "large";
}

export default function WishlistButton({
  product,
  size = "small",
}: WishlistButtonProps): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("Wishlist");

  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleToggle = (): void => {
    dispatch(
      toggleWishlistItem({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        quantity: 1,
        currency: product.currency,
        status: "available",
        externalUrl: product.externalUrl,
        imgs: product.imgs,
      })
    );
  };

  const isSmall = size === "small";
  const buttonSize = isSmall ? "w-9 h-9" : "w-12 h-12";
  const iconSize = isSmall ? 16 : 24;

  return (
    <button
      onClick={handleToggle}
      aria-label={isInWishlist ? t("removeFromWishlist") : t("addToWishlist")}
      data-testid="wishlist-toggle"
      className={`flex items-center justify-center ${buttonSize} rounded-[5px] shadow-1 ease-out duration-200 bg-lavender hover:bg-lavender-dark`}
    >
      <HeartIcon
        size={iconSize}
        filled={isInWishlist}
        className={isInWishlist ? "text-lipstick" : "text-onyx"}
      />
    </button>
  );
}
