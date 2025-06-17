"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import SearchBar from "@/components/layout/ui/SearchBar";
import Filters from "@/components/Filters";
import Toggles from "@/components/Toggles";
import SortDropdown from "@/components/SortDropdown";
import CarList from "@/components/CarList";
import CarModal from "@/components/CarModal";
import { filterCars } from "@/lib/api";
import { Car } from "@/types/car";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const defaultFilters = {
    query: "",
    type: "",
    fuel: "",
    year: "",
    transmission: "",
    featured: false,
    available: false,
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("");

  // 🔄 Load filters + sort from URL/localStorage on mount
  useEffect(() => {
    const initialFilters = {
      query: searchParams.get("query") || "",
      type: searchParams.get("type") || "",
      fuel: searchParams.get("fuel") || "",
      year: searchParams.get("year") || "",
      transmission: searchParams.get("transmission") || "",
      featured: searchParams.get("featured") === "true",
      available: searchParams.get("available") === "true",
    };

    const savedSort = localStorage.getItem("sortBy") || searchParams.get("sort") || "year-desc";

    setFilters(initialFilters);
    setSortBy(savedSort);

    setLoading(true);
    const results = filterCars(initialFilters);
    setCars(results);
    setLoading(false);
  }, []);

  // 🔁 Sync filters + sort to URL + localStorage and refilter
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === "boolean" && value) {
        params.set(key, "true");
      } else if (typeof value === "string" && value.trim() !== "") {
        params.set(key, value);
      }
    });

    if (sortBy) {
      params.set("sort", sortBy);
      localStorage.setItem("sortBy", sortBy);
    }

    router.push(`/?${params.toString()}`);

    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = filterCars(filters);
      setCars(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, sortBy]);

  // 🔄 UI event handlers
  const handleFilterChange = (updates: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSortBy("year-desc");
    localStorage.removeItem("sortBy");
    router.push("/");
  };

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
        onChange={handleFilterChange}
      />

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <Filters
            fuel={filters.fuel}
            year={filters.year}
            transmission={filters.transmission}
            onChange={handleFilterChange}
          />
          <Toggles
            featured={filters.featured}
            available={filters.available}
            onChange={handleFilterChange}
          />
        </div>

        <div className="flex gap-4 items-center">
          <SortDropdown value={sortBy} onChange={handleSortChange} />
          <button
            onClick={clearFilters}
            className="text-sm border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Clear
          </button>
        </div>
      </div>

      <CarList
        cars={cars}
        loading={loading}
        sortBy={sortBy}
        onCardClick={(car) => setSelectedCar(car)}
      />

      <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
    </main>
  );
}
