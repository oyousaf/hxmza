import { mapTrimToSpec, TrimSpec } from "../mappers/mapTrimToSpec";

export async function fetchSpecs(trimId: number): Promise<TrimSpec | null> {
  try {
    const res = await fetch(`/api/specs/${trimId}`);

    if (!res.ok) {
      console.error(`❌ API error for trim ${trimId}: ${res.status}`);
      return null;
    }

    const raw = await res.json();
    return mapTrimToSpec(raw);
  } catch (err) {
    console.error("❌ Failed to fetch specs:", err);
    return null;
  }
}
