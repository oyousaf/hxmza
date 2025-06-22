const API_HOST = "car-specs.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;

const HEADERS = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": API_HOST,
};

// ✅ Raw model type returned by the API
type RawModel = {
  id?: number | string;
  modelId?: number | string;
  name?: string; // <- this is what the API returns (not "model")
  make?: string;
  yearFrom?: number | string;
  yearTo?: number | string | null;
};

// ✅ Clean, internal model type used in app
export type CarModel = {
  id: number;
  modelId: number;
  model: string; // <- for display
  make: string;
  yearFrom?: number;
  yearTo?: number | null;
};

// ✅ In-memory cache
const modelCache: Record<number, CarModel[]> = {};

// ✅ Rate-limit-aware fetch with retry
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
    return res.json();
  }
  throw new Error("Unexpected failure in fetchWithRetry");
}

// ✅ Main function to fetch + sanitize models
export async function fetchModels(makeId: number): Promise<CarModel[]> {
  if (modelCache[makeId]) return modelCache[makeId];

  const url = `https://${API_HOST}/v2/cars/makes/${makeId}/models`;
  const res = await fetchWithRetry<unknown[]>(url, { headers: HEADERS });

  if (!Array.isArray(res)) {
    console.warn("⚠️ Unexpected model format:", res);
    return [];
  }

  const models: CarModel[] = res
    .filter((m): m is RawModel => typeof m === "object" && m !== null)
    .map((m, idx) => {
      const id = Number(m.id ?? idx);
      const modelId = Number(m.modelId ?? id);
      const model = typeof m.name === "string" ? m.name : `Model ${idx}`;
      const make =
        typeof m.make === "string" && m.make.trim() !== "" ? m.make : "";

      return {
        id,
        modelId,
        model,
        make,
      };
    });

  modelCache[makeId] = models;
  return models;
}
