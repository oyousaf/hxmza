"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { getInitialTheme, toggleTheme } from "@/lib/theme";

const socialLinks = [
  {
    href: "https://facebook.com/hxmzashub",
    label: "Facebook",
    icon: <FaFacebook className="h-6 w-6 sm:h-7 sm:w-7" />,
  },
  {
    href: "https://instagram.com/hxmzashub",
    label: "Instagram",
    icon: <FaInstagram className="h-6 w-6 sm:h-7 sm:w-7" />,
  },
  {
    href: "https://tiktok.com/@hxmzashub",
    label: "TikTok",
    icon: <FaTiktok className="h-6 w-6 sm:h-7 sm:w-7" />,
  },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const initial = getInitialTheme();
    setIsDark(initial === "dark");
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setIsDark(next === "dark");
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // The site is a single route, so Link's own navigation is a no-op when
    // already on "/" — scroll to top explicitly so the logo still acts as
    // a "back to top" control.
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel fixed top-0 z-50 w-full border-b border-textPrimary/10 px-3 py-2.5 dark:border-brand/10 sm:px-4"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        {/* Left: Logo */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex shrink-0 items-center justify-self-start"
          aria-label="Hxmza's Hub home"
        >
          <div className="w-27.5 sm:w-42">
            <Image
              src={isDark ? "/logoDark.png" : "/logoLight.png"}
              alt="Hxmza's Hub"
              width={168}
              height={22}
              priority
              className="h-auto w-full"
            />
          </div>
        </Link>

        {/* Center: Theme Toggle */}
        <button
          onClick={handleToggle}
          className="shrink-0 justify-self-center rounded-full p-1.5 transition-colors hover:bg-textPrimary/10 dark:hover:bg-brand/10 sm:p-2"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <SunIcon className="h-6 w-6 text-accent-light" />
          ) : (
            <MoonIcon className="h-6 w-6 text-textPrimary dark:text-brand" />
          )}
        </button>

        {/* Right: Social Icons */}
        <div className="flex shrink-0 items-center justify-self-end gap-0.5 sm:gap-1">
          {socialLinks.map(({ href, label, icon }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center justify-center rounded-full p-2 text-textPrimary transition-colors hover:bg-textPrimary/10 dark:text-brand dark:hover:bg-brand/10"
            >
              {icon}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
