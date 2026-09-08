import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { NextResponse } from "next/server"

export async function GET() {
  const [cart, customer] = await Promise.all([
    retrieveCart(),
    retrieveCustomer(),
  ])

  const shippingOptions = cart
    ? (await listCartOptions()).shipping_options
    : []

  return NextResponse.json({ cart, customer, shippingOptions })
}
