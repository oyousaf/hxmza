"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SortDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border px-3 py-2 rounded-md text-sm dark:bg-textPrimary dark:text-white"
      aria-label="Sort cars"
    >
      <option value="pricePerDay-asc">Cheapest</option>
      <option value="pricePerDay-desc">Most Expensive</option>
      <option value="year-desc">Newest</option>
      <option value="year-asc">Oldest</option>
      <option value="displacement-desc">Biggest Engine</option>
      <option value="displacement-asc">Smallest Engine</option>
      <option value="mileage-desc">Most Driven</option>
      <option value="mileage-asc">Least Driven</option>
      <option value="rating-desc">Best Rated</option>
      <option value="rating-asc">Lowest Rated</option>
    </select>
  );
}
