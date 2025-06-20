"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import SearchBar from "@/components/layout/ui/SearchBar";
import SortDropdown from "@/components/SortDropdown";
import CarList from "@/components/CarList";
import CarModal from "@/components/CarModal";

import { fetchMakes, fetchModels } from "@/lib/api";
import { Car } from "@/types/car";

// Fuel type union from your Car type
const fuelTypes = ["petrol", "diesel", "electric", "hybrid"] as const;
type FuelType = (typeof fuelTypes)[number];

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
  const [makes, setMakes] = useState<{ id: number; name: string }[]>([]);
  const [selectedMake, setSelectedMake] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [models, setModels] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filteredModels, setFilteredModels] = useState<Car[]>([]);
  const [sortBy, setSortBy] = useState("year-desc");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const MODELS_PER_PAGE = 10;

  // Load makes once on mount
  useEffect(() => {
    fetchMakes()
      .then((data) => {
        setMakes(data);
        const astonMartin =
          data.find((m) => Number(m.id) === 72318) ?? data[0] ?? null;
        setSelectedMake(astonMartin);
      })
      .catch(console.error);
  }, []);

  // Load models when selectedMake or page changes
  useEffect(() => {
    if (!selectedMake) return;

    const loadModels = async () => {
      setLoading(true);
      try {
        const fetchedModelsRaw = await fetchModels(selectedMake.id);

        // Map raw models into Car type for display - minimal fields for now
        const mappedModels: Car[] = fetchedModelsRaw
          .map((m: any, idx: number) => ({
            id: `${m.id}`,
            make: selectedMake.name,
            model: m.name ?? "Model",
            modelId: m.id,
            year: m.yearFrom ?? 2020,
            fuel: "petrol" as FuelType, // Explicit cast to fix TS error
            type: "sedan",
            transmission: "Automatic" as "Automatic" | "Manual",
            pricePerDay: 100 + idx * 10,
            image: "/cars/placeholder.webp",
            mileage: 0,
            seats: 4,
            color: "grey",
            displacement: 1200,
            rating: 4.5,
            isFeatured: false,
            status: "available" as "available" | "sold" | "reserved",
          }))
          // paginate client-side
          .slice(0, page * MODELS_PER_PAGE);

        setModels(mappedModels);
        setHasMore(mappedModels.length < fetchedModelsRaw.length);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, [selectedMake, page]);

  // Sort models when models or sortBy changes
  useEffect(() => {
    setFilteredModels(sortCars(models, sortBy));
  }, [models, sortBy]);

  // Infinite scroll observer - increments page when sentinel visible
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  // SearchBar onChange handler to filter makes
  const handleSearchChange = (updates: { query?: string }) => {
    if (!updates.query) {
      // Reset to default Aston Martin make
      const astonMartin =
        makes.find((m) => Number(m.id) === 72318) ?? makes[0] ?? null;
      setSelectedMake(astonMartin);
      setPage(1);
      return;
    }
    const filtered = makes.find(
      (m) => m.name.toLowerCase() === updates.query?.toLowerCase()
    );
    if (filtered) {
      setSelectedMake(filtered);
      setPage(1);
    }
  };

  // Render loading fallback if no make selected yet
  if (!selectedMake) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading makes...</p>
      </main>
    );
  }

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
            query={selectedMake?.name ?? ""}
            type=""
            loading={loading}
            onChange={handleSearchChange}
          />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <CarList
          cars={filteredModels}
          loading={loading && page === 1}
          onCardClick={setSelectedCar}
        />
      </motion.div>

      <div ref={sentinelRef} className="h-12" />

      <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
    </main>
  );
}
