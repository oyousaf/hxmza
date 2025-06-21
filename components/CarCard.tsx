"use client";

import { Car } from "@/types/car";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaGasPump,
  FaCogs,
  FaTachometerAlt,
  FaUserFriends,
} from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { useState } from "react";

type Props = {
  car: Car;
  onClick: (car: Car) => void;
};

export default function CarCard({ car, onClick }: Props) {
  const [imgSrc, setImgSrc] = useState(car.image || "/cars/placeholder.webp");

  const format = (val: string | undefined): string =>
    val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "—";

  const mileageFormatted =
    car.mileage !== undefined
      ? `${new Intl.NumberFormat("en-UK").format(car.mileage)} mi`
      : "—";

  const priceFormatted =
    car.pricePerDay !== undefined
      ? `£${new Intl.NumberFormat("en-UK").format(car.pricePerDay)}`
      : "—";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={() => onClick(car)}
      className="cursor-pointer bg-white dark:bg-black/50 rounded-2xl shadow-md hover:shadow-lg overflow-hidden"
    >
      <div className="relative w-full h-48">
        <Image
          src={imgSrc}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={() => setImgSrc("/cars/placeholder.webp")}
        />
      </div>

      <div className="p-4 text-gray-700 dark:text-gray-200 space-y-3 text-sm">
        <h3 className="text-xl font-semibold text-textPrimary dark:text-white leading-tight">
          {format(car.make)} {format(car.model)}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm pt-2">
          <div className="flex items-center gap-2">
            <FaGasPump className="text-lg text-textPrimary dark:text-brand" />
            {format(car.fuel)}
          </div>
          <div className="flex items-center gap-2">
            <FaCogs className="text-lg text-textPrimary dark:text-brand" />
            {format(car.transmission)}
          </div>
          <div className="flex items-center gap-2">
            <GiSteeringWheel className="text-lg text-textPrimary dark:text-brand" />
            {format(car.type)}
          </div>
          <div className="flex items-center gap-2">
            <FaUserFriends className="text-lg text-textPrimary dark:text-brand" />
            {car.numberOfSeats ? `${car.numberOfSeats} seats` : "—"}
          </div>
          <div className="flex items-center gap-2">
            <FaTachometerAlt className="text-lg text-textPrimary dark:text-brand" />
            {mileageFormatted}
          </div>
        </div>

        <p className="mt-2 font-bold text-base sm:text-lg text-textPrimary dark:text-white">
          {priceFormatted} <span className="text-sm text-gray-500">/ day</span>
        </p>
      </div>
    </motion.div>
  );
}
