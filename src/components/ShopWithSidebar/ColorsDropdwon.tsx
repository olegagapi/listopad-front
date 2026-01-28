"use client";

import React, { useState } from "react";
import { PrimeColor } from "@/types/product";
import { ChevronDownIcon } from "@/components/Icons";

interface ColorsDropdownProps {
  colors: string[];
  selectedColors: PrimeColor[];
  onColorChange: (colors: PrimeColor[]) => void;
}

const ColorsDropdwon = ({
  colors,
  selectedColors,
  onColorChange,
}: ColorsDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  const handleColorToggle = (color: PrimeColor) => {
    const isSelected = selectedColors.includes(color);
    if (isSelected) {
      onColorChange(selectedColors.filter(c => c !== color));
    } else {
      onColorChange([...selectedColors, color]);
    }
  };

  return (
    <div className="bg-champagne-50 shadow-1 rounded-lg" data-testid="color-filter">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${toggleDropdown && "shadow-filter"
          }`}
      >
        <p className="text-dark">Colors</p>
        <button
          type="button"
          aria-label="button for colors dropdown"
          className={`text-dark ease-out duration-200 ${toggleDropdown && "rotate-180"
            }`}
        >
          <ChevronDownIcon />
        </button>
      </div>

      <div
        className={`flex-wrap gap-2.5 p-6 ${toggleDropdown ? "flex" : "hidden"
          }`}
      >
        {colors.map((color) => {
          const isSelected = selectedColors.includes(color as PrimeColor);
          return (
            <button
              key={color}
              type="button"
              onClick={() => handleColorToggle(color as PrimeColor)}
              className="cursor-pointer select-none flex items-center"
              data-testid="color-option"
              aria-label={`Filter by ${color}`}
              aria-pressed={isSelected}
            >
              <div
                className={`flex items-center justify-center w-5.5 h-5.5 rounded-full ${isSelected && "border-2"
                  }`}
                style={{ borderColor: isSelected ? color : "transparent" }}
              >
                <span
                  className="block w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                ></span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorsDropdwon;
