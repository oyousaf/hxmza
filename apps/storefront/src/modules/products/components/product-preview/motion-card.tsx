"use client"

import { motion } from "motion/react"

export default function MotionCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4, transition: { duration: 0.35, ease: "easeOut" as const } }}
    >
      {children}
    </motion.div>
  )
}
