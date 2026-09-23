import { NextResponse } from "next/server";
import { fetchCarSpecsApi } from "@/lib/server/rapidapi";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ trimId: string }> }
) {
  const { trimId } = await params;

  if (!/^\d+$/.test(trimId)) {
    return NextResponse.json({ error: "Invalid trimId" }, { status: 400 });
  }

  try {
    const spec = await fetchCarSpecsApi<unknown>(`/v2/cars/trims/${trimId}`);
    return NextResponse.json(spec);
  } catch (err) {
    console.error("Failed to fetch spec:", err);
    return NextResponse.json(
      { error: "Failed to fetch spec" },
      { status: 502 }
    );
  }
}
