const API_HOST = "car-specs.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;

const HEADERS = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": API_HOST,
};

// Define the expected shape of each model object from the API
export type CarModel = {
  id: number;
  make: string;
  model: string;
  modelId: number;
  yearFrom?: number;
  yearTo?: number | null;
  [key: string]: unknown;
};

const modelCache: Record<number, CarModel[]> = {};

// Generic fetcher with retries for rate limiting (429)
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retries = 3,
  backoff = 500
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      if (attempt === retries) throw new Error("Rate limit exceeded");
      await new Promise((r) => setTimeout(r, backoff * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json() as Promise<T>;
  }
  throw new Error("Unexpected failure in fetchWithRetry");
}

// Fetch car models for a given make ID
export async function fetchModels(makeId: number): Promise<CarModel[]> {
  if (modelCache[makeId]) return modelCache[makeId];

  const url = `https://${API_HOST}/v2/cars/makes/${makeId}/models`;
  const res = await fetchWithRetry<unknown[]>(url, { headers: HEADERS });

  // Validate and transform only if the response is an array of objects
  const models: CarModel[] = Array.isArray(res)
    ? res.map((m, idx) => ({
        id: Number((m as any).id ?? idx),
        make: String((m as any).make ?? "Unknown"),
        model: String((m as any).model ?? "Model"),
        modelId: Number((m as any).modelId ?? idx),
        ...(typeof m === "object" && m !== null ? m : {}),
      }))
    : [];

  if (!models.length) console.warn("⚠️ Unexpected model data:", res);

  modelCache[makeId] = models;
  return models;
}
