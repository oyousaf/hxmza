"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "motion/react";

type Make = { id: number; name: string };

type Props = {
  query: string;
  loading?: boolean;
  onChange: (updates: { query?: string }) => void;
  onMakeSelect?: (make: Make) => void;
  placeholder?: string;
};

const DEBOUNCE_DELAY = 300;

export default function SearchBar({
  query,
  loading = false,
  onChange,
  onMakeSelect,
  placeholder = "Search…",
}: Props) {
  const [inputValue, setInputValue] = useState(query);
  const [suggestions, setSuggestions] = useState<Make[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const cachedMakes = useRef<Make[] | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filterSuggestions = useCallback((value: string) => {
    const q = value.toLowerCase().trim();
    if (!cachedMakes.current || !q) return setSuggestions([]);

    const filtered = cachedMakes.current.filter((make) =>
      make.name.toLowerCase().includes(q)
    );
    setSuggestions(filtered.slice(0, 8));
    setShowDropdown(true);
    setActiveIndex(-1);
  }, []);

  const fetchMakes = useCallback(async () => {
    try {
      const res = await fetch("/api/makes");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const makes: Make[] = await res.json();
      cachedMakes.current = makes;
      filterSuggestions(inputValue);
    } catch (err) {
      console.error("❌ Failed to fetch makes:", err);
      setSuggestions([]);
    }
  }, [filterSuggestions, inputValue]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (cachedMakes.current) {
        filterSuggestions(inputValue);
      } else {
        fetchMakes();
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, fetchMakes, filterSuggestions]);

  const selectMake = (make: Make) => {
    setInputValue(make.name);
    onChange({ query: make.name });
    onMakeSelect?.(make);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectMake(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mx-auto w-full max-w-5xl rounded-xl bg-white px-4 py-4 text-textPrimary shadow-md dark:bg-brand"
    >
      <div className="relative w-full">
        <input
          type="text"
          role="combobox"
          aria-expanded={showDropdown && suggestions.length > 0}
          aria-controls="make-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `make-option-${suggestions[activeIndex]?.id}` : undefined
          }
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-textPrimary placeholder-gray-400 dark:border-gray-600 dark:bg-brand dark:placeholder-gray-500"
          autoCapitalize="off"
          autoCorrect="off"
        />
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-textPrimary dark:border-gray-200" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5 text-textPrimary" />
          )}
        </div>

        <AnimatePresence>
          {showDropdown && suggestions.length > 0 && (
            <motion.ul
              id="make-suggestions"
              role="listbox"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border border-gray-200 bg-white text-sm shadow-md dark:border-brand dark:bg-brand"
            >
              {suggestions.map((make, index) => (
                <li
                  key={make.id}
                  id={`make-option-${make.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-textPrimary dark:hover:text-brand ${
                    index === activeIndex
                      ? "bg-gray-100 dark:bg-textPrimary dark:text-brand"
                      : ""
                  }`}
                  onMouseDown={() => selectMake(make)}
                >
                  {make.name}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
