"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

type Props = {
  onSearch: (query: string, type: string, fuel: string, year: string) => void;
  loading?: boolean;
};

export default function SearchBar({ onSearch, loading = false }: Props) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query, type, fuel, year);
    }, 300);

    return () => clearTimeout(debounce);
  }, [type, fuel, year]); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, type, fuel, year);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto bg-white shadow-md rounded-xl px-4 py-4 flex flex-col sm:flex-row gap-3 flex-wrap justify-between"
    >
      <input
        type="text"
        placeholder="Make or model"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 min-w-[140px] border px-3 py-2 rounded-md text-sm"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="min-w-[140px] border px-3 py-2 rounded-md text-sm"
      >
        <option value="">All Types</option>
        <option value="electric">Electric</option>
        <option value="supercar">Supercar</option>
      </select>

      <select
        value={fuel}
        onChange={(e) => setFuel(e.target.value)}
        className="min-w-[140px] border px-3 py-2 rounded-md text-sm"
      >
        <option value="">Any Fuel</option>
        <option value="Electric">Electric</option>
        <option value="Hybrid">Hybrid</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
      </select>

      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="min-w-[100px] border px-3 py-2 rounded-md text-sm"
      >
        <option value="">All Years</option>
        <option value="2025">2025</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </select>

      <button
        type="submit"
        className="flex items-center justify-center w-10 h-10 rounded-md bg-textPrimary text-white hover:bg-textPrimary/90 transition"
        aria-label="Search"
      >
        {loading ? (
          <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
        ) : (
          <MagnifyingGlassIcon className="h-5 w-5 text-white" />
        )}
      </button>
    </motion.form>
  );
}
