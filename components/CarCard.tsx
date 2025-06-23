"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Car } from "@/types/car";
import { fetchGenerations } from "@/lib/client/fetchGenerations";
import { fetchTrims } from "@/lib/client/fetchTrims";
import { trimCache } from "@/lib/cache/carCache";
import { FaRoad, FaStar } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import { PiCurrencyGbpBold } from "react-icons/pi";

type Props = {
  car: Car;
  onClick: (car: Car) => void;
};

const prefetched = new Set<number>();
let hoverTimeout: NodeJS.Timeout | null = null;

function prefetchOnHoverDebounced(modelId: number) {
  if (hoverTimeout) clearTimeout(hoverTimeout);

  hoverTimeout = setTimeout(() => {
    if (prefetched.has(modelId)) return;
    prefetched.add(modelId);

    fetchGenerations(modelId).then((generations) => {
      const firstGen = generations?.[0];
      if (firstGen && !trimCache.has(firstGen.id)) {
        fetchTrims(firstGen.id).then((trims) => {
          trimCache.set(firstGen.id, trims || []);
        });
      }
    });
  }, 700);
}

export default function CarCard({ car, onClick }: Props) {
  const [imgSrc, setImgSrc] = useState(car.image || "/cars/placeholder.webp");

  return (
    <motion.div
      onMouseEnter={() => prefetchOnHoverDebounced(car.modelId)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={() => onClick(car)}
      className="cursor-pointer bg-white dark:bg-black/50 rounded-2xl shadow-md hover:shadow-lg overflow-hidden"
    >
      {/* Image */}
      <div className="relative w-full h-48">
        <Image
          src={imgSrc}
          alt={car.model}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={() => setImgSrc("/cars/placeholder.webp")}
        />
      </div>

      {/* Info */}
      <div className="p-4 text-gray-700 dark:text-gray-200 space-y-3 text-sm">
        <h3 className="text-xl font-semibold text-textPrimary dark:text-white leading-tight">
          {car.model}
        </h3>

        <div className="flex items-center justify-between gap-2 text-xs font-medium">
          {/* Status */}
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <BsCheckCircleFill className="text-sm" />
            <span>Available</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1">
            <PiCurrencyGbpBold className="text-sm" />
            <span>{car.pricePerDay}/day</span>
          </div>

          {/* Mileage */}
          <div className="flex items-center gap-1">
            <FaRoad className="text-sm" />
            <span>{car.mileage.toLocaleString()} mi</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500 dark:text-yellow-400 text-sm" />
            <span>{car.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
