import { retrieveCart } from "@lib/data/cart"
import { NextResponse } from "next/server"

export async function GET() {
  const cart = await retrieveCart()

  return NextResponse.json({ cart })
}
