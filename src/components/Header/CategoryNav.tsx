"use client";
import { useMemo, useState, useRef, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useGenderPreference } from "@/app/context/GenderPreferenceContext";
import type { Category } from "@/types/category";
import { buildCategoryTree } from "@/lib/buildCategoryTree";
import MegaMenu from "./MegaMenu";

interface CategoryNavProps {
  categories: Category[];
  stickyMenu: boolean;
}

const HOVER_DELAY = 150;

export default function CategoryNav({ categories, stickyMenu }: CategoryNavProps) {
  const t = useTranslations("Header");
  const { gender } = useGenderPreference();
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  const handleMouseEnter = useCallback((id: string | number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveId(null), HOVER_DELAY);
  }, []);

  const shopAllHref = gender
    ? `/shop-with-sidebar?gender=${gender}`
    : "/shop-with-sidebar";

  return (
    <nav className="hidden xl:block">
      <ul className="flex items-center gap-1">
        {/* Shop All link */}
        <li
          className="group relative before:w-0 before:h-[3px] before:bg-malachite before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full"
        >
          <Link
            href={shopAllHref}
            className={`hover:text-malachite text-custom-sm font-medium text-onyx flex px-2.5 ${stickyMenu ? "py-3" : "py-3"}`}
          >
            {t("shopAll")}
          </Link>
        </li>

        {tree.map((cat) => (
          <li
            key={cat.id}
            className="group relative before:w-0 before:h-[3px] before:bg-malachite before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full"
            onMouseEnter={() => handleMouseEnter(cat.id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={gender ? `/shop-with-sidebar?category=${cat.id}&gender=${gender}` : `/shop-with-sidebar?category=${cat.id}`}
              className={`hover:text-malachite text-custom-sm font-medium text-onyx flex px-2.5 ${stickyMenu ? "py-3" : "py-3"}`}
            >
              {cat.name || cat.title}
            </Link>

            {cat.children.length > 0 && activeId === cat.id && (
              <div
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={handleMouseLeave}
              >
                <MegaMenu parent={cat} items={cat.children} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
