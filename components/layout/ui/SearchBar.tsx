"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

type Props = {
  query: string;
  type: string;
  loading?: boolean;
  onChange: (updates: { query?: string; type?: string }) => void;
};

export default function SearchBar({
  query,
  type,
  loading = false,
  onChange,
}: Props) {
  return (
    <motion.form
      onSubmit={(e) => e.preventDefault()}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto bg-white dark:bg-brand text-textPrimary shadow-md rounded-xl px-4 py-4 flex flex-col sm:flex-row gap-3 flex-wrap justify-between"
    >
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => onChange({ query: e.target.value })}
        className="flex-1 min-w-[140px] border px-3 py-2 rounded-md text-sm"
      />

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
