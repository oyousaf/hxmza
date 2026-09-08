"use client"

import { createContext, useContext, useEffect, useState } from "react"

type WishlistContextValue = {
  productIds: Set<string>
  loggedIn: boolean
  loaded: boolean
  toggle: (productId: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

const WISHLIST_STORAGE_KEY = "b4u_wishlist_ids"

function readCachedIds(): Set<string> {
  if (typeof window === "undefined") {
    return new Set()
  }

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function writeCachedIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    // localStorage may be unavailable (private browsing) — hearts still work, just unhydrated on next load.
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [productIds, setProductIds] = useState<Set<string>>(readCachedIds)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        const ids = new Set<string>(
          data.items.map((item: { product_id: string }) => item.product_id)
        )
        setProductIds(ids)
        writeCachedIds(ids)
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
    writeCachedIds(next)

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
