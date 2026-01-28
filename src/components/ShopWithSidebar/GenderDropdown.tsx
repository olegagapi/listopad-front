"use client";
import React, { useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@/components/Icons";

const GenderItem = ({ category }) => {
  const [selected, setSelected] = useState(false);
  return (
    <button
      className={`${selected && "text-malachite"
        } group flex items-center justify-between ease-out duration-200 hover:text-malachite `}
      onClick={() => setSelected(!selected)}
      data-testid="gender-option"
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

        <span className="capitalize">{category}</span>
      </div>
    </button>
  );
};

const GenderDropdown = ({ genders }: { genders: string[] }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  return (
    <div className="bg-champagne-50 shadow-1 rounded-lg" data-testid="gender-filter">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${toggleDropdown && "shadow-filter"
          }`}
      >
        <p className="text-onyx">Gender</p>
        <button
          onClick={() => setToggleDropdown(!toggleDropdown)}
          aria-label="button for gender dropdown"
          className={`text-onyx ease-out duration-200 ${toggleDropdown && "rotate-180"
            }`}
        >
          <ChevronDownIcon />
        </button>
      </div>

      {/* <!-- dropdown menu --> */}
      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${toggleDropdown ? "flex" : "hidden"
          }`}
      >
        {genders.map((gender, key) => (
          <GenderItem key={key} category={gender} />
        ))}
      </div>
    </div>
  );
};

export default GenderDropdown;
