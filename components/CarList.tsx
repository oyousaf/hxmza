"use client";

import { Car } from "@/types/car";
import CarCard from "./CarCard";
import Skeleton from "./layout/ui/Skeleton";
import { motion } from "motion/react";
import { PiCarProfileDuotone } from "react-icons/pi";

type Props = {
  cars: Car[];
  loading: boolean;
  onCardClick?: (car: Car) => void;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
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
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        aria-busy="true"
        aria-label="Loading cars"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center text-gray-500 dark:text-gray-300">
        <PiCarProfileDuotone className="h-12 w-12 opacity-60" aria-hidden="true" />
        <p className="text-lg font-semibold">No cars found</p>
        <p className="text-sm">Try a different search or reset your filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cars.map((car, index) => (
        <motion.div key={`${car.id}-${index}`} variants={itemVariants}>
          <CarCard
            car={car}
            onClick={() => onCardClick?.(car)}
            priority={index < 3}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
