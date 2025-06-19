import { Car } from "@/types/car";

const placeholderImage = "/cars/placeholder.webp";

function generateFakeMileage(year: number): number {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);

  if (age === 0) return Math.floor(Math.random() * 10_000);
  if (age <= 2)
    return Math.floor(Math.random() * (25_000 - 15_000 + 1)) + 15_000;

  return Math.floor(Math.random() * (50_000 - 25_000 + 1)) + 25_000;
}

function generateFakeRating(): number {
  return parseFloat((4.2 + Math.random() * 0.6).toFixed(1));
}

function generateFakePricePerDay(displacement: number, year: number): number {
  const age = Math.max(0, new Date().getFullYear() - year);
  const engineMultiplier = displacement / 100;
  const base = age === 0 ? 2200 : age <= 2 ? 1500 : 800;

  return Math.floor(base + Math.random() * 400 * engineMultiplier);
}

export function mapApiCarToInternalCar(
  apiCar: Record<string, unknown>,
  index: number
): Car {
  const year = Number(apiCar.year) || 2020;
  const make = String(apiCar.make ?? "Unknown");
  const model = String(apiCar.model ?? "Model");
  const fuelRaw = String(apiCar.fuel_type ?? "petrol").toLowerCase();
  const transmissionRaw = String(apiCar.transmission ?? "").toLowerCase();
  const displacement = Number(apiCar.displacement ?? 1200);

  return {
    id: `${make}-${model}-${index}`,
    make,
    model,
    year,
    image: placeholderImage,
    color: "grey",
    fuel: fuelRaw.includes("electric")
      ? "electric"
      : fuelRaw.includes("hybrid")
      ? "hybrid"
      : fuelRaw.includes("diesel")
      ? "diesel"
      : "petrol",
    transmission: transmissionRaw.includes("auto") ? "Automatic" : "Manual",
    type: String(apiCar.class ?? "sedan").toLowerCase(),
    pricePerDay: generateFakePricePerDay(displacement, year),
    displacement,
    mileage: generateFakeMileage(year),
    seats: Number(apiCar.doors ?? 4),
    status: "available",
    rating: generateFakeRating(),
    isFeatured: index % 5 === 0,
  };
}
