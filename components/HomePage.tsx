"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import SearchBar from "@/components/layout/ui/SearchBar";
import CarList from "@/components/CarList";
import CarModal from "@/components/CarModal";

import { Car } from "@/types/car";
import { fetchCarsFromAPI } from "@/lib/api";

const MODELS_PER_PAGE = 10;
const DEFAULT_MAKE_ID = 72318;

export default function HomePage() {
  const [makeId, setMakeId] = useState(DEFAULT_MAKE_ID);
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      try {
        const newCars = await fetchCarsFromAPI(makeId, page, MODELS_PER_PAGE);
        setCars((prev) => [...prev, ...newCars]);
      } catch (err) {
        console.error("❌ Failed to fetch cars:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [makeId, page]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    let ticking = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !ticking) {
          ticking = true;
          setTimeout(() => {
            setPage((prev) => prev + 1);
            ticking = false;
          }, 300);
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

      <div className="sticky top-[64px] z-20 bg-brand dark:bg-textPrimary border border-textPrimary dark:border-brand rounded-md shadow-sm px-4 py-5">
        <SearchBar
          query=""
          type=""
          loading={loading}
          onChange={() => {}}
          onMakeSelect={({ id }) => {
            setCars([]);
            setPage(1);
            setMakeId(id);
            setSelectedCar(null);
          }}
        />
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
