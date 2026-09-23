import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "motion/react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d1cbc1" },
    { media: "(prefers-color-scheme: dark)", color: "#330066" },
  ],
};

export const metadata: Metadata = {
  title: "Hxmza's Hub | Car Rentals",
  description:
    "Modern, responsive car rental platform to rent supercars, EVs, and more.",
  metadataBase: new URL("https://hxmza.uk"),
  openGraph: {
    title: "Hxmza's Hub – Car Rentals",
    description:
      "Modern, responsive car rental platform to rent supercars, EVs, and more.",
    url: "https://hxmza.uk",
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
    description:
      "Modern, responsive car rental platform to rent supercars, EVs, and more.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-gb" suppressHydrationWarning>
      <head>
        {/* ✅ Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Hxmza's Hub",
                  url: "https://hxmza.uk/",
                },
                {
                  "@type": "CarRental",
                  name: "Hxmza's Hub",
                  url: "https://hxmza.uk",
                  logo: "https://hxmza.uk/logoLight.png",
                  image: "https://hxmza.uk/og-image.png",
                  description:
                    "Find and rent premium cars across the UK including electric and luxury vehicles.",
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "GB",
                  },
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ],
                      opens: "10:00",
                      closes: "18:00",
                    },
                  ],
                  sameAs: [
                    "https://facebook.com/hxmzashub",
                    "https://instagram.com/hxmzashub",
                    "https://tiktok.com/@hxmzashub",
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${manrope.className} pt-15 text-textPrimary bg-brand dark:bg-textPrimary dark:text-brand`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <MotionConfig reducedMotion="user">
          <Navbar />
          <main>
            {children}
            <Analytics />
          </main>
          <Footer />
        </MotionConfig>
      </body>
    </html>
  );
}
