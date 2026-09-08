"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"
import { revalidateTag } from "next/cache"

export type WishlistItem = {
  id: string
  customer_id: string
  product_id: string
}

export async function retrieveWishlist(): Promise<WishlistItem[]> {
  const headers = await getAuthHeaders()

  if (!("authorization" in headers)) {
    return []
  }

  const next = await getCacheOptions("wishlist")

  return sdk.client
    .fetch<{ wishlist_items: WishlistItem[] }>("/store/customers/me/wishlist", {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ wishlist_items }) => wishlist_items)
    .catch(() => [])
}

export async function addToWishlist(productId: string): Promise<boolean> {
  const headers = await getAuthHeaders()

  if (!("authorization" in headers)) {
    return false
  }

  return sdk.client
    .fetch("/store/customers/me/wishlist", {
      method: "POST",
      headers,
      body: { product_id: productId },
    })
    .then(async () => {
      revalidateTag(await getCacheTag("wishlist"))
      return true
    })
    .catch(() => false)
}

export async function removeFromWishlist(productId: string): Promise<boolean> {
  const headers = await getAuthHeaders()

  if (!("authorization" in headers)) {
    return false
  }

  return sdk.client
    .fetch(`/store/customers/me/wishlist/${productId}`, {
      method: "DELETE",
      headers,
    })
    .then(async () => {
      revalidateTag(await getCacheTag("wishlist"))
      return true
    })
    .catch(() => false)
}
