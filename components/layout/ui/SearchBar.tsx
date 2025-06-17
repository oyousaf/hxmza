"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  return (
    <motion.form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query);
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex w-full max-w-xl bg-white shadow-md rounded-lg items-center px-4 py-2 gap-2"
    >
      <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search make or model..."
        className="w-full outline-none bg-transparent text-textPrimary"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <motion.button
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        Search
      </motion.button>
    </motion.form>
  );
}
