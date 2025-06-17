"use client";

import { Car } from "@/types/car";
import CarCard from "./CarCard";
import Skeleton from "./layout/ui/Skeleton";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Sorting logic
const sortCars = (cars: Car[], sortBy: string): Car[] => {
  switch (sortBy) {
    case "pricePerDay-asc":
      return [...cars].sort((a, b) => a.pricePerDay - b.pricePerDay);
    case "pricePerDay-desc":
      return [...cars].sort((a, b) => b.pricePerDay - a.pricePerDay);
    case "year-desc":
      return [...cars].sort((a, b) => b.year - a.year);
    case "year-asc":
      return [...cars].sort((a, b) => a.year - b.year);
    case "engineSize-desc":
      return [...cars].sort((a, b) => (b.engine || 0) - (a.engine || 0));
    case "engineSize-asc":
      return [...cars].sort((a, b) => (a.engine || 0) - (b.engine || 0));
    case "mileage-desc":
      return [...cars].sort((a, b) => (b.mileage || 0) - (a.mileage || 0));
    case "mileage-asc":
      return [...cars].sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
    case "rating-desc":
      return [...cars].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "rating-asc":
      return [...cars].sort((a, b) => (a.rating || 0) - (b.rating || 0));
    default:
      return cars;
  }
};

type Props = {
  cars: Car[];
  loading?: boolean;
  onCardClick?: (car: Car) => void;
  sortBy?: string;
};

export default function CarList({
  cars,
  loading = false,
  onCardClick,
  sortBy = "",
}: Props) {
  const [visibleCars, setVisibleCars] = useState<Car[]>([]);
  const [itemsToShow, setItemsToShow] = useState(6);

  useEffect(() => {
    const sorted = sortCars(cars, sortBy);
    setVisibleCars(sorted.slice(0, itemsToShow));
  }, [cars, sortBy, itemsToShow]);

  const loadMore = () => {
    setItemsToShow((prev) => prev + 6);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (visibleCars.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-white py-12">
        <p className="text-lg font-semibold">🚫 No cars found.</p>
        <p className="text-sm mt-2">Try a different search or reset filters.</p>
      </div>
    );
  }

  return (
    <>
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

      {visibleCars.length < cars.length && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            className="px-4 py-2 text-sm font-medium bg-textPrimary text-white rounded hover:bg-opacity-90 transition"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}
