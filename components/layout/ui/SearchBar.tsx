"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

type Props = {
  onSearch: (query: string, type: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, type);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl mx-auto bg-white shadow-md rounded-xl px-4 py-3 flex flex-col sm:flex-row gap-3 items-stretch"
    >
      <div className="flex items-center gap-2 flex-1">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search make or model..."
          className="w-full bg-transparent outline-none text-textPrimary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="bg-white border text-sm text-textPrimary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <option value="">All Types</option>
        <option value="sedan">Sedan</option>
        <option value="suv">SUV</option>
        <option value="electric">Electric</option>
        <option value="convertible">Convertible</option>
      </select>

      <motion.button
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="bg-textPrimary/70 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-textPrimary transition"
      >
        Search
      </motion.button>
    </motion.form>
  );
}
