"use client";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useGenderPreference } from "@/app/context/GenderPreferenceContext";
import { ChevronDownSmallIcon } from "@/components/Icons";
import type { Category } from "@/types/category";
import { buildCategoryTree } from "@/lib/buildCategoryTree";
import { buildShopLink } from "@/lib/shopLinks";
import GenderSwitch from "./GenderSwitch";

interface MobileCategoryMenuProps {
  categories: Category[];
  onNavigate: () => void;
}

export default function MobileCategoryMenu({ categories, onNavigate }: MobileCategoryMenuProps) {
  const t = useTranslations("Header");
  const { gender } = useGenderPreference();
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  const buildHref = (categoryId?: string | number): string =>
    buildShopLink({
      category: categoryId ? String(categoryId) : undefined,
      gender: gender ?? undefined,
    });

  const toggleExpand = (id: string | number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-3">
      <GenderSwitch />

      <Link
        href={buildHref()}
        onClick={onNavigate}
        className="text-custom-sm font-medium text-onyx hover:text-malachite py-1"
      >
        {t("shopAll")}
      </Link>

      {tree.map((cat) => (
        <div key={cat.id}>
          <div className="flex items-center justify-between">
            <Link
              href={buildHref(cat.id)}
              onClick={onNavigate}
              className="text-custom-sm font-medium text-onyx hover:text-malachite py-1 flex-1"
            >
              {cat.name || cat.title}
            </Link>
            {cat.children.length > 0 && (
              <button
                onClick={() => toggleExpand(cat.id)}
                className="p-1 text-onyx hover:text-malachite transition-transform duration-200"
                aria-label={`Expand ${cat.name || cat.title}`}
              >
                <ChevronDownSmallIcon
                  className={`transition-transform duration-200 ${expandedId === cat.id ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>

          {cat.children.length > 0 && expandedId === cat.id && (
            <div className="flex flex-col gap-1 pl-4 mt-1">
              {cat.children.map((child) => (
                <Link
                  key={child.id}
                  href={buildHref(child.id)}
                  onClick={onNavigate}
                  className="text-custom-sm text-onyx/80 hover:text-malachite py-1"
                >
                  {child.name || child.title}
                </Link>
              ))}
              <Link
                href={buildHref(cat.id)}
                onClick={onNavigate}
                className="text-custom-sm font-medium text-malachite hover:underline py-1"
              >
                {t("viewAllCategory", { category: cat.name || cat.title })}
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
