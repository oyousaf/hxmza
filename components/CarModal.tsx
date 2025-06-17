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
    ({
      down,
      movement: [, my],
      velocity: [, vy],
      direction: [, dy],
      cancel,
    }) => {
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
          className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ y }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Image */}
          <img
            src={car.image}
            alt={`${car.make} ${car.model}`}
            className="w-full h-56 object-cover rounded-xl mb-4"
          />

          {/* Title & Info */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              {car.make} {car.model}{" "}
              <span className="text-gray-500">({car.year})</span>
            </h2>
            <div className="flex items-center text-sm text-gray-500 mt-1 gap-4 flex-wrap">
              {car.location && (
                <span className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" /> {car.location}
                </span>
              )}
              {car.rating && (
                <span className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4" /> {car.rating}/5
                </span>
              )}
              {car.availability && (
                <span className="font-semibold text-green-600">
                  {car.availability}
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-xl font-semibold text-textPrimary mb-4">
            £{car.pricePerDay} <span className="text-sm font-normal">/day</span>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
            <div>
              <strong>Fuel:</strong> {car.fuel}
            </div>
            <div>
              <strong>Transmission:</strong> {car.transmission}
            </div>
            <div>
              <strong>Mileage:</strong> {car.mileage ?? "–"}
            </div>
            <div>
              <strong>Seats:</strong> {car.seats ?? "–"}
            </div>
            <div>
              <strong>Color:</strong> {car.color ?? "–"}
            </div>
            <div>
              <strong>Engine:</strong> {car.engine ?? "–"}
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {car.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
