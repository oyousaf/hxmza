"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import SearchBar from "@/components/layout/ui/SearchBar";
import SortDropdown from "@/components/SortDropdown";
import CarList from "@/components/CarList";
import CarModal from "@/components/CarModal";
import Filters from "@/components/Filters";
import Toggles from "@/components/Toggles";

import { Car } from "@/types/car";
import { fetchCarsFromAPI } from "@/lib/api";

const MODELS_PER_PAGE = 10;
const DEFAULT_MAKE_ID = 72318;

export default function HomePage() {
  const [makeId, setMakeId] = useState(DEFAULT_MAKE_ID);
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("price-low");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [featured, setFeatured] = useState(false);
  const [available, setAvailable] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch cars from API
  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      try {
        const newCars = await fetchCarsFromAPI(makeId, page * MODELS_PER_PAGE);
        setCars((prev) => [...prev, ...newCars]);
      } catch (err) {
        console.error("❌ Failed to fetch cars:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCars();
  }, [makeId, page]);

  // Apply filters + sorting
  useEffect(() => {
    let result = [...cars];

    if (fuel) result = result.filter((c) => c.fuel === fuel);
    if (transmission)
      result = result.filter(
        (c) => c.transmission.toLowerCase() === transmission
      );
    if (featured) result = result.filter((c) => c.isFeatured);
    if (available) result = result.filter((c) => c.status === "available");

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.pricePerDay ?? 0) - (a.pricePerDay ?? 0));
        break;
      default:
        break;
    }

    setFilteredCars(result);
  }, [cars, fuel, transmission, featured, available, sortBy]);

  // Infinite scroll
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

      {/* Filters */}
      <div className="sticky top-[64px] z-20 bg-brand dark:bg-textPrimary border border-textPrimary dark:border-brand rounded-md shadow-sm px-4 py-5">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <SearchBar
            query=""
            type=""
            loading={loading}
            onChange={() => {}}
            onMakeSelect={({ id }) => {
              setCars([]);
              setPage(1);
              setMakeId(id);
              setFuel("");
              setTransmission("");
              setFeatured(false);
              setAvailable(false);
              setSelectedCar(null);
            }}
          />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <Filters
            fuel={fuel}
            transmission={transmission}
            onChange={({ fuel, transmission }) => {
              if (fuel !== undefined) setFuel(fuel);
              if (transmission !== undefined) setTransmission(transmission);
            }}
          />
          <Toggles
            featured={featured}
            available={available}
            onChange={({ featured, available }) => {
              if (featured !== undefined) setFeatured(featured);
              if (available !== undefined) setAvailable(available);
            }}
          />
        </div>
      </div>

      {/* Car List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <CarList
          cars={filteredCars}
          loading={loading && page === 1}
          onCardClick={(car) => {
            if (typeof car.modelId === "string") {
              car.modelId = Number(car.modelId);
            }
            setSelectedCar(car);
          }}
        />
      </motion.div>

      <div ref={sentinelRef} className="h-12" />

      {/* Modal */}
      <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
    </main>
  );
}
