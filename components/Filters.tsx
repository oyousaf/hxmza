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

export default function Filters({ fuel, year, transmission, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={fuel}
        onChange={(e) => onChange({ fuel: e.target.value })}
        className="min-w-[140px] border px-3 py-2 rounded-md text-sm"
      >
        <option value="">Any Fuel</option>
        <option value="Electric">Electric</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
      </select>

      <select
        value={year}
        onChange={(e) => onChange({ year: e.target.value })}
        className="min-w-[100px] border px-3 py-2 rounded-md text-sm"
      >
        <option value="">All Years</option>
        {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        value={transmission}
        onChange={(e) => onChange({ transmission: e.target.value })}
        className="min-w-[140px] border px-3 py-2 rounded-md text-sm"
      >
        <option value="">Any Transmission</option>
        <option value="Automatic">Automatic</option>
        <option value="Manual">Manual</option>
      </select>
    </div>
  );
}
