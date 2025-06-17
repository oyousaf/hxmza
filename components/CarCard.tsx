"use client";

import { Car } from "@/types/car";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  car: Car;
  onClick: (car: Car) => void;
};

export default function CarCard({ car, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer bg-white dark:bg-black/50 rounded-xl shadow hover:shadow-md overflow-hidden"
      onClick={() => onClick(car)}
    >
      <div className="relative w-full h-40">
        <Image
          src={car.image}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {car.make} {car.model}
        </h3>
        <p className="text-sm text-gray-500">{car.year}</p>
        <p className="mt-2 font-bold">£{car.pricePerDay} / day</p>
      </div>
    </motion.div>
  );
}
