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
      className="border px-3 py-2 rounded-md text-sm dark:bg-gray-800 dark:text-white"
    >
      <option value="">Sort by</option>
      <option value="pricePerDay-asc">Cheapest</option>
      <option value="pricePerDay-desc">Priciest</option>
      <option value="year-desc">Newest</option>
      <option value="year-asc">Oldest</option>
      <option value="engine-desc">Engine ↑</option>
      <option value="engine-asc">Engine ↓</option>
      <option value="mileage-desc">Mileage ↑</option>
      <option value="mileage-asc">Mileage ↓</option>
      <option value="rating-desc">Rating ↑</option>
      <option value="rating-asc">Rating ↓</option>
    </select>
  );
}
