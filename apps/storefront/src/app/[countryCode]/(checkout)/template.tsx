"use client"

import { motion } from "motion/react"

// Mirrors the (main) route group's template — remounts on each checkout
// step navigation so content fades/slides in instead of snapping.
export default function CheckoutTemplate({
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
