import { Car } from "@/types/car";
import { mapApiCarToInternalCar } from "@/lib/utils";

export const API_HOST = "car-specs.p.rapidapi.com";
export const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;
export const HEADERS = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": API_HOST,
};

// Utility: delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  backoff = 500
): Promise<any> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, options);

    if (res.status === 429) {
      // Rate limit hit, retry with backoff
      if (attempt === retries) {
        throw new Error("Rate limit exceeded, no retries left");
      }
      await delay(backoff * (attempt + 1));
      continue;
    }

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status} for ${url}`);
    }

    return res.json();
  }
  throw new Error("Unexpected fetchWithRetry exit");
}

/**
 * Fetch list of makes once.
 */
export async function fetchMakes(): Promise<{ id: number; name: string }[]> {
  try {
    const data = await fetchWithRetry(`https://${API_HOST}/v2/cars/makes`, {
      headers: HEADERS,
    });

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error("❌ fetchMakes error:", error);
    return [];
  }
}

/**
 * Fetch models by make ID (no pagination here for simplicity)
 */
export async function fetchModels(
  makeId: number
): Promise<
  Array<{
    id: number;
    name: string;
    yearFrom?: number;
    yearTo?: number;
  }>
> {
  try {
    const data = await fetchWithRetry(
      `https://${API_HOST}/v2/cars/makes/${makeId}/models`,
      {
        headers: HEADERS,
      }
    );
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error(`❌ fetchModels error for makeId ${makeId}:`, error);
    return [];
  }
}

/**
 * Optional: Fetch generations for a model ID.
 * Call this from CarModal when needed, to reduce upfront calls.
 */
export async function fetchGenerations(
  modelId: number
): Promise<any[]> {
  try {
    const data = await fetchWithRetry(
      `https://${API_HOST}/v2/cars/models/${modelId}/generations`,
      { headers: HEADERS }
    );
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error(`❌ fetchGenerations error for modelId ${modelId}:`, error);
    return [];
  }
}

/**
 * Optional: Fetch trims for a generation ID.
 * Call from CarModal when needed.
 */
export async function fetchTrims(
  generationId: number
): Promise<any[]> {
  try {
    const data = await fetchWithRetry(
      `https://${API_HOST}/v2/cars/generations/${generationId}/trims`,
      { headers: HEADERS }
    );
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error(`❌ fetchTrims error for generationId ${generationId}:`, error);
    return [];
  }
}

/**
 * Optional: Fetch full specs for a trim ID.
 * Call from CarModal when needed.
 */
export async function fetchSpecs(trimId: number): Promise<any | null> {
  try {
    const data = await fetchWithRetry(
      `https://${API_HOST}/v2/cars/trims/${trimId}`,
      { headers: HEADERS }
    );
    if (typeof data === "object") return data;
    return null;
  } catch (error) {
    console.error(`❌ fetchSpecs error for trimId ${trimId}:`, error);
    return null;
  }
}
