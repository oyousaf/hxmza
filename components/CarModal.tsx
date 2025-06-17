"use client";

import { useEffect } from "react";
import { Car } from "@/types/car";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  car: Car | null;
  onClose: () => void;
};

export default function CarModal({ car, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (car) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [car]);

  if (!car) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto w-full max-w-2xl p-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={car.image}
            alt={`${car.make} ${car.model}`}
            className="w-full h-56 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-bold mb-2">
            {car.make} {car.model}
          </h2>
          <p className="text-sm text-gray-600 mb-1">Year: {car.year}</p>
          <p className="text-sm text-gray-600 mb-1">Fuel: {car.fuelType}</p>
          <p className="text-sm text-gray-600 mb-1">
            Transmission: {car.transmission}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Price: £{car.pricePerDay} / day
          </p>

          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
