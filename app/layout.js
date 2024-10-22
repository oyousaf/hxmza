import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Head from "next/head";

export const metadata = {
  title: "Ace Motor Sales",
  description:
    "Explore a premium selection of certified, pre-owned vehicles, each thoroughly inspected to ensure top quality, reliability, and performance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <body className="min-h-screen bg-black/90">
        <main className="max-w-7xl mx-auto relative">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
