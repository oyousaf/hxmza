const API_HOST = "car-specs.p.rapidapi.com";

function getHeaders() {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY is not configured on the server");
  }
  return {
    "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": API_HOST,
  };
}

export async function fetchCarSpecsApi<T>(
  path: string,
  { revalidate = 3600, retries = 3, backoff = 500 } = {}
): Promise<T> {
  const url = `https://${API_HOST}${path}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate },
    });

    if (res.status === 429) {
      if (attempt === retries) throw new Error("Rate limit exceeded");
      await new Promise((r) => setTimeout(r, backoff * (attempt + 1)));
      continue;
    }

    if (!res.ok) {
      throw new Error(`Car Specs API error ${res.status} for ${path}`);
    }

    return res.json();
  }

  throw new Error("Unexpected failure calling Car Specs API");
}
