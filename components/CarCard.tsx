"use client";

import { Car } from "@/types/car";
import { motion } from "framer-motion";

type Props = {
  car: Car;
  onClick: (car: Car) => void;
};

export default function CarCard({ car, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md overflow-hidden"
      onClick={() => onClick(car)}
    >
      <img
        src={car.image}
        alt={`${car.make} ${car.model}`}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{car.make} {car.model}</h3>
        <p className="text-sm text-gray-500">{car.year}</p>
        <p className="mt-2 font-bold">£{car.pricePerDay} / day</p>
      </div>
    </motion.div>
  );
}
