import { NextResponse } from "next/server";
import { fetchCarSpecsApi } from "@/lib/server/rapidapi";

export async function GET() {
  try {
    const makes = await fetchCarSpecsApi<unknown[]>("/v2/cars/makes", {
      revalidate: 86400,
    });
    return NextResponse.json(makes);
  } catch (err) {
    console.error("Failed to fetch makes:", err);
    return NextResponse.json(
      { error: "Failed to fetch makes" },
      { status: 502 }
    );
  }
}
