import { NextResponse } from "next/server";
import { fetchCarSpecsApi } from "@/lib/server/rapidapi";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ makeId: string }> }
) {
  const { makeId } = await params;

  if (!/^\d+$/.test(makeId)) {
    return NextResponse.json({ error: "Invalid makeId" }, { status: 400 });
  }

  try {
    const models = await fetchCarSpecsApi<unknown[]>(
      `/v2/cars/makes/${makeId}/models`
    );
    return NextResponse.json(models);
  } catch (err) {
    console.error("Failed to fetch models:", err);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 502 }
    );
  }
}
