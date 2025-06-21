import { Car } from "@/types/car";

function generateFakeMileage(year: number): number {
  const age = Math.max(0, new Date().getFullYear() - year);
  if (age === 0) return Math.floor(Math.random() * 10_000);
  if (age <= 2) return Math.floor(Math.random() * 11_000) + 15_000;
  return Math.floor(Math.random() * 25_000) + 25_000;
}

function generateFakeRating(): number {
  return Math.min(5, parseFloat((4.2 + Math.random() * 0.6).toFixed(1)));
}

function generateFakePricePerDay(engine: number, year: number): number {
  const age = Math.max(0, new Date().getFullYear() - year);
  const engineMultiplier = engine / 100;
  const base = age === 0 ? 2200 : age <= 2 ? 1500 : 800;
  return Math.floor(base + Math.random() * 400 * engineMultiplier);
}

/**
 * Maps raw Car Specs API model to internal Car object
 */
export function mapModelToCar(apiModel: any, index: number): Car {
  return {
    id: `model-${apiModel.id}-${index}`,
    make: "Aston Martin",
    model: apiModel.name,
    modelId: parseInt(apiModel.id, 10),
    year: 2020, // placeholder
    image: "/cars/placeholder.webp",
    color: "grey",
    fuel: "unknown",
    type: "coupe",
    transmission: "auto",
    engine: 2000,
    mileage: 15000,
    pricePerDay: 120,
    rating: 4.4,
    numberOfSeats: 2,
    status: "available",
    isFeatured: index % 5 === 0,
  };
}
