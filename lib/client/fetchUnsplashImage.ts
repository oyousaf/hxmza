const cache = new Map<string, string>();

export async function fetchCarImage(make: string, model: string): Promise<string | null> {
  const query = `${make} ${model}`.trim().toLowerCase();
  if (!query) return null;

  if (cache.has(query)) {
    return cache.get(query)!;
  }

  try {
    const res = await fetch(
      `/api/car-image?make=${encodeURIComponent(make)}&model=${encodeURIComponent(
        model
      )}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    const imageUrl: string | null = data?.url ?? null;

    if (imageUrl) cache.set(query, imageUrl);
    return imageUrl;
  } catch (err) {
    console.error("❌ Car image fetch failed for:", query, err);
    return null;
  }
}
