import "@/styles/globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Hxmza's Hub | Car Rentals UK",
  description:
    "Modern, responsive car rental platform to rent supercars, EVs, and more.",
  metadataBase: new URL("https://hxmza.uk"),
  openGraph: {
    title: "Hxmza's Hub – Car Rentals UK",
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
    title: "Hxmza's Hub – Car Rentals UK",
    description:
      "Modern, responsive car rental platform to rent supercars, EVs, and more.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-gb" suppressHydrationWarning>
      <head>
        {/* ✅ Font Preload */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap"
          as="style"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap"
          />
        </noscript>

        {/* ✅ Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
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
            }),
          }}
        />

        {/* ✅ Meta keywords manually added */}
        <meta
          name="keywords"
          content="Car rentals UK, Luxury car hire, Electric car rental, Affordable car hire, Supercar rental UK, Hxmza's Hub, Rent a car online UK, Vehicle hire service, Car rental app"
        />
      </head>
      <body className="pt-[60px] font-sans text-textPrimary bg-brand dark:bg-textPrimary dark:text-brand">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
