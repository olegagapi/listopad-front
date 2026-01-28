"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Product } from "@/types/product";

interface SearchDropdownProps {
  results: Product[];
  totalHits: number;
  query: string;
  isLoading: boolean;
  isVisible: boolean;
  onClose: () => void;
}

const SearchDropdown = ({
  results,
  totalHits,
  query,
  isLoading,
  isVisible,
  onClose,
}: SearchDropdownProps) => {
  const t = useTranslations("Search");

  if (!isVisible || (!query.trim() && results.length === 0)) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-champagne-50 border border-champagne-400 rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto">
      {isLoading ? (
        <div className="p-4 text-center text-slate">
          <span className="inline-block animate-spin mr-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset="12"
              />
            </svg>
          </span>
          {t("searching")}
        </div>
      ) : results.length === 0 ? (
        <div className="p-4 text-center text-slate">
          {t("noResults", { query })}
        </div>
      ) : (
        <>
          <ul className="divide-y divide-champagne-400">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 hover:bg-champagne transition-colors"
                >
                  {product.imgs.thumbnails[0] && (
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={product.imgs.thumbnails[0]}
                        alt={product.title}
                        fill
                        className="object-cover rounded"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-onyx truncate">
                      {product.title}
                    </p>
                    {product.brandName && (
                      <p className="text-xs text-slate truncate">
                        {product.brandName}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-malachite">
                      {product.discountedPrice} {product.currency}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {totalHits > results.length && (
            <div className="p-3 border-t border-champagne-400">
              <Link
                href={`/shop-with-sidebar?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="block text-center text-sm font-medium text-malachite hover:underline"
              >
                {t("viewAll", { count: totalHits })}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchDropdown;
