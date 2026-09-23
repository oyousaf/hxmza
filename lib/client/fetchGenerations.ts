type ApiGeneration = {
  id: number | string;
  name: string;
  yearFrom: number;
  yearTo?: number | null;
};

type Generation = {
  id: number;
  name: string;
  yearFrom: number;
  yearTo: number | null;
};

export async function fetchGenerations(modelId: number): Promise<Generation[]> {
  const res = await fetch(`/api/generations/${modelId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching generations`);

  const data: ApiGeneration[] = await res.json();

  return data.map((g): Generation => ({
    id: Number(g.id),
    name: g.name,
    yearFrom: g.yearFrom,
    yearTo: g.yearTo ?? null,
  }));
}
