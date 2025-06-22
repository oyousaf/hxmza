"use client";

type Props = {
  featured: boolean;
  onChange: (updates: { featured?: boolean }) => void;
};

export default function Toggles({ featured, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-4 mt-2">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="accent-brand"
          checked={featured}
          onChange={(e) => onChange({ featured: e.target.checked })}
        />
        <span>Featured</span>
      </label>
    </div>
  );
}
