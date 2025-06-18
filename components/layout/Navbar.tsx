"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { getInitialTheme, toggleTheme } from "@/lib/theme";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setIsDark(initial === "dark");
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setIsDark(next === "dark");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 z-50 w-full px-4 py-3 border-b border-gray-200 dark:border-textPrimary bg-brand dark:bg-textPrimary shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="block dark:hidden">
            <Image
              src="/logoLight.png"
              alt="Logo Light"
              width={180}
              height={24}
              priority
            />
          </div>
          <div className="hidden dark:block">
            <Image
              src="/logoDark.png"
              alt="Logo Dark"
              width={180}
              height={24}
              priority
            />
          </div>
        </Link>

        {/* Center: Theme Toggle */}
        <button
          onClick={handleToggle}
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-violet-950 transition"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-textPrimary dark:text-brand" />
          )}
        </button>

        {/* Right: Social Icons with bouncy motion.div */}
        <div className="flex items-center gap-4">
          {[
            {
              href: "https://facebook.com/hxmzashub",
              label: "Facebook",
              icon: <FaFacebook className="w-7 h-7" />,
            },
            {
              href: "https://instagram.com/hxmzashub",
              label: "Instagram",
              icon: <FaInstagram className="w-7 h-7" />,
            },
            {
              href: "https://tiktok.com/hxmzashub",
              label: "TikTok",
              icon: <FaTiktok className="w-7 h-7" />,
            },
          ].map(({ href, label, icon }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-textPrimary dark:text-brand cursor-pointer"
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:opacity-90 transition"
              >
                {icon}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
