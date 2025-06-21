const API_HOST = "car-specs.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;

const HEADERS = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": API_HOST,
};

const modelCache: Record<number, any[]> = {};

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  backoff = 500
): Promise<any> {
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

export async function fetchModels(makeId: number): Promise<any[]> {
  if (modelCache[makeId]) return modelCache[makeId];

  const url = `https://${API_HOST}/v2/cars/makes/${makeId}/models`;
  const res = await fetchWithRetry(url, { headers: HEADERS });

  if (Array.isArray(res)) {
    modelCache[makeId] = res;
    return res;
  }

  console.warn("⚠️ Unexpected format:", res);
  return [];
}
