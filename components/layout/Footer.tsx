"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full text-center py-6 mt-12 border-t border-gray-200 dark:border-gray-700 bg-brand dark:bg-textPrimary text-textPrimary dark:text-brand">
      <div className="text-sm mb-1">
        © {year} Hxmza's Hub. All rights reserved.
      </div>
      <div className="text-xs flex justify-center items-center gap-1">
        Built with{" "}
        <motion.span
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "linear",
          }}
          className="inline-block"
        >
          💚
        </motion.span>{" "}
        by Omar 🍉
      </div>
    </footer>
  );
}
