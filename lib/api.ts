import { fetchModels } from "./client/fetchModels";
import { mapModelToCar } from "./mappers/mapModelToCar";
import { Car } from "@/types/car";

/**
 * Fetch models by makeId with pagination and filtering.
 *
 * Note: only `featured` is filterable at this level. Fuel/transmission only
 * exist once a specific trim's spec is fetched (several requests deep in the
 * generation -> trim -> spec drill-down), so they can't be filtered on in
 * the list view without an expensive fetch fan-out per model.
 */
export async function fetchCarsFromAPI(
  makeId: number,
  page: number = 1,
  limit: number = 10,
  filters?: {
    featured?: boolean;
  }
): Promise<Car[]> {
  const models = await fetchModels(makeId);

  // Get only models for current page
  const start = (page - 1) * limit;
  const end = start + limit;
  const modelsPage = models.slice(start, end);

  // Map all models to full Car objects in parallel
  const carPromises = modelsPage.map((model, i) =>
    mapModelToCar(model, start + i)
  );
  let cars = await Promise.all(carPromises);

  if (filters?.featured) {
    cars = cars.filter((car) => car.featured);
  }

  return cars;
}
