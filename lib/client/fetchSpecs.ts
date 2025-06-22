const API_HOST = "car-specs.p.rapidapi.com";
const HEADERS = {
  "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
  "X-RapidAPI-Host": API_HOST,
};

export async function fetchSpecs(trimId: number): Promise<any | null> {
  try {
    const res = await fetch(`https://${API_HOST}/v2/cars/trims/${trimId}`, {
      headers: HEADERS,
    });

    if (!res.ok) {
      console.error(`❌ API error for trim ${trimId}: ${res.status}`);
      return null;
    }

    const data = await res.json();

    if (data && typeof data === "object" && !Array.isArray(data)) {
      return data;
    }

    console.warn(`⚠️ Unexpected format in specs response for trim ${trimId}`, data);
    return null;
  } catch (error) {
    console.error("❌ Failed to fetch specs:", error);
    return null;
  }
}
