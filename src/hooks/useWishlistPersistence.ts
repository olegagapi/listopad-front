"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector, AppDispatch } from "@/redux/store";
import { hydrateWishlist, WishListItem } from "@/redux/features/wishlist-slice";

const STORAGE_KEY = "listopad_wishlist";

export function useWishlistPersistence(): void {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const isHydrated = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WishListItem[];
        if (Array.isArray(parsed)) {
          dispatch(hydrateWishlist(parsed));
        }
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
    }
    isHydrated.current = true;
  }, [dispatch]);

  // Save to localStorage when wishlist changes
  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated.current) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [wishlistItems]);
}
