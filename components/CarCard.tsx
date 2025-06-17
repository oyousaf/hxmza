"use client";

import { motion } from "framer-motion";
import { Car } from "@/types/car";

type Props = {
  car: Car;
};

export default function CarCard({ car }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition"
    >
      <img
        src={car.image}
        alt={`${car.make} ${car.model}`}
        onError={(e) => (e.currentTarget.src = "/placeholder.webp")}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-textPrimary">
          {car.make} {car.model}
        </h3>
        <p className="text-sm text-gray-500">
          {car.year} · {car.fuelType}
        </p>
        <p className="text-sm text-gray-500">
          {car.transmission} · {car.seats} seats
        </p>

        <div className="mt-2 text-right font-bold text-green-600">
          £{car.pricePerDay}/day
        </div>
      </div>
    </motion.div>
  );
}
