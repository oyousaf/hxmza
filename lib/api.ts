import { Car } from "@/types/car";
import { mapApiCarToInternalCar } from "@/lib/utils";

const CAR_API_HOST = "cars-by-api-ninjas.p.rapidapi.com";
const CAR_API_URL = `https://${CAR_API_HOST}/v1/cars`;
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;

/**
 * Fetch cars by optional make and/or model.
 * Defaults to all Porsche cars.
 */
export async function fetchCarsFromAPI(make = "porsche", model?: string): Promise<Car[]> {
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
  return json.map((apiCar: any, index: number) => mapApiCarToInternalCar(apiCar, index));
}
