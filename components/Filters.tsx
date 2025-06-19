"use client";

type Props = {
  fuel: string;
  year: string;
  transmission: string;
  onChange: (updates: {
    fuel?: string;
    year?: string;
    transmission?: string;
  }) => void;
};

const yearOptions = [2025, 2024, 2023, 2022, 2021, 2020];
const fuelOptions = ["Electric", "Petrol", "Diesel"];
const transmissionOptions = ["Automatic", "Manual"];

export default function Filters({ fuel, year, transmission, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={fuel}
        onChange={(e) => onChange({ fuel: e.target.value })}
        className="min-w-[140px] border px-3 py-2 rounded-md text-sm dark:bg-textPrimary dark:text-brand"
        aria-label="Filter by fuel type"
      >
        <option value="">Fuel</option>
        {fuelOptions.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => onChange({ year: e.target.value })}
        className="min-w-[100px] border px-3 py-2 rounded-md text-sm dark:bg-textPrimary dark:text-brand"
        aria-label="Filter by year"
      >
        <option value="">Year</option>
        {yearOptions.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        value={transmission}
        onChange={(e) => onChange({ transmission: e.target.value })}
        className="min-w-[140px] border px-3 py-2 rounded-md text-sm dark:bg-textPrimary dark:text-brand"
        aria-label="Filter by transmission"
      >
        <option value="">Transmission</option>
        {transmissionOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
