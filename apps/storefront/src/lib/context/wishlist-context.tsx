"use client"

import { createContext, useContext, useEffect, useState } from "react"

type WishlistContextValue = {
  productIds: Set<string>
  loggedIn: boolean
  loaded: boolean
  toggle: (productId: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [productIds, setProductIds] = useState<Set<string>>(new Set())
  const [loggedIn, setLoggedIn] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        setProductIds(new Set(data.items.map((item: { product_id: string }) => item.product_id)))
        setLoggedIn(data.loggedIn)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const toggle = async (productId: string) => {
    if (!loggedIn) {
      window.location.href = "/account"
      return
    }

    const isSaved = productIds.has(productId)
    const next = new Set(productIds)

    if (isSaved) {
      next.delete(productId)
    } else {
      next.add(productId)
    }
    setProductIds(next)

    if (isSaved) {
      await fetch(`/api/wishlist/${productId}`, { method: "DELETE" })
    } else {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      })
    }
  }

  return (
    <WishlistContext.Provider value={{ productIds, loggedIn, loaded, toggle }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }

  return context
}
