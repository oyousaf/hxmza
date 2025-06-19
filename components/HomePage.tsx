"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import SearchBar from "@/components/layout/ui/SearchBar";
import Filters from "@/components/Filters";
import Toggles from "@/components/Toggles";
import SortDropdown from "@/components/SortDropdown";
import CarList from "@/components/CarList";
import CarModal from "@/components/CarModal";

import { fetchCarsFromAPI } from "@/lib/api";
import { Car } from "@/types/car";

function sortCars(cars: Car[], sortBy: string): Car[] {
  const [field, order] = sortBy.split("-") as [keyof Car, "asc" | "desc"];
  const dir = order === "asc" ? 1 : -1;

  return [...cars].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * dir;
    }

    return String(aVal).localeCompare(String(bVal)) * dir;
  });
}

export default function HomePage() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("year-desc");

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
  const cache = useRef<Record<string, Car[]>>({});

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const query = filters.query.trim().toLowerCase();
        const make = query || "porsche";

        if (cache.current[make]) {
          setAllCars(cache.current[make]);
        } else {
          const cars = await fetchCarsFromAPI(make);
          cache.current[make] = cars;
          setAllCars(cars);
        }
      } catch (err) {
        console.error("❌ Failed to fetch cars:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [filters.query]);

  useEffect(() => {
    const result = allCars.filter((car) => {
      return (
        (!filters.query ||
          car.make.toLowerCase().includes(filters.query.toLowerCase())) &&
        (!filters.type || car.type.toLowerCase() === filters.type) &&
        (!filters.fuel || car.fuel === filters.fuel) &&
        (!filters.year || car.year.toString() === filters.year) &&
        (!filters.transmission ||
          car.transmission.toLowerCase() === filters.transmission) &&
        (!filters.featured || car.isFeatured) &&
        (!filters.available || car.status === "available")
      );
    });

    setFilteredCars(sortCars(result, sortBy));
  }, [filters, allCars, sortBy]);

  const handleFilterChange = (updates: Partial<typeof filters>) =>
    setFilters((prev) => ({ ...prev, ...updates }));

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSortBy("year-desc");
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

      {/* Top Filters */}
      <div className="sticky top-[64px] z-20 bg-brand dark:bg-textPrimary border border-textPrimary dark:border-brand rounded-md shadow-sm px-4 py-5">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <SearchBar
            query={filters.query}
            type={filters.type}
            loading={loading}
            onChange={handleFilterChange}
          />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        <div className="block sm:hidden mt-4">
          <button
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
            className="text-sm border border-textPrimary px-4 py-2 rounded-md dark:border-brand hover:bg-brand dark:hover:bg-brand dark:hover:text-textPrimary transition w-full"
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
            className="text-sm font-medium text-red-600 border border-red-600 rounded-md px-4 py-2 transition hover:bg-red-600 hover:text-white dark:hover:bg-red-500"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Car List */}
      <motion.div
        key={JSON.stringify(filteredCars) + sortBy}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <CarList
          cars={filteredCars}
          loading={loading}
          onCardClick={(car) => setSelectedCar(car)}
        />
      </motion.div>

      <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
    </main>
  );
}
