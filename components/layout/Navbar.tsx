"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import Image from "next/image";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
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
        <div className="flex items-center gap-2">
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
        </div>

        {/* Center: Theme Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-textPrimary dark:text-brand" />
            )}
          </button>
        </div>

        {/* Right: Socials */}
        <div className="flex items-center gap-4">
          <a
            href="https://facebook.com/hxmzashub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook className="w-5 h-5 text-textPrimary dark:text-brand hover:opacity-80 transition" />
          </a>
          <a
            href="https://instagram.com/hxmzashub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="w-5 h-5 text-textPrimary dark:text-brand hover:opacity-80 transition" />
          </a>
          <a
            href="https://tiktok.com/hxmzashub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok className="w-5 h-5 text-textPrimary dark:text-brand hover:opacity-80 transition" />
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
