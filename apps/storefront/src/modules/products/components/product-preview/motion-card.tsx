"use client"

import { motion } from "motion/react"

export default function MotionCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
    >
      {children}
    </motion.div>
  )
}
