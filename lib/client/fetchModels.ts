// fetchModels.ts

const API_HOST = "car-specs.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;

const HEADERS = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": API_HOST,
};

// Raw API model structure
type RawModel = {
  modelId?: number | string;
  name?: string;
  yearFrom?: number | string;
  yearTo?: number | string | null;
};

// Cleaned and typed format for internal use
export interface ModelInput {
  id: number;
  name: string;
  yearFrom?: number;
  yearTo?: number | null;
}

const modelCache: Record<number, ModelInput[]> = {};

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
  throw new Error("Unexpected fetch failure");
}

export async function fetchModels(makeId: number): Promise<ModelInput[]> {
  if (modelCache[makeId]) return modelCache[makeId];

  const url = `https://${API_HOST}/v2/cars/makes/${makeId}/models`;
  const res = await fetchWithRetry<unknown[]>(url, { headers: HEADERS });

  if (!Array.isArray(res)) {
    console.warn("⚠️ Unexpected response format:", res);
    return [];
  }

  const models: ModelInput[] = res
    .filter((m): m is RawModel => typeof m === "object" && m !== null)
    .map((m, idx) => {
      const id = Number(m.modelId ?? idx);
      const name = typeof m.name === "string" ? m.name : `Model-${id}`;
      const yearFrom = m.yearFrom !== undefined ? Number(m.yearFrom) : undefined;
      const yearTo =
        m.yearTo !== undefined && m.yearTo !== null ? Number(m.yearTo) : null;

      return {
        id,
        name,
        yearFrom,
        yearTo,
      };
    });

  modelCache[makeId] = models;
  return models;
}
