"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@/components/ui/button"

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16 } },
}

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const item = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" as const } } }

  return (
    <section className="bg-[#e9e6e1] dark:bg-stone-900 border-b border-stone-300 dark:border-stone-700">
      <div className="content-container grid lg:grid-cols-2 items-center gap-10 py-14 lg:py-24">
        <motion.div
          className="max-w-xl"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={item} className="text-xs uppercase tracking-[0.25em] text-stone-600 dark:text-stone-400 mb-6">
            Beds4u — fresh from the factory floor
          </motion.p>
          <motion.h1 variants={item} className="font-serif text-5xl lg:text-7xl tracking-tight leading-[1.05] text-stone-800 dark:text-stone-100">
            Well built.<br /><span className="text-stone-500 dark:text-stone-400">Well rested.</span>
          </motion.h1>
          <motion.p variants={item} className="mt-6 mb-8 text-lg leading-relaxed text-stone-600 dark:text-stone-300 max-w-md">
            &ldquo;Sleep,&rdquo; wrote Shakespeare, &ldquo;knits up the ravell&rsquo;d sleeve of care.&rdquo; Ours gives it somewhere comfortable to happen: generous Ottoman storage, upholstery built to wear well, and oak that only grows more handsome with age.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Button asChild>
              <LocalizedClientLink href="/store">Explore our range <span aria-hidden>→</span></LocalizedClientLink>
            </Button>
            <Button asChild variant="outline">
              <LocalizedClientLink href="/collections/traditional-oak">Traditional oak</LocalizedClientLink>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="relative"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" as const }}
        >
          <Image
            width={900}
            height={700}
            priority
            src="/beds/hero.jpg"
            alt="A calm, softly lit bedroom furnished with an upholstered bed"
            className="w-full rounded-t-[120px] object-cover aspect-[9/7]"
          />
        </motion.div>
      </div>
      <div className="content-container grid sm:grid-cols-3 gap-5 py-6 border-t border-stone-300 dark:border-stone-700 text-sm text-stone-700 dark:text-stone-300">
        <p>01 — Choose your size and finish</p>
        <p>02 — Pick the collection that suits your room</p>
        <p>03 — Arrange delivery at checkout</p>
      </div>
    </section>
  )
}
