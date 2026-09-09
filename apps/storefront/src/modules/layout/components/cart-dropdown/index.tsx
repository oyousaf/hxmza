"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { CART_UPDATED_EVENT } from "@lib/util/cart-events"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"

const CART_COUNT_STORAGE_KEY = "b4u_cart_count"

function readCachedCount() {
  if (typeof window === "undefined") {
    return 0
  }

  try {
    return Number(window.localStorage.getItem(CART_COUNT_STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

const CartDropdown = () => {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [count, setCount] = useState(readCachedCount)
  const [hiddenItemIds, setHiddenItemIds] = useState<Set<string>>(new Set())
  const [isCartLoading, setIsCartLoading] = useState(false)
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const fetchCount = useCallback(async () => {
    const res = await fetch("/api/cart-count")
    const data = await res.json()
    const nextCount = data.count ?? 0
    setCount(nextCount)
    try {
      window.localStorage.setItem(CART_COUNT_STORAGE_KEY, String(nextCount))
    } catch {
      // localStorage may be unavailable (private browsing) — badge still works, just unhydrated on next load.
    }
  }, [])

  const fetchFullCart = async () => {
    setIsCartLoading(true)
    try {
      const res = await fetch("/api/cart")
      const data = await res.json()
      setCart(data.cart ?? null)
      setHiddenItemIds(new Set())
    } finally {
      setIsCartLoading(false)
    }
  }

  const handleCartUpdated = useCallback(
    (e: Event) => {
      const delta = (e as CustomEvent<{ delta?: number }>).detail?.delta

      if (typeof delta === "number") {
        // Apply instantly so the badge never waits on a round trip. If the
        // dropdown's own item list is currently loaded, totalItems is derived
        // from it (see below) and already reflects optimistic add/remove
        // locally — this just keeps the badge correct for changes made
        // elsewhere on the page (e.g. "Add to basket" on a product card).
        setCount((current) => {
          const next = Math.max(0, current + delta)
          try {
            window.localStorage.setItem(CART_COUNT_STORAGE_KEY, String(next))
          } catch {
            // localStorage may be unavailable (private browsing).
          }
          return next
        })
      }

      // Reconcile with the server shortly after, in case the optimistic
      // delta didn't match what actually happened (e.g. a failed request).
      fetchCount()
    },
    [fetchCount]
  )

  useEffect(() => {
    fetchCount()
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated)
    return () => window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated)
  }, [fetchCount, handleCartUpdated])

  const open = () => {
    setCartDropdownOpen(true)
    fetchFullCart()
  }
  const close = () => setCartDropdownOpen(false)

  const visibleItems = cart?.items?.filter((item) => !hiddenItemIds.has(item.id))

  const totalItems = visibleItems
    ? visibleItems.reduce((acc, item) => acc + item.quantity, 0)
    : count

  const subtotal = cart?.subtotal ?? 0
  const itemRef = useRef<number>(count)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open basket dropdown when modifying the basket items, but only if we're not on the basket page
  useEffect(() => {
    if (itemRef.current !== count && !pathname.includes("/cart")) {
      timedOpen()
    }
    itemRef.current = count
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="hover:text-ui-fg-base flex items-center h-full"
            href="/cart"
            data-testid="nav-cart-link"
          >{`Basket (${totalItems})`}</LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-ui-bg-base border-x border-b border-gray-200 w-[420px] text-ui-fg-base"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Basket</h3>
            </div>
            {isCartLoading ? (
              <div className="px-4 pb-4 grid grid-cols-1 gap-y-8 animate-pulse">
                {[0, 1].map((i) => (
                  <div className="grid grid-cols-[122px_1fr] gap-x-4" key={i}>
                    <div className="w-24 aspect-square rounded-large bg-ui-bg-subtle" />
                    <div className="flex flex-col gap-y-2 py-1">
                      <div className="h-3 w-3/4 rounded bg-ui-bg-subtle" />
                      <div className="h-3 w-1/2 rounded bg-ui-bg-subtle" />
                      <div className="h-3 w-1/3 rounded bg-ui-bg-subtle" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cart && visibleItems?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {visibleItems
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-24"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                >
                                  Quantity: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-end">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cart.currency_code}
                                />
                              </div>
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            quantity={item.quantity}
                            onRemoved={() =>
                              setHiddenItemIds((prev) => new Set(prev).add(item.id))
                            }
                            onRestore={() =>
                              setHiddenItemIds((prev) => {
                                const next = new Set(prev)
                                next.delete(item.id)
                                return next
                              })
                            }
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                  <div className="flex items-center justify-between">
                    <span className="text-ui-fg-base font-semibold">
                      Subtotal{" "}
                      <span className="font-normal">(excl. taxes)</span>
                    </span>
                    <span
                      className="text-large-semi"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cart.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      className="w-full"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      Go to basket
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                  <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                    <span>0</span>
                  </div>
                  <span>Your basket is empty.</span>
                  <div>
                    <LocalizedClientLink href="/store">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button onClick={close}>Explore products</Button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
