import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { WishlistProvider } from "@lib/context/wishlist-context"
import ScrollToTop from "@modules/layout/components/scroll-to-top"
import "styles/globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WishlistProvider>
            <main className="relative">{props.children}</main>
            <ScrollToTop />
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
