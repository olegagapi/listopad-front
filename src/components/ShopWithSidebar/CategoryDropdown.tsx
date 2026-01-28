"use client";

import { useState, useMemo } from "react";
import { Category } from "@/types/category";
import { ChevronDownIcon, CheckIcon } from "@/components/Icons";

const CategoryItem = ({ category, level = 0 }: { category: Category & { children?: Category[] }, level?: number }) => {
  const [selected, setSelected] = useState(false);

  return (
    <div className="flex flex-col">
      <button
        className={`${selected && "text-malachite"
          } group flex items-center justify-between ease-out duration-200 hover:text-malachite mb-3`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => setSelected(!selected)}
        data-testid="category-option"
      >
        <div className="flex items-center gap-2">
          <div
            className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${selected ? "border-malachite bg-malachite" : "bg-white border-champagne-400"
              }`}
          >
            <span className={selected ? "block" : "hidden"}>
              <CheckIcon />
            </span>
          </div>

          <span>{category.name}</span>
        </div>

        <span
          className={`${selected ? "text-onyx bg-malachite" : "bg-champagne-200"
            } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-onyx group-hover:bg-malachite`}
        >
          {category.productCount || 0}
        </span>
      </button>

      {category.children && category.children.length > 0 && (
        <div className="flex flex-col">
          {category.children.map((child, key) => (
            <CategoryItem key={key} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryDropdown = ({ categories }: { categories: Category[] }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  const categoryTree = useMemo(() => {
    const tree: (Category & { children: Category[] })[] = [];
    const map = new Map<string, Category & { children: Category[] }>();

    // First pass: create nodes
    categories.forEach(cat => {
      map.set(cat.id.toString(), { ...cat, children: [] });
    });

    // Second pass: link parents and children
    categories.forEach(cat => {
      const node = map.get(cat.id.toString());
      if (node) {
        if (cat.parentId && map.has(cat.parentId)) {
          map.get(cat.parentId)!.children.push(node);
        } else {
          tree.push(node);
        }
      }
    });

    return tree;
  }, [categories]);

  return (
    <div className="bg-champagne-50 shadow-1 rounded-lg" data-testid="category-filter">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${toggleDropdown && "shadow-filter"
          }`}
      >
        <p className="text-onyx">Category</p>
        <button
          aria-label="button for category dropdown"
          className={`text-onyx ease-out duration-200 ${toggleDropdown && "rotate-180"
            }`}
        >
          <ChevronDownIcon />
        </button>
      </div>

      {/* dropdown && 'shadow-filter */}
      {/* <!-- dropdown menu --> */}
      <div
        className={`flex-col py-6 pl-6 pr-5.5 ${toggleDropdown ? "flex" : "hidden"
          }`}
      >
        {categoryTree.map((category, key) => (
          <CategoryItem key={key} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
