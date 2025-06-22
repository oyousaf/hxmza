"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

type Make = { id: number; name: string };

type Props = {
  query: string;
  loading?: boolean;
  onChange: (updates: { query?: string; }) => void;
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

  const cachedMakes = useRef<Make[] | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filterSuggestions = useCallback((value: string) => {
    const q = value.toLowerCase().trim();
    if (!cachedMakes.current || !q) {
      setSuggestions([]);
      return;
    }
    const filtered = cachedMakes.current.filter((make) =>
      make.name.toLowerCase().includes(q)
    );
    setSuggestions(filtered.slice(0, 8));
    setShowDropdown(true);
  }, []);

  const fetchMakes = useCallback(async () => {
    try {
      const res = await fetch(
        "https://car-specs.p.rapidapi.com/v2/cars/makes",
        {
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
            "X-RapidAPI-Host": "car-specs.p.rapidapi.com",
          },
        }
      );
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

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      cachedMakes.current ? filterSuggestions(inputValue) : fetchMakes();
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, fetchMakes, filterSuggestions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-5xl mx-auto bg-white dark:bg-brand text-textPrimary shadow-md rounded-xl px-4 py-4"
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
          className="w-full border border-gray-300 dark:border-gray-600 pl-10 pr-3 py-2 rounded-md text-sm bg-white dark:bg-brand text-textPrimary placeholder-gray-400 dark:placeholder-gray-500"
          autoCapitalize="off"
          autoCorrect="off"
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-textPrimary dark:border-gray-200 rounded-full" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5 text-textPrimary" />
          )}
        </div>

        <AnimatePresence>
          {showDropdown && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-brand border border-gray-200 dark:border-brand rounded shadow-md text-sm"
            >
              {suggestions.map((make) => (
                <li
                  key={make.id}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-textPrimary dark:hover:text-brand cursor-pointer"
                  onMouseDown={() => {
                    setInputValue(make.name);
                    onChange({ query: make.name });
                    onMakeSelect?.(make);
                    setShowDropdown(false);
                  }}
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
