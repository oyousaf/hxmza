"use client";

type Props = {
  fuel: string;
  transmission: string;
  onChange: (updates: { fuel?: string; transmission?: string }) => void;
};

const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid"];
const transmissionOptions = ["Automatic", "Manual"];

export default function Filters({ fuel, transmission, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
      <select
        value={fuel}
        onChange={(e) => onChange({ fuel: e.target.value.toLowerCase() })}
        className="min-w-[140px] border px-3 py-2 rounded-md text-sm dark:bg-textPrimary dark:text-brand"
        aria-label="Filter by fuel"
      >
        <option value="">Fuel</option>
        {fuelOptions.map((f) => (
          <option key={f} value={f.toLowerCase()}>
            {f}
          </option>
        ))}
      </select>

      <select
        value={transmission}
        onChange={(e) =>
          onChange({ transmission: e.target.value.toLowerCase() })
        }
        className="min-w-[140px] border px-3 py-2 rounded-md text-sm dark:bg-textPrimary dark:text-brand"
        aria-label="Filter by transmission"
      >
        <option value="">Transmission</option>
        {transmissionOptions.map((t) => (
          <option key={t} value={t.toLowerCase()}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
