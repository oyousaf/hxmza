const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY!;
const cache = new Map<string, string>();

export async function fetchCarImage(make: string, model: string): Promise<string | null> {
  const query = `${make} ${model}`.trim().toLowerCase();

  // Use cached image if available
  if (cache.has(query)) {
    return cache.get(query)!;
  }

  try {
    const res = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const data = await res.json();
    const imageUrl = data?.results?.[0]?.urls?.regular || null;

    if (imageUrl) cache.set(query, imageUrl);
    return imageUrl;
  } catch (err) {
    console.error("❌ Unsplash fetch failed for:", query, err);
    return null;
  }
}
