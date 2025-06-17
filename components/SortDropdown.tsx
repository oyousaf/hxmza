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
      <option value="pricePerDay-asc">Price (Low → High)</option>
      <option value="pricePerDay-desc">Price (High → Low)</option>
      <option value="year-desc">Year (Newest → Oldest)</option>
      <option value="year-asc">Year (Oldest → Newest)</option>
      <option value="engineSize-desc">Engine Size (High → Low)</option>
      <option value="engineSize-asc">Engine Size (Low → High)</option>
      <option value="mileage-desc">Mileage (High → Low)</option>
      <option value="mileage-asc">Mileage (Low → High)</option>
      <option value="rating-desc">Rating (High → Low)</option>
      <option value="rating-asc">Rating (Low → High)</option>
    </select>
  );
}
