"use client";

import { Car } from "@/types/car";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  car: Car;
  onClick: (car: Car) => void;
};

export default function CarCard({ car, onClick }: Props) {
  const capitalise = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

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
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold">
          {car.make} {car.model}
        </h3>
        <p className="text-sm text-gray-500">{car.year}</p>
        <p className="text-sm text-gray-500">
          {car.mileage
            ? `${new Intl.NumberFormat("en-UK").format(car.mileage)} mi`
            : "–"}{" "}
          · {capitalise(car.transmission)}
        </p>
        <p className="text-sm text-gray-500">{capitalise(car.fuel)}</p>
        <p className="mt-1 font-bold text-textPrimary dark:text-white">
          £{new Intl.NumberFormat("en-UK").format(car.pricePerDay)} / day
        </p>
      </div>
    </motion.div>
  );
}
