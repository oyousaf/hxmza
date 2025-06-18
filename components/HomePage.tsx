"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  const [sortBy, setSortBy] = useState("year-desc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

    const sort = localStorage.getItem("sortBy") || "year-desc";

    setFilters(initialFilters);
    setSortBy(sort);
    setCars(filterCars(initialFilters));
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === "boolean" && value) {
        params.set(key, "true");
      } else if (value) {
        params.set(key, value);
      }
    });

    localStorage.setItem("sortBy", sortBy);

    router.push(`/?${params.toString()}`);
    setLoading(true);

    const timer = setTimeout(() => {
      const filtered = filterCars(filters);
      setCars(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, sortBy, router]);

  const handleFilterChange = (updates: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSortBy("year-desc");
    localStorage.setItem("sortBy", "year-desc");
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

      <div className="sticky top-[64px] z-20 bg-brand dark:bg-textPrimary border border-textPrimary dark:border-brand rounded-md shadow-sm px-4 py-5">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <SearchBar
            query={filters.query}
            type={filters.type}
            loading={loading}
            onChange={handleFilterChange}
          />
          <SortDropdown value={sortBy} onChange={handleSortChange} />
        </div>

        <div className="block sm:hidden mt-4">
          <button
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
            className="text-sm border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition w-full"
          >
            {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          </button>

          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4 space-y-4"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden sm:flex flex-wrap gap-4 mt-4">
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

        <div className="mt-4 sm:mt-2 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
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
