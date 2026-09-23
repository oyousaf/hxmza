"use client";

import { FaStar } from "react-icons/fa";

type Props = {
  featured: boolean;
  onChange: (updates: { featured?: boolean }) => void;
};

export default function Toggles({ featured, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={featured}
      onClick={() => onChange({ featured: !featured })}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition ${
        featured
          ? "border-textPrimary bg-textPrimary text-white dark:border-brand dark:bg-brand dark:text-textPrimary"
          : "border-textPrimary/15 bg-white text-textPrimary hover:border-textPrimary/30 dark:border-brand/20 dark:bg-textPrimary dark:text-brand dark:hover:border-brand/40"
      }`}
    >
      <FaStar
        className={featured ? "text-yellow-300" : "text-yellow-500"}
        aria-hidden="true"
      />
      Featured only
    </button>
  );
}
