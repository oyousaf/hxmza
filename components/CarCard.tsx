"use client";

import { Car } from "@/types/car";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaGasPump,
  FaCogs,
  FaTachometerAlt,
  FaUserFriends,
  FaHorseHead,
} from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { useState } from "react";
import { fetchGenerations } from "@/lib/client/fetchGenerations";
import { fetchTrims } from "@/lib/client/fetchTrims";
import { trimCache } from "@/lib/cache/carCache";

type Props = {
  car: Car;
  onClick: (car: Car) => void;
};

const prefetched = new Set<number>();

function prefetchOnHover(modelId: number) {
  if (prefetched.has(modelId)) return;
  prefetched.add(modelId);

  fetchGenerations(modelId).then((gens) => {
    const firstGen = gens?.[0];
    if (firstGen && !trimCache.has(firstGen.id)) {
      fetchTrims(firstGen.id).then((trims) => {
        trimCache.set(firstGen.id, trims);
      });
    }
  });
}

export default function CarCard({ car, onClick }: Props) {
  const [imgSrc, setImgSrc] = useState(car.image || "/cars/placeholder.webp");

  const format = (val: string | undefined): string =>
    val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "—";

  const formatFuel = (val: string): string => {
    const v = val.toLowerCase();
    if (v.includes("gasoline") || v.includes("petrol")) return "Petrol";
    if (v.includes("diesel")) return "Diesel";
    if (v.includes("hybrid")) return "Hybrid";
    if (v.includes("electric")) return "Electric";
    return format(val);
  };

  const formatEngineSize = (cc: string): string => {
    const parsed = parseInt(cc, 10);
    return isNaN(parsed) ? "—" : `${(parsed / 1000).toFixed(1)}L`;
  };

  const formatTransmission = (trans: string): string => {
    const t = trans.toLowerCase();
    if (t.includes("auto") || t.includes("cvt")) return "Automatic";
    if (t.includes("manual")) return "Manual";
    return format(trans);
  };

  return (
    <motion.div
      onMouseEnter={() => prefetchOnHover(car.modelId)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={() => onClick(car)}
      className="cursor-pointer bg-white dark:bg-black/50 rounded-2xl shadow-md hover:shadow-lg overflow-hidden"
    >
      {/* Image */}
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

      {/* Info */}
      <div className="p-4 text-gray-700 dark:text-gray-200 space-y-3 text-sm">
        <h3 className="text-xl font-semibold text-textPrimary dark:text-white leading-tight">
          {format(car.make)} {format(car.model)}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm pt-2">
          <div className="flex items-center gap-2">
            <FaGasPump className="text-lg text-textPrimary dark:text-brand" />
            {formatFuel(car.fuel)}
          </div>
          <div className="flex items-center gap-2">
            <FaCogs className="text-lg text-textPrimary dark:text-brand" />
            {formatTransmission(car.transmission)}
          </div>
          <div className="flex items-center gap-2">
            <GiSteeringWheel className="text-lg text-textPrimary dark:text-brand" />
            {format(car.bodyType)}
          </div>
          <div className="flex items-center gap-2">
            <FaUserFriends className="text-lg text-textPrimary dark:text-brand" />
            {car.numberOfSeats ? `${car.numberOfSeats} seats` : "—"}
          </div>
          <div className="flex items-center gap-2">
            <FaTachometerAlt className="text-lg text-textPrimary dark:text-brand" />
            {car.engine ? formatEngineSize(car.engine) : "—"}
          </div>
          <div className="flex items-center gap-2">
            <FaHorseHead className="text-lg text-textPrimary dark:text-brand" />
            {car.engineHp ? `${car.engineHp} BHP` : "—"}
          </div>
        </div>

        <p className="mt-2 font-bold text-base sm:text-lg text-textPrimary dark:text-white">
          {car.pricePerDay
            ? `£${new Intl.NumberFormat("en-UK").format(car.pricePerDay)}`
            : "—"}{" "}
          <span className="text-sm text-gray-500">/ day</span>
        </p>
      </div>
    </motion.div>
  );
}
