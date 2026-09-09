"use client"

import { motion } from "motion/react"

// Runs on every navigation within this route group (unlike layout.tsx, which
// persists) — gives page content a quick fade/slide instead of snapping in.
// Kept to opacity/transform only so it's GPU-composited and cheap.
export default function MainTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
