const API_HOST = "car-specs.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;

const HEADERS = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": API_HOST,
};

export type CarModel = {
  id: number;
  make: string;
  model: string;
  modelId: number;
  yearFrom?: number;
  yearTo?: number | null;
  [key: string]: unknown;
};

type RawModel = {
  id?: number | string;
  make?: string;
  model?: string;
  modelId?: number | string;
  yearFrom?: number | string;
  yearTo?: number | string | null;
  [key: string]: unknown;
};

const modelCache: Record<number, CarModel[]> = {};

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

export async function fetchModels(makeId: number): Promise<CarModel[]> {
  if (modelCache[makeId]) return modelCache[makeId];

  const url = `https://${API_HOST}/v2/cars/makes/${makeId}/models`;
  const res = await fetchWithRetry<RawModel[]>(url, { headers: HEADERS });

  const models: CarModel[] = Array.isArray(res)
    ? res.map((m, idx) => ({
        id: Number(m.id ?? idx),
        make: String(m.make ?? "Unknown"),
        model: String(m.model ?? "Model"),
        modelId: Number(m.modelId ?? idx),
        yearFrom: m.yearFrom !== undefined ? Number(m.yearFrom) : undefined,
        yearTo:
          m.yearTo !== undefined && m.yearTo !== null ? Number(m.yearTo) : null,
      }))
    : [];

  if (!models.length) console.warn("⚠️ Unexpected model data:", res);

  modelCache[makeId] = models;
  return models;
}
