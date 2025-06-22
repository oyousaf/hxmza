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
  const res = await fetch(
    `https://car-specs.p.rapidapi.com/v2/cars/models/${modelId}/generations`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "car-specs.p.rapidapi.com",
      },
    }
  );

  const data: ApiGeneration[] = await res.json();

  return data.map((g): Generation => ({
    id: Number(g.id),
    name: g.name,
    yearFrom: g.yearFrom,
    yearTo: g.yearTo ?? null,
  }));
}
