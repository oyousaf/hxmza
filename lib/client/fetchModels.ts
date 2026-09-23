// ✅ Raw model type returned by the API
type RawModel = {
  id?: number | string;
  modelId?: number | string;
  name?: string;
  make?: string;
  yearFrom?: number;
  yearTo?: number;
};

// ✅ Clean, internal model type used in app
export type CarModel = {
  id: number;
  modelId: number;
  model: string;
  make: string;
  yearFrom?: number;
  yearTo?: number;
};

// ✅ In-memory cache
const modelCache: Record<number, CarModel[]> = {};

// ✅ Main function to fetch + sanitize models
export async function fetchModels(makeId: number): Promise<CarModel[]> {
  if (modelCache[makeId]) return modelCache[makeId];

  const res = await fetch(`/api/models/${makeId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching models`);

  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    console.warn("⚠️ Unexpected model format:", data);
    return [];
  }

  const models: CarModel[] = data
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
