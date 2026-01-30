import React, { useState, useEffect, useRef, useMemo } from "react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const CustomSelect = ({ options, defaultValue, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const defaultOption = useMemo(() => {
    if (defaultValue) {
      return options.find((opt) => opt.value === defaultValue) ?? options[0];
    }
    return options[0];
  }, [options, defaultValue]);

  const [selectedOption, setSelectedOption] = useState<Option | undefined>(defaultOption);

  // Update selected option when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      const option = options.find((opt) => opt.value === defaultValue);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [defaultValue, options]);

  // Function to close the dropdown when a click occurs outside the component
  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add a click event listener to the document
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    toggleDropdown();
    if (onChange) {
      onChange(option.value);
    }
  };

  return (
    <div
      className="custom-select custom-select-2 flex-shrink-0 relative"
      ref={selectRef}
    >
      <div
        className={`select-selected whitespace-nowrap ${
          isOpen ? "select-arrow-active" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption?.label}
      </div>
      <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
        {options.slice(1).map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`select-item ${
              selectedOption === option ? "same-as-selected" : ""
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
