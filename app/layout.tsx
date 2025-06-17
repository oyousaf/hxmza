import "@/styles/globals.css"
import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"

export const metadata: Metadata = {
  title: "Hxmza's Hub | Car Rentals",
  description: "Find and rent cars easily",
  metadataBase: new URL("https://hxmza.uk"),
  openGraph: {
    title: "Hxmza's Hub – Car Rentals",
    description: "Modern, responsive car rental app built with Next.js",
    url: "/",
    siteName: "Hxmza's Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hxmza's Hub Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hxmza's Hub – Car Rentals",
    description: "Built with Next.js, Tailwind, and Framer Motion",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: "#D1CBC1",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  other: {
    "google-font": "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-gb">
      <body className="pt-[60px] font-sans text-textPrimary bg-brand">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
