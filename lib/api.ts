import { Car } from "@/types/car";
import { mapApiCarToInternalCar } from "@/lib/utils";

const CAR_API_HOST = "cars-by-api-ninjas.p.rapidapi.com";
const CAR_API_URL = `https://${CAR_API_HOST}/v1/cars`;
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;

/**
 * Fetch cars by optional make and/or model.
 * Defaults to all Porsche cars.
 */
export async function fetchCarsFromAPI(
  make = "porsche",
  model?: string
): Promise<Car[]> {
  const params = new URLSearchParams();
  params.set("make", make);
  if (model) params.set("model", model);

  const url = `${CAR_API_URL}?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": CAR_API_HOST,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("❌ Failed to fetch car data:", res.statusText);
    return [];
  }

  const json = await res.json();
  return json.map((apiCar: any, index: number) =>
    mapApiCarToInternalCar(apiCar, index)
  );
}

export const mockCars: Car[] = [
  {
    id: "1",
    make: "Porsche",
    model: "Taycan Turbo S",
    year: 2025,
    image: "/cars/taycan.webp",
    color: "grey",
    pricePerDay: 900,
    fuel: "electric",
    transmission: "Automatic",
    seats: 4,
    isFeatured: true,
    type: "electric",
    status: "available",
    engine: 800,
    mileage: 5000,
    rating: 4.9,
  },
  {
    id: "2",
    make: "Mercedes-Benz",
    model: "EQS AMG",
    year: 2025,
    image: "/cars/eqs.webp",
    color: "white",
    pricePerDay: 800,
    fuel: "electric",
    transmission: "Automatic",
    seats: 5,
    isFeatured: false,
    type: "electric",
    status: "available",
    engine: 750,
    mileage: 8000,
    rating: 4.8,
  },
  {
    id: "3",
    make: "Lamborghini",
    model: "Revuelto",
    year: 2025,
    image: "/cars/revuelto.jpg",
    color: "white",
    pricePerDay: 1500,
    fuel: "petrol",
    transmission: "Automatic",
    seats: 2,
    isFeatured: false,
    type: "supercar",
    status: "sold",
    engine: 1000,
    mileage: 1200,
    rating: 4.7,
  },
  {
    id: "4",
    make: "Ferrari",
    model: "SF90 Stradale",
    year: 2025,
    image: "/cars/sf90.jpg",
    color: "white",
    pricePerDay: 1300,
    fuel: "petrol",
    transmission: "Automatic",
    seats: 2,
    isFeatured: false,
    type: "supercar",
    status: "available",
    engine: 980,
    mileage: 2000,
    rating: 4.95,
  },
];
