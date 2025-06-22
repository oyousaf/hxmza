export async function fetchGenerations(modelId: number): Promise<any[]> {
  const res = await fetch(
    `https://car-specs.p.rapidapi.com/v2/cars/models/${modelId}/generations`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "car-specs.p.rapidapi.com",
      },
    }
  );

  const data = await res.json();

  const generations = data.map((g: any) => ({
    id: Number(g.id),
    name: g.name,
    yearFrom: g.yearFrom,
    yearTo: g.yearTo ?? null,
  }));

  return generations;
}
