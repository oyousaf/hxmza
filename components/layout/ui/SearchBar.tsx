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
};

const DEBOUNCE_DELAY = 400;

export default function SearchBar({
  query,
  type,
  loading = false,
  onChange,
  onMakeSelect,
}: Props) {
  const [inputValue, setInputValue] = useState(query);
  const [suggestions, setSuggestions] = useState<Make[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const cachedMakes = useRef<Make[] | null>(null);

  useEffect(() => {
    // If cached, filter locally immediately
    if (cachedMakes.current) {
      filterSuggestions(inputValue);
      return;
    }

    // Fetch makes once
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

    // Debounced fetch/filter
    const timeout = setTimeout(() => {
      if (inputValue.trim()) {
        fetchMakes();
      } else {
        setSuggestions([]);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  function filterSuggestions(value: string) {
    if (!cachedMakes.current) return;
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return setSuggestions([]);
    const filtered = cachedMakes.current.filter((make) =>
      make.name.toLowerCase().includes(trimmed)
    );
    setSuggestions(filtered.slice(0, 10));
    setShowDropdown(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-5xl mx-auto bg-white dark:bg-brand text-textPrimary shadow-md rounded-xl px-4 py-4 flex flex-col sm:flex-row gap-3 flex-wrap justify-between"
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search makes…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
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
      </div>

      <select
        value={type}
        onChange={(e) => onChange({ type: e.target.value })}
        className="min-w-[140px] border px-3 py-2 rounded-md text-sm"
      >
        <option value="">All Types</option>
        <option value="electric">Electric</option>
        <option value="supercar">Supercar</option>
      </select>

      <button
        type="button"
        className="flex items-center justify-center w-10 h-10 rounded-md bg-textPrimary text-white hover:bg-textPrimary/90 transition"
        aria-label="Search"
        disabled
      >
        {loading ? (
          <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
        ) : (
          <MagnifyingGlassIcon className="h-5 w-5 text-white" />
        )}
      </button>
    </motion.div>
  );
}
