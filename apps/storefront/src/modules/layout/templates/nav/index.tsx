"use client"

import { scrollToTop } from "@lib/util/scroll-to-top"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import SideMenu from "@modules/layout/components/side-menu"
import ThemeToggle from "@modules/layout/components/theme-toggle"
import { usePathname } from "next/navigation"

export default function Nav() {
  const pathname = usePathname()

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Already home: there's no route change for Link to act on, so scroll
    // manually instead. Anywhere else, let Link navigate normally — the new
    // page mounts at the top on its own, and running our scroll animation
    // on the page being left behind would just race the navigation and
    // look like two animations fighting each other.
    if (pathname === "/") {
      e.preventDefault()
      scrollToTop()
    }
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-ui-bg-base border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2.5 hover:text-ui-fg-base"
              data-testid="nav-store-link"
              onClick={handleLogoClick}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-800 dark:bg-stone-100 font-serif text-sm font-semibold text-stone-100 dark:text-stone-900">
                B
              </span>
              <span className="font-serif text-xl tracking-tight">Beds4u</span>
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base flex items-center h-full"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <ThemeToggle />
            <CartDropdown />
          </div>
        </nav>
      </header>
    </div>
  )
}
