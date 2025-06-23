"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import SearchBar from "@/components/layout/ui/SearchBar";
// import Filters from "@/components/Filters";
// import Toggles from "@/components/Toggles";
import CarList from "@/components/CarList";
import CarModal from "@/components/CarModal";

import { Car } from "@/types/car";
import { fetchCarsFromAPI } from "@/lib/api";

const MODELS_PER_PAGE = 10;
const DEFAULT_MAKE_ID = 72318;

export default function HomePage() {
  const [makeId, setMakeId] = useState<number>(DEFAULT_MAKE_ID);
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Commented out filters for now
  // const [fuel, setFuel] = useState<string>("");
  // const [transmission, setTransmission] = useState<string>("");
  // const [featured, setFeatured] = useState<boolean>(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadCars = useCallback(
    async (targetPage: number, reset = false) => {
      setLoading(true);
      try {
        const newCars = await fetchCarsFromAPI(
          makeId,
          targetPage,
          MODELS_PER_PAGE
          // Comment out filters for now
          // { fuel, transmission, featured }
        );

        setCars((prev) =>
          reset
            ? newCars
            : [
                ...prev,
                ...newCars.filter((c) => !prev.some((pc) => pc.id === c.id)),
              ]
        );
      } catch (err) {
        console.error("❌ Failed to fetch cars:", err);
      } finally {
        setLoading(false);
      }
    },
    [makeId] // Removed filters from dependency list
  );

  useEffect(() => {
    setCars([]);
    setPage(1);
    loadCars(1, true);
  }, [loadCars]);

  useEffect(() => {
    if (page > 1) loadCars(page);
  }, [page, loadCars]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading]);

  return (
    <main className="min-h-screen flex flex-col gap-8 px-4 py-12 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-textPrimary dark:text-white"
      >
        Find your next ride
      </motion.h1>

      <div className="sticky top-[64px] z-20 bg-brand dark:bg-textPrimary border border-textPrimary dark:border-brand rounded-md shadow-sm px-4 py-5 flex flex-col gap-4">
        <SearchBar
          query=""
          loading={loading}
          onChange={() => {}}
          onMakeSelect={({ id }) => {
            setMakeId(id);
            setSelectedCar(null);
          }}
        />

        {/* Commented for now */}
        {/*
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <Filters
            fuel={fuel}
            transmission={transmission}
            onChange={(update) => {
              if (update.fuel !== undefined) setFuel(update.fuel);
              if (update.transmission !== undefined)
                setTransmission(update.transmission);
            }}
          />

          <Toggles
            featured={featured}
            onChange={(update) => {
              if (update.featured !== undefined) setFeatured(update.featured);
            }}
          />
        </div>
        */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <CarList
          cars={cars}
          loading={loading && page === 1}
          onCardClick={(car) => setSelectedCar(car)}
        />
      </motion.div>

      <div ref={sentinelRef} className="h-12" />

      <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
    </main>
  );
}
