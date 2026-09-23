"use client";

export type SortValue =
  | "default"
  | "pricePerDay-asc"
  | "pricePerDay-desc"
  | "mileage-asc"
  | "mileage-desc"
  | "rating-desc"
  | "rating-asc";

type Props = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

const options: { value: SortValue; label: string }[] = [
  { value: "default", label: "Recommended" },
  { value: "pricePerDay-asc", label: "Price: Low to High" },
  { value: "pricePerDay-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Best Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
  { value: "mileage-asc", label: "Least Driven" },
  { value: "mileage-desc", label: "Most Driven" },
];

export default function SortDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortValue)}
      className="min-w-40 rounded-full border border-textPrimary/15 bg-white px-4 py-2 text-sm font-medium text-textPrimary shadow-sm transition hover:border-textPrimary/30 dark:border-brand/20 dark:bg-textPrimary dark:text-brand dark:hover:border-brand/40"
      aria-label="Sort cars"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
