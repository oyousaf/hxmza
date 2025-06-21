"use client";

import { Car } from "@/types/car";
import CarCard from "./CarCard";
import { motion } from "framer-motion";
import { SiAstonmartin } from "react-icons/si";

type Props = {
  cars: Car[];
  loading: boolean;
  onCardClick?: (car: Car) => void;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CarList({ cars, loading, onCardClick }: Props) {
  if (loading) {
    return (
      <div
        className="flex justify-center items-center py-20"
        aria-busy="true"
        aria-label="Loading cars"
      >
        <SiAstonmartin className="w-24 h-24 text-textPrimary dark:text-brand animate-spin" />
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="text-center text-gray-500 dark:text-white py-12">
        <p className="text-lg font-semibold">🚫 No cars found.</p>
        <p className="text-sm mt-2">Try a different search or reset filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cars.map((car, index) => (
        <motion.div key={`${car.id}-${index}`} variants={itemVariants}>
          <CarCard car={car} onClick={() => onCardClick?.(car)} />
        </motion.div>
      ))}
    </motion.div>
  );
}
