"use client";

import { Car } from "@/types/car";
import CarCard from "./CarCard";
import Skeleton from "./layout/ui/Skeleton";
import { motion } from "framer-motion";

type Props = {
  cars: Car[];
  loading: boolean;
  sortBy?: string;
  onCardClick?: (car: Car) => void;
};

const sortCars = (cars: Car[], sortBy: string): Car[] => {
  const sorted = [...cars];
  switch (sortBy) {
    case "pricePerDay-asc":
      return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
    case "pricePerDay-desc":
      return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
    case "year-desc":
      return sorted.sort((a, b) => b.year - a.year);
    case "year-asc":
      return sorted.sort((a, b) => a.year - b.year);
    case "engine-desc":
      return sorted.sort((a, b) => (b.engine || 0) - (a.engine || 0));
    case "engine-asc":
      return sorted.sort((a, b) => (a.engine || 0) - (b.engine || 0));
    case "mileage-desc":
      return sorted.sort((a, b) => (b.mileage || 0) - (a.mileage || 0));
    case "mileage-asc":
      return sorted.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
    case "rating-desc":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "rating-asc":
      return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    default:
      return cars;
  }
};

export default function CarList({
  cars,
  loading,
  sortBy = "",
  onCardClick,
}: Props) {
  const sorted = sortCars(cars, sortBy);
  const visibleCars = sorted.slice(0, 10);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (!visibleCars.length) {
    return (
      <div className="text-center text-gray-500 dark:text-white py-12">
        <p className="text-lg font-semibold">🚫 No cars found.</p>
        <p className="text-sm mt-2">Try a different search or reset filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {visibleCars.map((car) => (
        <motion.div
          key={car.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CarCard car={car} onClick={() => onCardClick?.(car)} />
        </motion.div>
      ))}
    </div>
  );
}
