"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { ChevronDownIcon } from '@/components/Icons';
import { PriceRange, SelectedPrice } from '@/types/filters';

interface PriceDropdownProps {
  priceRange: PriceRange;
  selectedPrice: SelectedPrice;
  onPriceChange: (from: number | null, to: number | null) => void;
}

const DEBOUNCE_MS = 300;

const PriceDropdown = ({
  priceRange,
  selectedPrice,
  onPriceChange,
}: PriceDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  // Track if user is actively dragging the slider
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<{ from: number; to: number } | null>(null);

  // Debounce timer ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute displayed price: use drag value when dragging, otherwise derive from props
  const localPrice = useMemo(() => {
    if (isDragging && dragValue) {
      return dragValue;
    }
    return {
      from: selectedPrice.from ?? priceRange.min,
      to: selectedPrice.to ?? priceRange.max,
    };
  }, [isDragging, dragValue, selectedPrice.from, selectedPrice.to, priceRange.min, priceRange.max]);

  const debouncedPriceChange = useCallback(
    (from: number, to: number) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        // Only set to non-null if different from the range bounds
        const fromValue = from === priceRange.min ? null : from;
        const toValue = to === priceRange.max ? null : to;
        onPriceChange(fromValue, toValue);
        // Reset dragging state after debounce completes
        setIsDragging(false);
        setDragValue(null);
      }, DEBOUNCE_MS);
    },
    [onPriceChange, priceRange.min, priceRange.max]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSliderChange = (values: number[]) => {
    const from = Math.floor(values[0] ?? priceRange.min);
    const to = Math.ceil(values[1] ?? priceRange.max);

    setIsDragging(true);
    setDragValue({ from, to });
    debouncedPriceChange(from, to);
  };

  return (
    <div className="bg-champagne-50 shadow-1 rounded-lg" data-testid="price-filter">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5"
      >
        <p className="text-dark">Price</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setToggleDropdown(!toggleDropdown);
          }}
          id="price-dropdown-btn"
          aria-label="button for price dropdown"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown && 'rotate-180'
          }`}
        >
          <ChevronDownIcon />
        </button>
      </div>

      <div className={`p-6 ${toggleDropdown ? 'block' : 'hidden'}`}>
        <div id="pricingOne">
          <div className="price-range">
            <RangeSlider
              id="range-slider-gradient"
              className="margin-lg"
              min={priceRange.min}
              max={priceRange.max}
              value={[localPrice.from, localPrice.to]}
              step={1}
              onInput={handleSliderChange}
            />

            <div className="price-amount flex items-center justify-between pt-4">
              <div className="text-custom-xs text-dark-4 flex rounded border border-gray-3/80">
                <span className="block border-r border-gray-3/80 px-2.5 py-1.5">
                  UAH
                </span>
                <span id="minAmount" className="block px-3 py-1.5" data-testid="price-min">
                  {localPrice.from}
                </span>
              </div>

              <div className="text-custom-xs text-dark-4 flex rounded border border-gray-3/80">
                <span className="block border-r border-gray-3/80 px-2.5 py-1.5">
                  UAH
                </span>
                <span id="maxAmount" className="block px-3 py-1.5" data-testid="price-max">
                  {localPrice.to}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDropdown;
