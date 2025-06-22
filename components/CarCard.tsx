"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Car } from "@/types/car";
import { fetchGenerations } from "@/lib/client/fetchGenerations";
import { fetchTrims } from "@/lib/client/fetchTrims";
import { fetchSpecs } from "@/lib/client/fetchSpecs";
import { trimCache, specCache } from "@/lib/cache/carCache";

type Props = {
  car: Car;
  onClick: (car: Car) => void;
};

const prefetched = new Set<number>();

async function prefetchOnHover(modelId: number) {
  if (prefetched.has(modelId)) return;
  prefetched.add(modelId);

  try {
    const generations = await fetchGenerations(modelId);
    const firstGen = generations?.[0];
    if (!firstGen) return;

    if (!trimCache.has(firstGen.id)) {
      const trims = await fetchTrims(firstGen.id);
      trimCache.set(firstGen.id, trims || []);

      const firstTrim = trims?.[0];
      if (firstTrim && !specCache.has(firstTrim.id)) {
        const spec = await fetchSpecs(firstTrim.id);
        if (spec) {
          specCache.set(firstTrim.id, spec);
        }
      }
    }
  } catch (err) {
    console.error("❌ Prefetch failed:", err);
  }
}

export default function CarCard({ car, onClick }: Props) {
  const [imgSrc, setImgSrc] = useState(car.image || "/cars/placeholder.webp");

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

        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          {car.year}
        </p>

        <p className="text-sm mt-1 italic text-gray-400">
          Tap to view trims & specs →
        </p>
      </div>
    </motion.div>
  );
}
