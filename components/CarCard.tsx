"use client";

import { useState } from "react";
import { motion } from "motion/react";
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
  priority?: boolean;
};

const prefetched = new Set<number>();
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

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

export default function CarCard({ car, onClick, priority = false }: Props) {
  const [imgSrc, setImgSrc] = useState(car.image || "/cars/placeholder.webp");

  return (
    <motion.button
      type="button"
      onMouseEnter={() => prefetchOnHoverDebounced(car.modelId)}
      onFocus={() => prefetchOnHoverDebounced(car.modelId)}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => onClick(car)}
      className="group relative w-full cursor-pointer overflow-hidden rounded-3xl bg-textPrimary text-left shadow-md transition-shadow hover:shadow-2xl hover:shadow-textPrimary/20"
      aria-label={`View details for ${car.make} ${car.model}`}
    >
      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={car.model}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={() => setImgSrc("/cars/placeholder.webp")}
        />

        {/* Gradient scrim so overlaid text stays legible on any photo */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />

        {/* Top row: featured + rating */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          {car.featured ? (
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              Featured
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <FaStar className="text-yellow-400" aria-hidden="true" />
            {car.rating.toFixed(1)}
          </span>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-4 text-white">
          <h3 className="truncate text-xl font-bold leading-tight drop-shadow-sm">
            {car.model}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-white/90">
            <span className="flex items-center gap-1 text-green-400">
              <BsCheckCircleFill className="text-sm" aria-hidden="true" />
              Available
            </span>
            <span className="flex items-center gap-1">
              <FaRoad className="text-sm" aria-hidden="true" />
              {car.mileage.toLocaleString("en-GB")} mi
            </span>
          </div>
        </div>
      </div>

      {/* Price bar */}
      <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black/50">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Per day
        </span>
        <span className="flex items-center gap-1 text-lg font-bold text-textPrimary dark:text-white">
          <PiCurrencyGbpBold aria-hidden="true" />
          {car.pricePerDay.toLocaleString("en-GB")}
        </span>
      </div>
    </motion.button>
  );
}
