"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaTachometerAlt } from "react-icons/fa";
import { FaLeftLong, FaXmark } from "react-icons/fa6";
import { SiAstonmartin } from "react-icons/si";
import { GiCarWheel } from "react-icons/gi";
import { MdEventSeat } from "react-icons/md";
import { LuRuler } from "react-icons/lu";
import { PiEngine } from "react-icons/pi";

import { fetchGenerations } from "@/lib/client/fetchGenerations";
import { fetchTrims } from "@/lib/client/fetchTrims";
import { fetchSpecs } from "@/lib/client/fetchSpecs";
import { trimCache, specCache } from "@/lib/cache/carCache";
import { Car } from "@/types/car";
import { TrimSpec } from "@/lib/mappers/mapTrimToSpec";
import Image from "next/image";

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

const isValid = (val: unknown) =>
  typeof val === "string"
    ? val.trim() !== "" && val !== "0"
    : typeof val === "number"
    ? val > 0
    : false;

const capitalise = (val: string) =>
  val.replace(/\b\w/g, (char) => char.toUpperCase());

const formatValue = (val: unknown, path?: string): string => {
  if (!isValid(val)) return "—";

  const num = parseFloat(String(val));

  if (path?.includes("acceleration")) return `${num.toFixed(1)} s`;
  if (path?.includes("torque")) return `${num} Nm`;
  if (path?.includes("horsepower")) return `${num} bhp`;
  if (path?.includes("rpm")) return `${num} rpm`;
  if (path?.includes("topSpeed")) return `${num} km/h`;
  if (path?.includes("tank")) return `${num} L`;
  if (path?.includes("weight")) return `${num} kg`;
  if (path?.includes("displacement")) return `${num} cc`;
  if (
    path?.includes("length") ||
    path?.includes("width") ||
    path?.includes("height") ||
    path?.includes("wheelbase")
  )
    return `${num} mm`;
  if (path?.includes("turningCircle")) return `${num} m`;

  return capitalise(String(val));
};

function resolvePath<T extends object>(obj: T | null, path: string): unknown {
  if (!obj) return undefined;

  return path.split(".").reduce<unknown>((acc, key) => {
    if (typeof acc === "object" && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

const STEPS = ["generation", "trim", "spec"] as const;
type Step = (typeof STEPS)[number];

const STEP_LABELS: Record<Step, string> = {
  generation: "Generation",
  trim: "Trim",
  spec: "Specs",
};

export default function CarModal({ car, onClose }: Props) {
  const [step, setStep] = useState<Step>("generation");
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [trims, setTrims] = useState<Trim[]>([]);
  const [specs, setSpecs] = useState<TrimSpec | null>(null);
  const [selectedGeneration, setSelectedGeneration] =
    useState<Generation | null>(null);
  const [selectedTrim, setSelectedTrim] = useState<Trim | null>(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const isOpen = Boolean(car);

  const specSections = useMemo(
    () => ({
      Performance: {
        icon: <FaTachometerAlt aria-hidden="true" />,
        keys: {
          "engine.horsepower": "BHP",
          "engine.rpm": "RPM",
          "engine.torqueNm": "Max Torque",
          "performance.acceleration0To100": "0–100 km/h",
          "performance.topSpeed": "Top Speed",
        },
      },
      Chassis: {
        icon: <GiCarWheel aria-hidden="true" />,
        keys: {
          drive: "Drive",
          transmission: "Transmission",
          "dimensions.weight": "Weight",
          "fuel.tankCapacity": "Fuel Tank",
        },
      },
      Dimensions: {
        icon: <LuRuler aria-hidden="true" />,
        keys: {
          "dimensions.length": "Length",
          "dimensions.width": "Width",
          "dimensions.height": "Height",
          "dimensions.wheelbase": "Wheelbase",
        },
      },
      Engine: {
        icon: <PiEngine aria-hidden="true" />,
        keys: {
          "engine.fuelType": "Fuel Type",
          "engine.displacement": "Engine Size",
          "engine.cylinders": "Cylinders",
          "engine.injection": "Injection",
          "engine.layout": "Layout",
        },
      },
      Wheels: {
        icon: <GiCarWheel aria-hidden="true" />,
        keys: {
          turningCircle: "Turning Circle",
        },
      },
      Comfort: {
        icon: <MdEventSeat aria-hidden="true" />,
        keys: {
          seats: "Seats",
        },
      },
    }),
    []
  );

  // Only keep sections that have at least one real value, and within each
  // section only the fields that actually have data — the underlying API
  // returns a lot of empty fields per trim, so a section full of dashes
  // isn't useful to show.
  const visibleSections = useMemo(() => {
    if (!specs) return [];
    return Object.entries(specSections)
      .map(([section, { icon, keys }]) => {
        const entries = Object.entries(keys).filter(([path]) =>
          isValid(resolvePath(specs, path))
        );
        return { section, icon, entries };
      })
      .filter(({ entries }) => entries.length > 0);
  }, [specs, specSections]);

  const resetState = useCallback(() => {
    setStep("generation");
    setGenerations([]);
    setTrims([]);
    setSpecs(null);
    setSelectedGeneration(null);
    setSelectedTrim(null);
    setLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(resetState, 300);
  }, [onClose, resetState]);

  const loadGenerations = useCallback(async (modelId: number) => {
    setLoading(true);
    try {
      const res = await fetchGenerations(modelId);
      setGenerations(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!car?.modelId) return;
    resetState();
    loadGenerations(car.modelId);

    previouslyFocused.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      previouslyFocused.current?.focus?.();
    };
  }, [car, resetState, loadGenerations]);

  // Escape-to-close + focus trap
  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  async function loadTrims(generation: Generation) {
    setStep("trim");
    setSelectedGeneration(generation);
    setLoading(true);
    try {
      const cached = trimCache.get(generation.id);
      if (cached) {
        setTrims(cached);
      } else {
        const rawTrims = await fetchTrims(generation.id);
        const cleaned = rawTrims.map((t) => ({
          id: t.id,
          trim: t.trim,
          bodyType: t.bodyType || "—",
        }));
        trimCache.set(generation.id, cleaned);
        setTrims(cleaned);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadSpecs(trim: Trim) {
    setStep("spec");
    setSelectedTrim(trim);
    setLoading(true);
    try {
      const cached = specCache.get(trim.id);
      if (cached) {
        setSpecs(cached);
      } else {
        const res = await fetchSpecs(trim.id);
        if (res) {
          specCache.set(trim.id, res);
          setSpecs(res);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const formatGenerationLabel = (name: string) => {
    const match = name.trim().match(/^(\d+)\s*generation$/i);
    if (!match) return name;
    const num = parseInt(match[1]);
    const suffix =
      [, "st", "nd", "rd"][num % 10] && ![11, 12, 13].includes(num % 100)
        ? [, "st", "nd", "rd"][num % 10]
        : "th";
    return `${num}${suffix} Generation`;
  };

  const currentStepIndex = STEPS.indexOf(step);

  return (
    <AnimatePresence>
      {car && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="car-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-textPrimary"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Image banner */}
            <div className="relative h-40 w-full overflow-hidden sm:h-52">
              <Image
                src={car.image || "/cars/placeholder.webp"}
                alt={car.model}
                fill
                className="object-cover"
                sizes="768px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-textPrimary/90 via-textPrimary/10 to-transparent dark:from-black/80" />

              <button
                ref={closeButtonRef}
                onClick={handleClose}
                className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
                aria-label="Close dialog"
              >
                <FaXmark className="h-5 w-5" />
              </button>

              <h2
                id="car-modal-title"
                className="absolute bottom-3 left-4 text-2xl font-bold text-white drop-shadow-sm md:text-3xl"
              >
                {car.make} {car.model}
              </h2>
            </div>

            <div className="p-5 sm:p-6">
              {/* Segmented step control */}
              <div className="mb-6 grid grid-cols-3 gap-1 rounded-full bg-textPrimary/5 p-1 dark:bg-brand/10">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    aria-current={s === step ? "step" : undefined}
                    className={`rounded-full py-2 text-center text-xs font-semibold transition sm:text-sm ${
                      i <= currentStepIndex
                        ? "bg-textPrimary text-white dark:bg-brand dark:text-textPrimary"
                        : "text-textPrimary/40 dark:text-brand/40"
                    }`}
                  >
                    {STEP_LABELS[s]}
                  </div>
                ))}
              </div>

              {/* Back button */}
              {!loading && step !== "generation" && (
                <button
                  onClick={() => {
                    if (step === "spec") {
                      setStep("trim");
                      setSpecs(null);
                    } else {
                      setStep("generation");
                      setTrims([]);
                    }
                  }}
                  className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-textPrimary transition hover:text-textPrimary/60 dark:text-brand dark:hover:text-brand/60"
                >
                  <FaLeftLong aria-hidden="true" />
                  Back
                </button>
              )}

              {/* Spinner */}
              {loading && (
                <div
                  className="flex justify-center py-10"
                  role="status"
                  aria-label="Loading"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <SiAstonmartin className="h-16 w-16 text-textPrimary dark:text-brand" />
                  </motion.div>
                </div>
              )}

              {/* Generation Step */}
              {!loading && step === "generation" && (
                <div className="space-y-4">
                  <p className="font-semibold text-textPrimary dark:text-white">
                    Select a Generation
                  </p>
                  {generations.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      No generation data available for this model.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {generations.map((gen) => (
                        <button
                          key={gen.id}
                          onClick={() => loadTrims(gen)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition ${
                            selectedGeneration?.id === gen.id
                              ? "bg-textPrimary text-white dark:bg-brand dark:text-textPrimary"
                              : "bg-white text-textPrimary hover:bg-gray-100 dark:bg-textPrimary dark:text-brand dark:hover:bg-brand/20"
                          }`}
                        >
                          {formatGenerationLabel(gen.name)} ({gen.yearFrom}–
                          {gen.yearTo ?? "present"})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Trim Step */}
              {!loading && step === "trim" && (
                <div className="space-y-4">
                  <p className="font-semibold text-textPrimary dark:text-white">
                    Select a Trim
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {trims.map((trim) => (
                      <button
                        key={trim.id}
                        onClick={() => loadSpecs(trim)}
                        onMouseEnter={() => {
                          if (!specCache.has(trim.id)) {
                            fetchSpecs(trim.id).then((res) => {
                              if (res) {
                                specCache.set(trim.id, res);
                              }
                            });
                          }
                        }}
                        className={`rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition ${
                          selectedTrim?.id === trim.id
                            ? "bg-textPrimary text-white dark:bg-brand dark:text-textPrimary"
                            : "bg-white text-textPrimary hover:bg-gray-100 dark:bg-textPrimary dark:text-brand dark:hover:bg-brand/20"
                        }`}
                      >
                        {trim.trim} • {trim.bodyType}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs Step */}
              {!loading && step === "spec" && specs && (
                <div className="space-y-8">
                  {visibleSections.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Full specifications aren&apos;t available for this trim.
                    </p>
                  ) : (
                    visibleSections.map(({ section, icon, entries }) => (
                      <div key={section}>
                        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-textPrimary dark:text-white">
                          <span className="text-accent">{icon}</span>
                          {section}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {entries.map(([path, label]) => (
                            <div
                              key={path}
                              className="rounded-xl bg-textPrimary/5 p-3 dark:bg-brand/10"
                            >
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                {label}
                              </p>
                              <p className="mt-0.5 font-semibold text-textPrimary dark:text-white">
                                {formatValue(resolvePath(specs, path), path)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
