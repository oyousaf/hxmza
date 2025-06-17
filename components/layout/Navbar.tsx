"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CubeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/80 backdrop-blur border-b border-gray-200 fixed top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-textPrimary font-bold text-lg"
        >
          <Image
            src="/logo.png"
            alt="Hxmza's Hub Logo"
            width={200}
            height={100}
            className="rounded-sm object-contain"
            priority
          />
        </Link>

        <div className="flex gap-6 items-center text-sm font-medium">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`hover:text-indigo-600 transition ${
                pathname === href ? "text-indigo-600" : "text-textPrimary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
