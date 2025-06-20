"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiAstonmartin } from "react-icons/si";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Car } from "@/types/car";

const API_HOST = "car-specs.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;
const HEADERS = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": API_HOST,
};

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
type Trim = { id: number; trim: string; bodyType: string };

export default function CarModal({ car, onClose }: Props) {
  const [step, setStep] = useState<"generation" | "trim" | "spec" | "done">(
    "generation"
  );
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [trims, setTrims] = useState<Trim[]>([]);
  const [specs, setSpecs] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] =
    useState<Generation | null>(null);
  const [selectedTrim, setSelectedTrim] = useState<Trim | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch generations on car change
  useEffect(() => {
    if (!car) return resetState();
    loadGenerations(car.modelId);
  }, [car]);

  // Reset modal state
  function resetState() {
    setStep("generation");
    setGenerations([]);
    setTrims([]);
    setSpecs(null);
    setLoading(false);
    setError(null);
    setSelectedGeneration(null);
    setSelectedTrim(null);
  }

  async function fetchData(url: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : data?.data ?? [];
    } catch (err) {
      setError((err as Error).message || "Failed to fetch data");
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadGenerations(modelId: number) {
    resetState();
    setStep("generation");
    const gens = await fetchData(
      `https://${API_HOST}/v2/cars/models/${modelId}/generations`
    );
    setGenerations(gens);
  }

  async function loadTrims(generationId: number) {
    setStep("trim");
    setTrims([]);
    setSpecs(null);
    setSelectedTrim(null);
    const trimsData = await fetchData(
      `https://${API_HOST}/v2/cars/generations/${generationId}/trims`
    );
    setTrims(trimsData);
  }

  async function loadSpecs(trimId: number) {
    setStep("spec");
    setSpecs(null);
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`https://${API_HOST}/v2/cars/trims/${trimId}`, {
        headers: HEADERS,
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setSpecs(data);
      setStep("done");
    } catch (err) {
      setError((err as Error).message || "Failed to fetch specs");
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-xl font-semibold">
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

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          {!loading && step === "generation" && (
            <>
              {generations.length === 0 ? (
                <p className="text-center italic text-gray-600 dark:text-gray-400">
                  No generations found for this model.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                    Select a Generation:
                  </p>
                  {generations.map((gen) => (
                    <button
                      key={gen.id}
                      className="w-full text-left px-4 py-2 rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                      onClick={() => {
                        setSelectedGeneration(gen);
                        loadTrims(gen.id);
                      }}
                    >
                      {gen.name} ({gen.yearFrom} – {gen.yearTo ?? "present"})
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {!loading && step === "trim" && (
            <>
              {trims.length === 0 ? (
                <p className="text-center italic text-gray-600 dark:text-gray-400">
                  No trims found for this generation.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                    Select a Trim:
                  </p>
                  {trims.map((trim) => (
                    <button
                      key={trim.id}
                      className="w-full text-left px-4 py-2 rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                      onClick={() => {
                        setSelectedTrim(trim);
                        loadSpecs(trim.id);
                      }}
                    >
                      {trim.trim} • {trim.bodyType}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {!loading && step === "spec" && specs && (
            <div className="space-y-3 text-gray-700 dark:text-gray-200 text-sm">
              <p>
                <strong>Trim:</strong> {specs.trim ?? "Unknown"}
              </p>
              <p>
                <strong>Engine:</strong> {specs.engineType ?? "Unknown"}{" "}
                {specs.capacityCm3 ?? ""} cc • {specs.engineHp ?? "N/A"} HP
              </p>
              <p>
                <strong>Transmission:</strong> {specs.transmission ?? "Unknown"}
              </p>
              <p>
                <strong>Drive:</strong> {specs.driveWheels ?? "Unknown"}
              </p>
              <p>
                <strong>Top Speed:</strong> {specs.maxSpeedKmPerH ?? "Unknown"}{" "}
                km/h
              </p>
              <p>
                <strong>Weight:</strong> {specs.curbWeightKg ?? "Unknown"} kg
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
