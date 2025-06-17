"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import SearchBar from "@/components/layout/ui/SearchBar";
import Filters from "@/components/Filters";
import Toggles from "@/components/Toggles";
import CarList from "@/components/CarList";
import CarModal from "@/components/CarModal";
import { filterCars } from "@/lib/api";
import { Car } from "@/types/car";

export default function HomePage() {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    query: "",
    type: "",
    fuel: "",
    year: "",
    transmission: "",
    featured: false,
    available: false,
  });

  const openCarModal = (car: Car) => setSelectedCar(car);
  const closeCarModal = () => setSelectedCar(null);

  const handleFilterChange = (updates: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    const cleared = {
      query: "",
      type: "",
      fuel: "",
      year: "",
      transmission: "",
      featured: false,
      available: false,
    };
    setFilters(cleared);
    router.push("/"); UR
  };

  // 🔄 Read filters from URL on initial load
  useEffect(() => {
    const defaultFilters = {
      query: searchParams.get("query") || "",
      type: searchParams.get("type") || "",
      fuel: searchParams.get("fuel") || "",
      year: searchParams.get("year") || "",
      transmission: searchParams.get("transmission") || "",
      featured: searchParams.get("featured") === "true",
      available: searchParams.get("available") === "true",
    };

    setFilters(defaultFilters);
    setLoading(true);
    const results = filterCars(defaultFilters);
    setFilteredCars(results);
    setLoading(false);
  }, []);

  // 🔁 Update results + sync URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) params.set(key, "true");
      } else if (value) {
        params.set(key, value);
      }
    });

    router.push(`/?${params.toString()}`);

    setLoading(true);
    const timer = setTimeout(() => {
      const results = filterCars(filters);
      setFilteredCars(results);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

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

      <SearchBar
        query={filters.query}
        type={filters.type}
        loading={loading}
        onChange={(updates) => handleFilterChange(updates)}
      />

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <Filters
          fuel={filters.fuel}
          year={filters.year}
          transmission={filters.transmission}
          onChange={(updates) => handleFilterChange(updates)}
        />
        <Toggles
          featured={filters.featured}
          available={filters.available}
          onChange={(updates) => handleFilterChange(updates)}
        />
        <button
          onClick={clearFilters}
          className="text-sm border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Clear
        </button>
      </div>

      <CarList
        cars={filteredCars}
        loading={loading}
        onCardClick={openCarModal}
      />

      <CarModal car={selectedCar} onClose={closeCarModal} />
    </main>
  );
}
