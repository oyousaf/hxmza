import { NextResponse } from "next/server";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const make = searchParams.get("make") ?? "";
  const model = searchParams.get("model") ?? "";
  const baseQuery = `${make} ${model}`.trim();

  if (!baseQuery) {
    return NextResponse.json({ error: "Missing make/model" }, { status: 400 });
  }

  // Bias search toward the vehicle rather than an unrelated same-named subject
  // (e.g. "Aston Martin Cygnet" alone can match photos of the bird).
  const query = `${baseQuery} car`;

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.error("UNSPLASH_ACCESS_KEY is not configured on the server");
    return NextResponse.json({ url: null });
  }

  try {
    const res = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(
        query
      )}&per_page=1&orientation=landscape`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ url: null });
    }

    const data = await res.json();
    const url: string | null = data?.results?.[0]?.urls?.regular ?? null;

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Failed to fetch car image:", err);
    return NextResponse.json({ url: null });
  }
}
