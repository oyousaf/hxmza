import { NextResponse } from "next/server";
import { fetchCarSpecsApi } from "@/lib/server/rapidapi";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ modelId: string }> }
) {
  const { modelId } = await params;

  if (!/^\d+$/.test(modelId)) {
    return NextResponse.json({ error: "Invalid modelId" }, { status: 400 });
  }

  try {
    const generations = await fetchCarSpecsApi<unknown[]>(
      `/v2/cars/models/${modelId}/generations`
    );
    return NextResponse.json(generations);
  } catch (err) {
    console.error("Failed to fetch generations:", err);
    return NextResponse.json(
      { error: "Failed to fetch generations" },
      { status: 502 }
    );
  }
}
