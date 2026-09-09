export const CART_UPDATED_EVENT = "cart-updated"

/**
 * Notify listeners (the basket badge/dropdown) that the basket changed.
 * Pass `delta` (e.g. +1 when adding, -2 when removing a qty-2 line) so the
 * badge can update instantly instead of waiting on a network round trip —
 * the listener still reconciles with the server shortly after.
 */
export function notifyCartUpdated(delta?: number) {
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: { delta } }))
}
