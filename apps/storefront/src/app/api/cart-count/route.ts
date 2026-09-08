import { retrieveCart } from "@lib/data/cart"
import { NextResponse } from "next/server"

export async function GET() {
  const cart = await retrieveCart(undefined, "items.quantity")
  const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return NextResponse.json({ count, subtotal: cart?.subtotal ?? 0 })
}
