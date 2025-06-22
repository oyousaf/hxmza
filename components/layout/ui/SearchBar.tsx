"use client";

import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

type Make = { id: number; name: string };

type Props = {
  query: string;
  type: string;
  loading?: boolean;
  onChange: (updates: { query?: string; type?: string }) => void;
  onMakeSelect?: (make: Make) => void;
  placeholder?: string;
};

const DEBOUNCE_DELAY = 300;

export default function SearchBar({
  query,
  type,
  loading = false,
  onChange,
  onMakeSelect,
  placeholder = "Search make…",
}: Props) {
  const [inputValue, setInputValue] = useState(query);
  const [suggestions, setSuggestions] = useState<Make[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const cachedMakes = useRef<Make[] | null>(null);

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(() => {
      if (cachedMakes.current) {
        filterSuggestions(inputValue);
      } else {
        fetchMakes();
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const fetchMakes = async () => {
    try {
      const res = await fetch(
        `https://car-specs.p.rapidapi.com/v2/cars/makes`,
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
  };

  function filterSuggestions(value: string) {
    const trimmed = value.toLowerCase().trim();
    if (!cachedMakes.current || !trimmed) return setSuggestions([]);

    const filtered = cachedMakes.current.filter((make) =>
      make.name.toLowerCase().includes(trimmed)
    );
    setSuggestions(filtered.slice(0, 8));
    setShowDropdown(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-5xl mx-auto bg-white dark:bg-brand text-textPrimary shadow-md rounded-xl px-4 py-4 flex flex-col sm:flex-row gap-3"
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
          className="w-full border px-3 py-2 rounded-md text-sm"
          autoCapitalize="off"
          autoCorrect="off"
        />
        <AnimatePresence>
          {showDropdown && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded shadow-md text-sm"
            >
              {suggestions.map((make) => (
                <li
                  key={make.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
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
        <button
          type="button"
          className="absolute top-1 right-1.5 w-9 h-9 flex items-center justify-center bg-textPrimary rounded-md text-white"
          disabled
        >
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
