"use client"

import { useWishlist } from "@lib/context/wishlist-context"

export default function WishlistHeart({ productId }: { productId: string }) {
  const { productIds, toggle } = useWishlist()
  const isSaved = productIds.has(productId)

  return (
    <button
      type="button"
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ui-bg-base/80 backdrop-blur text-stone-700 dark:text-stone-200 hover:text-rose-500 transition-colors"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        className={isSaved ? "text-rose-500" : ""}
      >
        <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.1 1.4 6.6 4.2 5A5.4 5.4 0 0 1 12 6.5 5.4 5.4 0 0 1 19.8 5c2.8 1.6 3.2 5.1 1.5 7.9C18.7 16.65 12 21 12 21Z" />
      </svg>
    </button>
  )
}
