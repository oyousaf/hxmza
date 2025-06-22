import { mapTrimToSpec, TrimSpec } from "../mappers/mapTrimToSpec";

const API_HOST = "car-specs.p.rapidapi.com";
const HEADERS = {
  "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
  "X-RapidAPI-Host": API_HOST,
};

export async function fetchSpecs(trimId: number): Promise<TrimSpec | null> {
  try {
    const res = await fetch(`https://${API_HOST}/v2/cars/trims/${trimId}`, {
      headers: HEADERS,
    });

    if (!res.ok) {
      console.error(`❌ API error for trim ${trimId}: ${res.status}`);
      return null;
    }

    const raw = await res.json();
    const mapped = mapTrimToSpec(raw);

    return mapped;
  } catch (err) {
    console.error("❌ Failed to fetch specs:", err);
    return null;
  }
}
