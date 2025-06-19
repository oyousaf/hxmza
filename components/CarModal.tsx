"use client";

import { useEffect, useRef } from "react";
import { Car } from "@/types/car";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { XMarkIcon, MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import { useDrag } from "@use-gesture/react";
import Image from "next/image";

type Props = {
  car: Car | null;
  onClose: () => void;
};

export default function CarModal({ car, onClose }: Props) {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0, 100], [0, 1, 0]);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = car ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [car]);

  useDrag(
    ({ down, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
      y.set(my);
      if (!down && (Math.abs(my) > 120 || (vy > 0.5 && dy > 0))) {
        onClose();
      }
      if (!down) y.set(0);
    },
    {
      target: modalRef,
      axis: "y",
      filterTaps: true,
      pointer: { touch: true },
    }
  );

  if (!car) return null;

  const capitalise = (val?: string) =>
    val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "–";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ opacity }}
      >
        <motion.div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white dark:bg-textPrimary w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ y }}
        >
          {/* Image */}
          <div className="relative w-full h-56 sm:h-64 rounded-t-2xl overflow-hidden">
            <Image
              src={car.image}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
              priority
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white dark:bg-black/60 backdrop-blur-md p-2 rounded-full text-gray-500 hover:text-black dark:hover:text-white transition"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Details */}
          <div className="p-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <h2 className="text-2xl font-bold">
                {car.make} {car.model}{" "}
                <span className="text-gray-500 dark:text-white">
                  ({car.year})
                </span>
              </h2>

              <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-white mt-2 gap-4">
                {car.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {car.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4" />
                  {car.rating.toFixed(1)} / 5
                </span>
                <span className="text-green-600 font-semibold">
                  {capitalise(car.status)}
                </span>
              </div>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xl font-semibold text-textPrimary dark:text-white mb-6"
            >
              £{car.pricePerDay}{" "}
              <span className="text-sm font-normal text-gray-500 dark:text-white">
                / day
              </span>
            </motion.div>

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-white mb-6"
            >
              <div>
                <strong>Fuel:</strong> {capitalise(car.fuel)}
              </div>
              <div>
                <strong>Transmission:</strong> {car.transmission}
              </div>
              <div>
                <strong>Mileage:</strong>{" "}
                {car.mileage
                  ? `${new Intl.NumberFormat("en-UK").format(car.mileage)} mi`
                  : "–"}
              </div>
              <div>
                <strong>Seats:</strong> {car.seats}
              </div>
              <div>
                <strong>Colour:</strong> {capitalise(car.color)}
              </div>
              <div>
                <strong>Displacement:</strong>{" "}
                {car.displacement ? `${car.displacement} cc` : "–"}
              </div>
            </motion.div>

            {/* Features */}
            {Array.isArray(car.features) && car.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-white">
                  {car.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
