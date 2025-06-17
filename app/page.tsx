"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/layout/ui/SearchBar";
import CarList from "@/components/CarList";
import { filterCars } from "@/lib/api";
import { Car } from "@/types/car";
import CarModal from "@/components/CarModal";

export default function HomePage() {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const openCarModal = (car: Car) => setSelectedCar(car);
  const closeCarModal = () => setSelectedCar(null);

  const handleSearch = (query: string, type: string) => {
    setLoading(true);
    setTimeout(() => {
      const results = filterCars(query, type);
      setFilteredCars(results);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const results = filterCars("", "");
      setFilteredCars(results);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <main className="min-h-screen flex flex-col gap-8 px-4 py-12 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold"
      >
        Find your next ride
      </motion.h1>

      <SearchBar onSearch={handleSearch} loading={loading} />
      <CarList
        cars={filteredCars}
        loading={loading}
        onCardClick={openCarModal}
      />
      <CarModal car={selectedCar} onClose={closeCarModal} />
    </main>
  );
}
