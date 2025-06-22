import { fetchModels } from "./client/fetchModels";
import { mapModelToCar } from "./mappers/mapModelToCar";
import { Car } from "@/types/car";

/**
 * Fetch models by makeId with local pagination and optional filtering.
 */
export async function fetchCarsFromAPI(
  makeId: number,
  page: number = 1,
  limit: number = 10,
  filters?: {
    fuel?: string;
    transmission?: string;
    featured?: boolean;
  }
): Promise<Car[]> {
  const models = await fetchModels(makeId);
  let cars = models.map((model, i) => mapModelToCar(model, i));

  // Apply filters
  if (filters) {
    if (filters.fuel) {
      cars = cars.filter((car) =>
        car.fuel?.toLowerCase().includes(filters.fuel!)
      );
    }

    if (filters.transmission) {
      cars = cars.filter((car) =>
        car.transmission?.toLowerCase().includes(filters.transmission!)
      );
    }

    if (filters.featured) {
      cars = cars.filter((car) => car.featured);
    }
  }

  // Paginate after filtering
  const start = (page - 1) * limit;
  const end = start + limit;

  return cars.slice(start, end);
}
