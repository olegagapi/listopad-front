"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { generateSlug } from "@/lib/supabase-data";

interface BrandLabelProps {
  brandId: string | number;
  brandName: string;
  brandLogoUrl?: string | null;
  onClick?: () => void;
  size?: "small" | "medium";
}

export function BrandLabel({
  brandId,
  brandName,
  brandLogoUrl,
  onClick,
  size = "medium",
}: BrandLabelProps): React.ReactElement {
  const isSmall = size === "small";
  const logoSize = isSmall ? 24 : 32;
  const containerClasses = isSmall
    ? "gap-2 px-3 py-1.5"
    : "gap-3 px-4 py-2.5";

  return (
    <Link
      href={`/brands/${generateSlug(brandName, Number(brandId))}`}
      onClick={onClick}
      className={`inline-flex items-center ${containerClasses} bg-champagne-100 hover:bg-champagne-200 rounded-lg transition-colors group`}
    >
      {brandLogoUrl ? (
        <Image
          src={brandLogoUrl}
          alt={brandName}
          width={logoSize}
          height={logoSize}
          className={`${isSmall ? "w-6 h-6" : "w-8 h-8"} object-contain rounded`}
        />
      ) : (
        <div
          className={`${isSmall ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm"} bg-champagne-300 rounded flex items-center justify-center`}
        >
          <span className="font-medium text-onyx">
            {brandName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <span
        className={`font-medium text-onyx group-hover:text-malachite transition-colors ${isSmall ? "text-sm" : ""}`}
      >
        {brandName}
      </span>
    </Link>
  );
}
