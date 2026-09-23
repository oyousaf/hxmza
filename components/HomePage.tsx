"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

import SearchBar from "@/components/layout/ui/SearchBar";
import HeroParticles from "@/components/layout/ui/HeroParticles";
import Toggles from "@/components/Toggles";
import SortDropdown, { SortValue } from "@/components/SortDropdown";
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
  const [error, setError] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const [featured, setFeatured] = useState<boolean>(false);
  const [sort, setSort] = useState<SortValue>("default");

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadCars = useCallback(
    async (targetPage: number, reset = false) => {
      setLoading(true);
      setError(null);
      try {
        const newCars = await fetchCarsFromAPI(makeId, targetPage, MODELS_PER_PAGE, {
          featured: featured || undefined,
        });

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
        setError("We couldn't load cars right now. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    },
    [makeId, featured]
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

  const sortedCars = useMemo(() => {
    if (sort === "default") return cars;
    const [key, direction] = sort.split("-") as [
      "pricePerDay" | "mileage" | "rating",
      "asc" | "desc"
    ];
    return [...cars].sort((a, b) =>
      direction === "asc" ? a[key] - b[key] : b[key] - a[key]
    );
  }, [cars, sort]);

  return (
    <div id="main-content" className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-brand via-brand-50 to-white text-textPrimary dark:from-textPrimary dark:via-textPrimary dark:to-[#1a0040] dark:text-white px-4 pb-28 pt-16 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-textPrimary/10 blur-3xl animate-float dark:bg-brand/20"
        />
        <HeroParticles />

        <div className="relative mx-auto max-w-6xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          >
            Hire your next car, anywhere in the UK
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-xl text-base text-textPrimary/70 dark:text-brand/90 sm:text-lg"
          >
            Compare supercars, electric vehicles and everyday cars by make,
            check specs, and hire online in minutes.
          </motion.p>
        </div>
      </section>

      {/* Floating search + filter card */}
      <div className="relative mx-auto -mt-14 w-full max-w-6xl px-4 sm:-mt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="sticky top-16 z-20 flex flex-col gap-4 rounded-3xl border border-textPrimary/10 bg-white p-4 shadow-xl shadow-textPrimary/10 dark:border-brand/10 dark:bg-textPrimary sm:p-6"
        >
          <SearchBar
            query=""
            loading={loading}
            onChange={() => {}}
            onMakeSelect={({ id }) => {
              setMakeId(id);
              setSelectedCar(null);
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Toggles
                featured={featured}
                onChange={(update) => {
                  if (update.featured !== undefined) setFeatured(update.featured);
                }}
              />
              {featured && (
                <button
                  type="button"
                  onClick={() => setFeatured(false)}
                  className="text-sm font-medium text-textPrimary underline-offset-2 hover:underline dark:text-brand"
                >
                  Reset filters
                </button>
              )}
            </div>

            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </motion.div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-12 pt-8">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <CarList
            cars={sortedCars}
            loading={loading && page === 1}
            onCardClick={(car) => setSelectedCar(car)}
          />
        </motion.div>

        <div
          ref={sentinelRef}
          className="h-12"
          aria-live="polite"
          aria-label={loading && page > 1 ? "Loading more cars" : undefined}
        />
      </div>

      <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
    </div>
  );
}
