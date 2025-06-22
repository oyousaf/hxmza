"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { SiAstonmartin } from "react-icons/si";

import { fetchGenerations } from "@/lib/client/fetchGenerations";
import { fetchTrims } from "@/lib/client/fetchTrims";
import { fetchSpecs } from "@/lib/client/fetchSpecs";
import { trimCache, specCache } from "@/lib/cache/carCache";
import { Car } from "@/types/car";

type Props = {
  car: Car | null;
  onClose: () => void;
};

type Generation = {
  id: number;
  name: string;
  yearFrom: number;
  yearTo?: number | null;
};

type Trim = {
  id: number;
  trim: string;
  bodyType: string;
};

export default function CarModal({ car, onClose }: Props) {
  const [step, setStep] = useState<"generation" | "trim" | "spec">(
    "generation"
  );
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [trims, setTrims] = useState<Trim[]>([]);
  const [specs, setSpecs] = useState<any>(null);
  const [selectedGeneration, setSelectedGeneration] =
    useState<Generation | null>(null);
  const [selectedTrim, setSelectedTrim] = useState<Trim | null>(null);
  const [loading, setLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const specSections = useMemo(
    () => ({
      Performance: [
        "engineHp",
        "engineHpRpm",
        "maximumTorqueNM",
        "acceleration0To100KmPerHS",
        "maxSpeedKmPerH",
      ],
      Chassis: [
        "driveWheels",
        "transmission",
        "curbWeightKg",
        "fuelTankCapacityL",
      ],
      Dimensions: ["lengthMm", "widthMm", "heightMm", "wheelbaseMm"],
    }),
    []
  );

  useEffect(() => {
    if (!car || !car.modelId || typeof car.modelId !== "number") return;

    resetState();
    loadGenerations(car.modelId);

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [car]);

  function resetState() {
    setStep("generation");
    setGenerations([]);
    setTrims([]);
    setSpecs(null);
    setSelectedGeneration(null);
    setSelectedTrim(null);
    setLoading(false);
  }

  async function loadGenerations(modelId: number) {
    setLoading(true);
    try {
      const gens = await fetchGenerations(modelId);
      setGenerations(gens || []);
    } catch (err) {
      console.error("❌ Failed to fetch generations:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadTrims(generation: Generation) {
    setStep("trim");
    setSelectedGeneration(generation);
    setLoading(true);

    try {
      if (trimCache.has(generation.id)) {
        setTrims(trimCache.get(generation.id)!);
      } else {
        const trims = await fetchTrims(generation.id);
        trimCache.set(generation.id, trims || []);
        setTrims(trims || []);
      }
    } catch (err) {
      console.error("❌ Failed to fetch trims:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadSpecs(trim: Trim) {
    setStep("spec");
    setSelectedTrim(trim);
    setLoading(true);

    try {
      if (specCache.has(trim.id)) {
        setSpecs(specCache.get(trim.id));
      } else {
        const result = await fetchSpecs(trim.id);
        specCache.set(trim.id, result);
        setSpecs(result);
      }
    } catch (err) {
      console.error("❌ Failed to fetch specs:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatSpecKey(key: string): string {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  if (!car) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          setTimeout(resetState, 300);
          onClose();
        }}
      >
        <motion.div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-textPrimary rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-textPrimary dark:text-white">
              {car.make} {car.model}
            </h2>
            <button
              onClick={() => {
                setTimeout(resetState, 300);
                onClose();
              }}
              className="text-gray-600 hover:text-gray-900 dark:hover:text-white"
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Back Button */}
          {!loading && step !== "generation" && (
            <button
              onClick={() => {
                if (step === "spec") {
                  setStep("trim");
                  setSpecs(null);
                  setSelectedTrim(null);
                } else if (step === "trim") {
                  setStep("generation");
                  setTrims([]);
                  setSelectedGeneration(null);
                }
              }}
              className="flex items-center gap-2 mb-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center py-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <SiAstonmartin className="w-24 h-24 text-textPrimary dark:text-brand" />
              </motion.div>
            </div>
          )}

          {/* Generation Picker */}
          {!loading && step === "generation" && (
            <div className="space-y-4">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select a Generation:
              </p>
              <div className="flex flex-wrap gap-3">
                {generations.map((gen) => {
                  const isSelected = selectedGeneration?.id === gen.id;
                  return (
                    <button
                      key={gen.id}
                      onClick={() => loadTrims(gen)}
                      className={`px-4 py-2 rounded-full transition ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {gen.name} ({gen.yearFrom}–{gen.yearTo ?? "present"})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trim Picker */}
          {!loading && step === "trim" && (
            <div className="space-y-4">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select a Trim:
              </p>
              <div className="flex flex-wrap gap-3">
                {trims.map((trim) => {
                  const isSelected = selectedTrim?.id === trim.id;
                  return (
                    <button
                      key={trim.id}
                      onClick={() => loadSpecs(trim)}
                      className={`px-4 py-2 rounded-full transition ${
                        isSelected
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {trim.trim} • {trim.bodyType}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spec Display */}
          {!loading && step === "spec" && specs && (
            <div className="space-y-6 mt-4">
              {Object.entries(specSections).map(([section, keys]) => (
                <div key={section}>
                  <h3 className="text-lg font-bold text-textPrimary dark:text-white mb-2">
                    {section}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
                    {keys.map((key) => (
                      <div key={key}>
                        <p className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {formatSpecKey(key)}
                        </p>
                        <p>{specs[key] ?? "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="rounded-lg overflow-hidden mt-6">
                <img
                  src={car.image || "/cars/placeholder.webp"}
                  alt={`${car.make} ${car.model}`}
                  onError={(e) =>
                    (e.currentTarget.src = "/cars/placeholder.webp")
                  }
                  className="w-full h-auto object-cover rounded-md shadow"
                />
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
