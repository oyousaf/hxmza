const API_HOST = "car-specs.p.rapidapi.com";
const HEADERS = {
  "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
  "X-RapidAPI-Host": API_HOST,
};

export async function fetchGenerations(modelId: number): Promise<any[]> {
  const res = await fetch(`https://${API_HOST}/v2/cars/models/${modelId}/generations`, {
    headers: HEADERS,
  });
  const json = await res.json();
  return json?.data ?? [];
}