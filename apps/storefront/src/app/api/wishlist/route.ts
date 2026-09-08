import { addToWishlist, retrieveWishlist } from "@lib/data/wishlist"
import { getAuthHeaders } from "@lib/data/cookies"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const headers = await getAuthHeaders()
  const loggedIn = "authorization" in headers
  const items = loggedIn ? await retrieveWishlist() : []

  return NextResponse.json({ items, loggedIn })
}

export async function POST(req: NextRequest) {
  const { product_id } = await req.json()

  if (!product_id) {
    return NextResponse.json({ message: "product_id is required" }, { status: 400 })
  }

  const success = await addToWishlist(product_id)

  return NextResponse.json({ success })
}
