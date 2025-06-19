"use client";

import { useRef, useEffect, useState, useMemo } from "react";
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

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CarList({
  cars,
  loading,
  sortBy = "",
  onCardClick,
}: Props) {
  const [itemsToShow, setItemsToShow] = useState(10);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setItemsToShow((prev) => prev + 6);
        }
      },
      { rootMargin: "300px" }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const visibleCars = useMemo(
    () => cars.slice(0, itemsToShow),
    [cars, itemsToShow]
  );

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
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {visibleCars.map((car) => (
          <motion.div key={car.id} variants={itemVariants}>
            <CarCard car={car} onClick={() => onCardClick?.(car)} />
          </motion.div>
        ))}
      </motion.div>

      {visibleCars.length < cars.length && (
        <div
          ref={sentinelRef}
          className="h-12 mt-6 flex justify-center items-center text-gray-400 text-sm"
        >
          Loading more cars...
        </div>
      )}
    </>
  );
}
