"use client";

import React, { useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@/components/Icons";
import { Gender } from "@/types/product";

interface GenderItemProps {
  gender: Gender;
  isSelected: boolean;
  onToggle: () => void;
  count?: number;
}

const GenderItem = ({ gender, isSelected, onToggle, count }: GenderItemProps) => {
  return (
    <button
      type="button"
      className={`${isSelected && "text-malachite"
        } group flex items-center justify-between ease-out duration-200 hover:text-malachite w-full`}
      onClick={onToggle}
      data-testid="gender-option"
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

        <span className="capitalize">{gender}</span>
      </div>

      {count !== undefined && (
        <span
          className={`${isSelected ? "text-onyx bg-malachite" : "bg-champagne-200"
            } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-onyx group-hover:bg-malachite`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

interface GenderDropdownProps {
  genders: string[];
  selectedGenders: Gender[];
  onGenderChange: (genders: Gender[]) => void;
  facetCounts?: Record<Gender, number>;
}

const GenderDropdown = ({
  genders,
  selectedGenders,
  onGenderChange,
  facetCounts,
}: GenderDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  const handleGenderToggle = (gender: Gender) => {
    const isSelected = selectedGenders.includes(gender);
    if (isSelected) {
      onGenderChange(selectedGenders.filter(g => g !== gender));
    } else {
      onGenderChange([...selectedGenders, gender]);
    }
  };

  return (
    <div className="bg-champagne-50 shadow-1 rounded-lg" data-testid="gender-filter">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${toggleDropdown && "shadow-filter"
          }`}
      >
        <p className="text-onyx">Gender</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setToggleDropdown(!toggleDropdown);
          }}
          aria-label="button for gender dropdown"
          className={`text-onyx ease-out duration-200 ${toggleDropdown && "rotate-180"
            }`}
        >
          <ChevronDownIcon />
        </button>
      </div>

      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${toggleDropdown ? "flex" : "hidden"
          }`}
      >
        {genders.map((gender) => (
          <GenderItem
            key={gender}
            gender={gender as Gender}
            isSelected={selectedGenders.includes(gender as Gender)}
            onToggle={() => handleGenderToggle(gender as Gender)}
            count={facetCounts?.[gender as Gender]}
          />
        ))}
      </div>
    </div>
  );
};

export default GenderDropdown;
