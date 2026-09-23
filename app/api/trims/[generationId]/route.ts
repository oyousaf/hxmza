import { NextResponse } from "next/server";
import { fetchCarSpecsApi } from "@/lib/server/rapidapi";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ generationId: string }> }
) {
  const { generationId } = await params;

  if (!/^\d+$/.test(generationId)) {
    return NextResponse.json(
      { error: "Invalid generationId" },
      { status: 400 }
    );
  }

  try {
    const trims = await fetchCarSpecsApi<unknown[]>(
      `/v2/cars/generations/${generationId}/trims`
    );
    return NextResponse.json(trims);
  } catch (err) {
    console.error("Failed to fetch trims:", err);
    return NextResponse.json(
      { error: "Failed to fetch trims" },
      { status: 502 }
    );
  }
}
