import { Car } from "@/types/car";

const placeholderImage = "/cars/placeholder.webp";

function generateFakeMileage(year: number): number {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);

  if (age === 0) {
    return Math.floor(Math.random() * 10000); // 0–10k
  } else if (age <= 2) {
    return Math.floor(Math.random() * (25000 - 15000 + 1)) + 15000; // 15k–25k
  } else {
    return Math.floor(Math.random() * (50000 - 25000 + 1)) + 25000; // 25k–50k
  }
}

function generateFakeRating(): number {
  return parseFloat((4.2 + Math.random() * 0.6).toFixed(1));
}

function generateFakePricePerDay(engineSize: number, year: number): number {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);

  const engineMultiplier = engineSize / 100;

  let base: number;
  if (age === 0) {
    base = 2200;
  } else if (age <= 2) {
    base = 1500;
  } else {
    base = 800;
  }

  const price = base + Math.random() * 400 * engineMultiplier;
  return Math.floor(price);
}

export function mapApiCarToInternalCar(apiCar: any, index: number): Car {
  const year = Number(apiCar.year) || 2020;
  const make = apiCar.make || "Unknown";
  const model = apiCar.model || "Model";
  const fuel = (apiCar.fuel_type || "petrol").toLowerCase();
  const transmission = (apiCar.transmission || "").toLowerCase();
  const engine = (apiCar.cylinders || 2) * 100;

  return {
    id: `${make}-${model}-${index}`,
    make,
    model,
    year,
    image: apiCar.image || placeholderImage,
    color: "grey",
    fuel: fuel.includes("electric")
      ? "electric"
      : fuel.includes("hybrid")
      ? "hybrid"
      : fuel.includes("diesel")
      ? "diesel"
      : "petrol",
    transmission: transmission.includes("auto") ? "Automatic" : "Manual",
    type: apiCar.class?.toLowerCase() || "sedan",
    pricePerDay: generateFakePricePerDay(engine, year),
    engine,
    mileage: generateFakeMileage(year),
    seats: 4,
    status: "available",
    rating: generateFakeRating(),
    isFeatured: index % 5 === 0,
  };
}
