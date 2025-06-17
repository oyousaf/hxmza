"use client";

import { motion } from "framer-motion";
import CarCard from "@/components/CarCard";
import type { Car } from "@/types/car";

// Mock car data (replace with real fetched cars later)
const sampleCars: Car[] = [
  { id: "1", make: "Toyota", model: "Corolla", year: 2020, image: "/car1.jpg" },
  { id: "2", make: "Tesla", model: "Model 3", year: 2022, image: "/car2.jpg" },
  { id: "3", make: "BMW", model: "3 Series", year: 2019, image: "/car3.jpg" },
];

export default function CarList() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6"
    >
      {sampleCars.map((car) => (
        <motion.div
          key={car.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <CarCard car={car} />
        </motion.div>
      ))}
    </motion.div>
  );
}
