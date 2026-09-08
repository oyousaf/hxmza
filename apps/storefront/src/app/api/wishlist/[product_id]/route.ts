import { removeFromWishlist } from "@lib/data/wishlist"
import { NextResponse } from "next/server"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ product_id: string }> }
) {
  const { product_id } = await params
  const success = await removeFromWishlist(product_id)

  return NextResponse.json({ success })
}
