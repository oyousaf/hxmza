"use client"

import { useState } from "react"
import { filterCars, mockCars } from "@/lib/api"
import CarList from "@/components/CarList"
import SearchBar from "@/components/layout/ui/SearchBar"
import { motion } from "framer-motion"
import type { Car } from "@/types/car"

export default function HomePage() {
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars)

  return (
    <main className="min-h-screen flex flex-col gap-8 px-4 py-12 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold"
      >
        Find your next ride
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <SearchBar
          onSearch={(query, type) => {
            const results = filterCars(query, type)
            setFilteredCars(results)
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <CarList cars={filteredCars} />
      </motion.div>
    </main>
  )
}
