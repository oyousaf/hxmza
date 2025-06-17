"use client";

type Props = {
  featured: boolean;
  available: boolean;
  onChange: (updates: { featured?: boolean; available?: boolean }) => void;
};

export default function Toggles({ featured, available, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-4 mt-2">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => onChange({ featured: e.target.checked })}
        />
        Featured
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => onChange({ available: e.target.checked })}
        />
        Available only
      </label>
    </div>
  );
}
