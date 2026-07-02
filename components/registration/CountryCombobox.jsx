"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { countryCodes } from "@/lib/countryCodes";
import { formControlClass, labelClass, errorClass } from "./formStyles";

export default function CountryCombobox({
  label,
  name,
  value,
  onChange,
  error,
  span,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const filtered = countryCodes.filter((country) =>
    country.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery(value || "");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  useEffect(() => {
    if (open && listRef.current) {
      const highlighted = listRef.current.children[highlightIndex];
      highlighted?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex, open]);

  const selectCountry = (countryName) => {
    onChange({ target: { name, value: countryName } });
    setQuery(countryName);
    setOpen(false);
    setHighlightIndex(0);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    setHighlightIndex(0);
    if (!e.target.value) {
      onChange({ target: { name, value: "" } });
    }
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      setQuery(value || "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      selectCountry(filtered[highlightIndex].name);
    }
  };

  return (
    <div
      className={span ? "md:col-span-2" : ""}
      ref={containerRef}
      data-field={name}
    >
      <label htmlFor={`${name}-input`} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={`${name}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${name}-listbox`}
          autoComplete="off"
          placeholder="Search or select country"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={`${formControlClass(error)} pr-10`}
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {open && (
          <ul
            id={`${name}-listbox`}
            ref={listRef}
            role="listbox"
            className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg [color-scheme:light]"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">
                No countries found
              </li>
            ) : (
              filtered.map((country, index) => (
                <li
                  key={country.name}
                  role="option"
                  aria-selected={value === country.name}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectCountry(country.name);
                  }}
                  onMouseEnter={() => setHighlightIndex(index)}
                  className={`cursor-pointer px-3 py-2 text-sm ${
                    index === highlightIndex
                      ? "bg-orange-50 text-orange-900"
                      : "hover:bg-gray-50"
                  } ${value === country.name ? "font-medium" : ""}`}
                >
                  {country.name}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
