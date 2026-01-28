"use client";

import { useState, useMemo } from "react";
import { Category } from "@/types/category";
import { ChevronDownIcon, CheckIcon } from "@/components/Icons";

type CategoryWithChildren = Category & { children: CategoryWithChildren[] };

interface CategoryItemProps {
  category: CategoryWithChildren;
  level?: number;
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
  facetCounts?: Record<string, number>;
}

const CategoryItem = ({
  category,
  level = 0,
  selectedCategories,
  onCategoryChange,
  facetCounts,
}: CategoryItemProps) => {
  const isSelected = selectedCategories.includes(String(category.id));
  const count = facetCounts?.[String(category.id)] ?? category.productCount ?? 0;

  return (
    <div className="flex flex-col">
      <button
        type="button"
        className={`${isSelected && "text-malachite"
          } group flex items-center justify-between ease-out duration-200 hover:text-malachite mb-3`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => onCategoryChange(String(category.id))}
        data-testid="category-option"
      >
        <div className="flex items-center gap-2">
          <div
            className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${isSelected ? "border-malachite bg-malachite" : "bg-white border-champagne-400"
              }`}
          >
            <span className={isSelected ? "block" : "hidden"}>
              <CheckIcon />
            </span>
          </div>

          <span>{category.name}</span>
        </div>

        <span
          className={`${isSelected ? "text-onyx bg-malachite" : "bg-champagne-200"
            } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-onyx group-hover:bg-malachite`}
        >
          {count}
        </span>
      </button>

      {category.children && category.children.length > 0 && (
        <div className="flex flex-col">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedCategories={selectedCategories}
              onCategoryChange={onCategoryChange}
              facetCounts={facetCounts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  facetCounts?: Record<string, number>;
}

const CategoryDropdown = ({
  categories,
  selectedCategories,
  onCategoryChange,
  facetCounts,
}: CategoryDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  const categoryTree = useMemo(() => {
    const tree: CategoryWithChildren[] = [];
    const map = new Map<string, CategoryWithChildren>();

    // First pass: create nodes
    categories.forEach(cat => {
      map.set(String(cat.id), { ...cat, children: [] });
    });

    // Second pass: link parents and children
    categories.forEach(cat => {
      const node = map.get(String(cat.id));
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

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId);
    if (isSelected) {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

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
          type="button"
          aria-label="button for category dropdown"
          className={`text-onyx ease-out duration-200 ${toggleDropdown && "rotate-180"
            }`}
        >
          <ChevronDownIcon />
        </button>
      </div>

      <div
        className={`flex-col py-6 pl-6 pr-5.5 ${toggleDropdown ? "flex" : "hidden"
          }`}
      >
        {categoryTree.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryToggle}
            facetCounts={facetCounts}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
