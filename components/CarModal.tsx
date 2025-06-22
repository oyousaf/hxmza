"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiAstonmartin } from "react-icons/si";
import { GiCarWheel } from "react-icons/gi";
import { FaTachometerAlt } from "react-icons/fa";
import { MdEventSeat } from "react-icons/md";
import { LuRuler } from "react-icons/lu";
import { FaXmark, FaLeftLong } from "react-icons/fa6";
import { PiEngine } from "react-icons/pi";

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
      Performance: {
        icon: <FaTachometerAlt className="inline-block mr-2 text-brand" />,
        keys: {
          engineHp: "BHP",
          engineHpRpm: "RPM",
          maximumTorqueNM: "Max Torque",
          acceleration0To100KmPerHS: "0–100 km/h",
          maxSpeedKmPerH: "Top Speed",
        },
      },
      Chassis: {
        icon: <GiCarWheel className="inline-block mr-2 text-brand" />,
        keys: {
          driveWheels: "Drive",
          transmission: "Transmission",
          curbWeightKg: "Weight",
          fuelTankCapacityL: "Fuel Tank",
        },
      },
      Dimensions: {
        icon: <LuRuler className="inline-block mr-2 text-brand" />,
        keys: {
          lengthMm: "Length (mm)",
          widthMm: "Width (mm)",
          heightMm: "Height (mm)",
          wheelbaseMm: "Wheelbase (mm)",
        },
      },
      Engine: {
        icon: <PiEngine className="inline-block mr-2 text-brand" />,
        keys: {
          engineType: "Fuel Type",
          capacityCm3: "Engine Size (cc)",
          numberOfCylinders: "Cylinders",
          injectionType: "Injection",
          valvesPerCylinder: "Valves/Cyl",
        },
      },
      Wheels: {
        icon: <GiCarWheel className="inline-block mr-2 text-brand" />,
        keys: {
          turningCircleM: "Turning Circle",
          frontTrackMm: "Front Track",
          rearTrackMm: "Rear Track",
        },
      },
      Comfort: {
        icon: <MdEventSeat className="inline-block mr-2 text-brand" />,
        keys: {
          numberOfSeats: "Seats",
          climateControl: "Climate",
          infotainmentSystem: "Infotainment",
        },
      },
    }),
    []
  );

  useEffect(() => {
    if (!car || !car.modelId) return;
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
      setGenerations(gens);
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
        const rawTrims = await fetchTrims(generation.id);

        // Optional: sanitize trims to avoid early spec fields bleeding through
        const cleanedTrims = rawTrims.map((t) => ({
          id: t.id,
          trim: t.trim,
          bodyType: t.bodyType || "—",
        }));

        trimCache.set(generation.id, cleanedTrims);
        setTrims(cleanedTrims);
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
        const data = await fetchSpecs(trim.id);
        specCache.set(trim.id, data);
        setSpecs(data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch specs:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatGenerationLabel(name: string): string {
    const match = name.trim().match(/^(\d+)\s*generation$/i);
    if (match) {
      const num = parseInt(match[1]);
      const suffix =
        [, "st", "nd", "rd"][num % 10] && ![11, 12, 13].includes(num % 100)
          ? [, "st", "nd", "rd"][num % 10]
          : "th";
      return `${num}${suffix} Generation`;
    }
    return name;
  }

  if (!car) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
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
          {/* Top */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-textPrimary dark:text-white">
              {car.make} {car.model}
            </h2>
            <button
              onClick={() => {
                setTimeout(resetState, 300);
                onClose();
              }}
              className="text-textPrimary hover:text-textPrimary/50 dark:text-brand dark:hover:text-brand/50"
              aria-label="Close"
            >
              <FaXmark className="w-6 h-6" />
            </button>
          </div>

          {/* Prominent Back Button */}
          {!loading && step !== "generation" && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => {
                  if (step === "spec") {
                    setStep("trim");
                    setSpecs(null);
                  } else if (step === "trim") {
                    setStep("generation");
                    setTrims([]);
                  }
                }}
                className="px-6 py-2 rounded-full text-textPrimary hover:text-textPrimary/50 dark:text-brand dark:hover:text-brand/50 font-semibold text-base transition"
              >
                <FaLeftLong className="inline-block mr-2 text-4xl" />
              </button>
            </div>
          )}

          {/* Spinner */}
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
              <p className="font-semibold text-textPrimary dark:text-white mb-2">
                Select a Generation:
              </p>
              <div className="flex flex-wrap gap-3">
                {generations.map((gen) => (
                  <button
                    key={gen.id}
                    onClick={() => loadTrims(gen)}
                    className={`px-4 py-2 rounded-full font-medium border transition text-sm shadow-sm ${
                      selectedGeneration?.id === gen.id
                        ? "bg-brand text-white"
                        : "bg-white text-textPrimary dark:bg-brand dark:text-textPrimary hover:bg-gray-100 dark:hover:bg-brand/50 dark:hover:text-white"
                    }`}
                  >
                    {formatGenerationLabel(gen.name)} ({gen.yearFrom}–
                    {gen.yearTo ?? "present"})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trim Picker */}
          {!loading && step === "trim" && (
            <div className="space-y-4 mt-6">
              <p className="font-semibold text-textPrimary dark:text-white mb-2">
                Select a Trim:
              </p>
              <div className="flex flex-wrap gap-3">
                {trims.map((trim) => (
                  <button
                    key={trim.id}
                    onClick={() => loadSpecs(trim)}
                    onMouseEnter={() =>
                      fetchSpecs(trim.id).then((res) =>
                        specCache.set(trim.id, res)
                      )
                    }
                    className={`px-4 py-2 rounded-full font-medium border transition text-sm shadow-sm ${
                      selectedTrim?.id === trim.id
                        ? "bg-brand text-white"
                        : "bg-white text-textPrimary dark:bg-brand dark:text-textPrimary hover:bg-gray-100 dark:hover:bg-brand/50 dark:hover:text-white"
                    }`}
                  >
                    {trim.trim} • {trim.bodyType}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spec Display */}
          {!loading && step === "spec" && specs && (
            <div className="space-y-8 mt-6">
              {Object.entries(specSections).map(([section, { icon, keys }]) => (
                <div key={section}>
                  <h3 className="text-lg md:text-xl font-bold text-textPrimary dark:text-white mb-2 flex items-center">
                    {icon} {section}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-base text-gray-700 dark:text-gray-200">
                    {Object.entries(keys).map(([key, label]) => (
                      <div key={key}>
                        <p className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {label}
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
