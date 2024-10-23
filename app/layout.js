import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Ace Motor Sales",
  description:
    "Explore a premium selection of certified, pre-owned vehicles, each thoroughly inspected to ensure top quality, reliability, and performance.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb">
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
