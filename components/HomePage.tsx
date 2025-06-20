"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import SearchBar from "@/components/layout/ui/SearchBar";
import SortDropdown from "@/components/SortDropdown";
import CarList from "@/components/CarList";
import CarModal from "@/components/CarModal";
import Filters from "@/components/Filters";
import Toggles from "@/components/Toggles";

import { fetchMakes, fetchModels } from "@/lib/api";
import { Car } from "@/types/car";
import { SiAstonmartin } from "react-icons/si";

const fuelTypes = ["petrol", "diesel", "electric", "hybrid"] as const;
type FuelType = (typeof fuelTypes)[number];

const MODELS_PER_PAGE = 10;

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
  const [filteredModels, setFilteredModels] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("");
  const [transmission, setTransmission] = useState("");
  const [featured, setFeatured] = useState(false);
  const [available, setAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("year-desc");

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMakes()
      .then((data) => {
        setMakes(data);
        const aston =
          data.find((m) => Number(m.id) === 72318) ?? data[0] ?? null;
        setSelectedMake(aston);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedMake) return;

    const loadModels = async () => {
      setLoading(true);
      try {
        const raw = await fetchModels(selectedMake.id);

        const mapped: Car[] = raw
          .map((m: any, idx: number) => ({
            id: `${m.id}`,
            make: selectedMake.name,
            model: m.name ?? "Model",
            modelId: m.id,
            year: m.yearFrom ?? 2020,
            fuel: (m.fuelType?.toLowerCase() ?? "petrol") as FuelType,
            type: "sedan",
            transmission: m.transmission?.toLowerCase().includes("manual")
              ? "Manual"
              : "Automatic",
            pricePerDay: 100 + idx * 10,
            image: "/cars/placeholder.webp",
            mileage: 0,
            seats: 4,
            color: "grey",
            displacement: m.displacement ?? 1200,
            rating: 4.5,
            isFeatured: !!m.featured,
            status: ["sold", "reserved"].includes(m.status?.toLowerCase())
              ? (m.status.toLowerCase() as "sold" | "reserved")
              : "available",
          }))

          .slice(0, page * MODELS_PER_PAGE);

        setModels(mapped);
        setHasMore(mapped.length < raw.length);
      } catch (err) {
        console.error("Failed to fetch models:", err);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, [selectedMake, page]);

  useEffect(() => {
    let result = sortCars(models, sortBy);

    result = result.filter((car) => {
      const fuelMatch = fuel ? car.fuel.toLowerCase() === fuel : true;
      const yearMatch = year ? String(car.year) === year : true;
      const transmissionMatch = transmission
        ? car.transmission.toLowerCase() === transmission
        : true;
      const featuredMatch = featured ? car.isFeatured : true;
      const availableMatch = available ? car.status === "available" : true;

      return (
        fuelMatch &&
        yearMatch &&
        transmissionMatch &&
        featuredMatch &&
        availableMatch
      );
    });

    setFilteredModels(result);
  }, [models, sortBy, fuel, year, transmission, featured, available]);

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

  const handleSearchChange = ({ query }: { query?: string }) => {
    const make = !query
      ? makes.find((m) => m.id === 72318) ?? makes[0]
      : makes.find((m) => m.name.toLowerCase() === query.toLowerCase());

    if (make) {
      setSelectedMake(make);
      setPage(1);
    }
  };

  const resetFilters = () => {
    setFuel("");
    setYear("");
    setTransmission("");
    setFeatured(false);
    setAvailable(false);
  };

  if (!selectedMake) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center">
        <motion.div
          className="flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <SiAstonmartin className="w-24 h-24 text-textPrimary animate-spin" />
        </motion.div>
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
            query=""
            placeholder="Search..."
            type=""
            loading={loading}
            onChange={handleSearchChange}
          />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <Filters
            fuel={fuel}
            year={year}
            transmission={transmission}
            onChange={({ fuel, year, transmission }) => {
              if (fuel !== undefined) setFuel(fuel);
              if (year !== undefined) setYear(year);
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

        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="text-sm underline text-textPrimary hover:text-textPrimary/80 dark:text-brand dark:hover:text-brand/80"
          >
            Reset Filters
          </button>
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
