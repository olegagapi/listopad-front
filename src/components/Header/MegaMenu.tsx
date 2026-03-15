"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useGenderPreference } from "@/app/context/GenderPreferenceContext";
import { buildShopLink } from "@/lib/shopLinks";
import type { Category } from "@/types/category";

interface MegaMenuProps {
  parent: Category;
  items: Category[];
}

export default function MegaMenu({ parent, items }: MegaMenuProps) {
  const t = useTranslations("Header");
  const { gender } = useGenderPreference();

  const linkParams = (categoryId: string | number): Record<string, string> => {
    const p: Record<string, string> = { category: String(categoryId) };
    if (gender) p.gender = gender;
    return p;
  };

  // Calculate column count: aim for 4-6 items per column
  const columnCount = Math.min(4, Math.max(1, Math.ceil(items.length / 5)));

  return (
    <div className="mega-menu">
      <div
        className="grid gap-x-8 gap-y-1"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {items.map((child) => (
          <Link
            key={child.id}
            href={buildShopLink(linkParams(child.id))}
            className="block py-1.5 text-custom-sm text-onyx hover:text-malachite transition-colors duration-150"
          >
            {child.name || child.title}
          </Link>
        ))}
      </div>
      <div className="mt-3 border-t border-champagne-400 pt-3">
        <Link
          href={buildShopLink(linkParams(parent.id))}
          className="text-custom-sm font-medium text-malachite hover:underline"
        >
          {t("viewAllCategory", { category: parent.name || parent.title })}
        </Link>
      </div>
    </div>
  );
}
