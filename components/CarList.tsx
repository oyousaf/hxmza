import { Car } from "@/types/car";
import CarCard from "./CarCard";
import Skeleton from "./layout/ui/Skeleton";
import { motion } from "framer-motion";

type Props = {
  cars: Car[];
  loading?: boolean;
  onCardClick?: (car: Car) => void;
};

export default function CarList({ cars, loading = false, onCardClick }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-white  py-12">
        <p className="text-lg font-semibold">🚫 No cars found.</p>
        <p className="text-sm mt-2">Try a different search or reset filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
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
