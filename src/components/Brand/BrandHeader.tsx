"use client";

import { useTranslations } from "next-intl";
import { Brand } from "@/types/brand";

interface BrandHeaderProps {
  brand: Brand;
}

const BrandHeader = ({ brand }: BrandHeaderProps) => {
  const t = useTranslations("Brand");

  const firstLetter = brand.name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center text-center mb-12">
      {/* Letter Logo Placeholder */}
      <div className="w-24 h-24 rounded-full bg-malachite flex items-center justify-center mb-6">
        <span className="text-4xl font-bold text-white">{firstLetter}</span>
      </div>

      {/* Brand Name */}
      <h1 className="font-semibold text-2xl sm:text-3xl xl:text-heading-3 text-onyx mb-4">
        {brand.name}
      </h1>

      {/* Description */}
      {brand.description && (
        <p className="text-slate max-w-2xl mb-6">{brand.description}</p>
      )}

      {/* External Links */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {brand.externalUrl && (
          <a
            href={brand.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-medium text-onyx bg-malachite py-3 px-7 rounded-md ease-out duration-200 hover:bg-malachite-dark"
          >
            {t("visitWebsite")}
          </a>
        )}
        {brand.instagramUrl && (
          <a
            href={brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-medium text-onyx bg-lavender py-3 px-7 rounded-md ease-out duration-200 hover:bg-lavender-dark"
          >
            {t("visitInstagram")}
          </a>
        )}
      </div>
    </div>
  );
};

export default BrandHeader;
