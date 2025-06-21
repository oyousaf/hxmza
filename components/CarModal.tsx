"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiAstonmartin } from "react-icons/si";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { fetchGenerations } from "@/lib/client/fetchGenerations";
import { fetchTrims } from "@/lib/client/fetchTrims";
import { fetchSpecs } from "@/lib/client/fetchSpecs";

type Props = {
  car: any;
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

const trimCache = new Map<number, Trim[]>();
const specCache = new Map<number, any>();

export default function CarModal({ car, onClose }: Props) {
  const [step, setStep] = useState<"generation" | "trim" | "spec">(
    "generation"
  );
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [trims, setTrims] = useState<Trim[]>([]);
  const [specs, setSpecs] = useState<any>(null);
  const [selectedTrim, setSelectedTrim] = useState<Trim | null>(null);
  const [selectedGeneration, setSelectedGeneration] =
    useState<Generation | null>(null);
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
    if (!car) return resetState();
    loadGenerations();
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
    setSelectedTrim(null);
    setSelectedGeneration(null);
    setLoading(false);
  }

  async function loadGenerations() {
    setLoading(true);
    try {
      const gens = await fetchGenerations(car.modelId);
      setGenerations(gens || []);
      setStep("generation");
    } catch (err) {
      console.error("❌ Failed to fetch generations:", err);
    }
    setLoading(false);
  }

  async function loadTrims(generation: Generation) {
    setStep("trim");
    setLoading(true);
    setSelectedGeneration(generation);
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
    }
    setLoading(false);
  }

  async function loadSpecs(trim: Trim) {
    setStep("spec");
    setLoading(true);
    setSelectedTrim(trim);
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
    }
    setLoading(false);
  }

  if (!car) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-textPrimary dark:text-white">
              {car.make} {car.model}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 dark:hover:text-white"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <SiAstonmartin className="w-24 h-24 text-textPrimary dark:text-brand animate-spin" />
              </motion.div>
            </div>
          )}

          {!loading && step === "generation" && (
            <div className="space-y-2">
              <p className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                Select a Generation:
              </p>
              {generations.map((gen) => (
                <button
                  key={gen.id}
                  className="w-full text-left px-4 py-2 rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                  onClick={() => loadTrims(gen)}
                >
                  {gen.name} ({gen.yearFrom} – {gen.yearTo ?? "present"})
                </button>
              ))}
            </div>
          )}

          {!loading && step === "trim" && (
            <div className="space-y-2">
              <p className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                Select a Trim:
              </p>
              {trims.map((trim) => (
                <button
                  key={trim.id}
                  className="w-full text-left px-4 py-2 rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                  onClick={() => loadSpecs(trim)}
                >
                  {trim.trim} • {trim.bodyType}
                </button>
              ))}
            </div>
          )}

          {!loading && step === "spec" && specs && (
            <div className="space-y-6">
              {Object.entries(specSections).map(([section, keys]) => (
                <div key={section}>
                  <h3 className="text-lg font-bold text-textPrimary dark:text-white mb-2">
                    {section}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
                    {keys.map((key) => (
                      <div key={key}>
                        <p className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {key}
                        </p>
                        <p>{specs[key] ?? "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="rounded-lg overflow-hidden mt-6">
                <img
                  src="/cars/placeholder.webp"
                  alt={`${car.make} ${car.model}`}
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
