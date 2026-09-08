"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { CART_UPDATED_EVENT } from "@lib/util/cart-events"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

type LayoutContext = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  shippingOptions: HttpTypes.StoreCartShippingOption[]
}

export default function LayoutBanners() {
  const [context, setContext] = useState<LayoutContext | null>(null)

  const fetchContext = async () => {
    const res = await fetch("/api/layout-context")
    setContext(await res.json())
  }

  useEffect(() => {
    fetchContext()
    window.addEventListener(CART_UPDATED_EVENT, fetchContext)
    return () => window.removeEventListener(CART_UPDATED_EVENT, fetchContext)
  }, [])

  if (!context?.cart) {
    return null
  }

  return (
    <>
      {context.customer && (
        <CartMismatchBanner customer={context.customer} cart={context.cart} />
      )}
      <FreeShippingPriceNudge
        variant="popup"
        cart={context.cart}
        shippingOptions={context.shippingOptions}
      />
    </>
  )
}
