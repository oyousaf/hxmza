import { Car } from "@/types/car";

const placeholderImage = "/cars/placeholder.webp";

// Util: Ensure valid year
function safeYear(value: unknown): number {
  const parsed = parseInt(String(value), 10);
  const currentYear = new Date().getFullYear();
  return Number.isNaN(parsed) || parsed < 1950 || parsed > currentYear + 1
    ? 2020
    : parsed;
}

// Util: Generate fake mileage based on car age
function generateFakeMileage(year: number): number {
  const age = Math.max(0, new Date().getFullYear() - year);
  if (age === 0) return Math.floor(Math.random() * 10_000);
  if (age <= 2) return Math.floor(Math.random() * 11_000) + 15_000;
  return Math.floor(Math.random() * 25_000) + 25_000;
}

// Util: Generate random rating between 4.2 and 5.0
function generateFakeRating(): number {
  return Math.min(5, parseFloat((4.2 + Math.random() * 0.6).toFixed(1)));
}

// Util: Estimate rental price from engine and age
function generateFakePricePerDay(engine: number, year: number): number {
  const age = Math.max(0, new Date().getFullYear() - year);
  const engineMultiplier = engine / 100;
  const base = age === 0 ? 2200 : age <= 2 ? 1500 : 800;
  return Math.floor(base + Math.random() * 400 * engineMultiplier);
}

/**
 * Maps raw Car Specs API model to internal Car object
 */
export function mapApiCarToInternalCar(
  apiCar: Record<string, unknown>,
  index: number,
  modelId: number,
  makeName = "Unknown"
): Car {
  const year = safeYear(apiCar.year);
  const engine = Number(apiCar.capacityCm3) || 1200;
  const transmission = String(apiCar.transmission ?? "").toLowerCase();
  const fuelType = String(apiCar.engineType ?? "").toLowerCase();

  return {
    id: `${makeName}-${apiCar.model ?? "Model"}-${modelId}-${index}`,
    make: makeName,
    model: String(apiCar.model ?? "Model"),
    modelId,
    year,
    image: placeholderImage,
    color: "grey",
    fuel: fuelType.includes("electric")
      ? "electric"
      : fuelType.includes("hybrid")
      ? "hybrid"
      : fuelType.includes("diesel")
      ? "diesel"
      : fuelType.includes("petrol") || fuelType.includes("gasoline")
      ? "petrol"
      : "unknown",
    transmission:
      transmission.includes("auto") || transmission.includes("cvt")
        ? "Automatic"
        : "Manual",
    type: String(apiCar.bodyType ?? apiCar.class ?? "hatchback").toLowerCase(),
    pricePerDay: generateFakePricePerDay(engine, year),
    engine,
    mileage: generateFakeMileage(year),
    rating: generateFakeRating(),
    status: "available",
    isFeatured: index % 5 === 0,
    numberOfSeats: Number(apiCar.numberOfSeats) || 4,
  };
}
