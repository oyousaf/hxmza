import { Navbar, Footer } from "@/components";
import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "Hxmza's Hub",
  description: "A car rental app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
