"use client"

import { ArrowUpMini } from "@medusajs/icons"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

const SHOW_AFTER_PX = 480

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER_PX)
        ticking = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ui-bg-base border border-ui-border-base text-ui-fg-subtle shadow-lg hover:text-clay-600 hover:border-clay-500 transition-colors"
        >
          <ArrowUpMini />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop
