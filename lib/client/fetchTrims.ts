export type Trim = {
  id: number;
  trim: string;
  bodyType: string;
};

export async function fetchTrims(generationId: number): Promise<Trim[]> {
  const res = await fetch(
    `https://car-specs.p.rapidapi.com/v2/cars/generations/${generationId}/trims`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "car-specs.p.rapidapi.com",
      },
    }
  );

  if (!res.ok) {
    console.error("❌ Failed to fetch trims:", res.statusText);
    return [];
  }

  const data = await res.json();

  return (data || []).map((item: any) => ({
    id: Number(item.id),
    trim: item.trim || item.name || "Unknown Trim",
    bodyType: item.bodyType || item.series || "Unknown",
  }));
}
