import { fetchModels } from "./client/fetchModels";
import { mapModelToCar } from "./mappers/mapModelToCar";
import { Car } from "@/types/car";

/**
 * Fetch models by makeId with local pagination support.
 */
export async function fetchCarsFromAPI(
  makeId: number,
  page: number = 1,
  limit: number = 10
): Promise<Car[]> {
  const models = await fetchModels(makeId);

  const start = (page - 1) * limit;
  const end = start + limit;

  return models
    .slice(start, end)
    .map((model, i) => mapModelToCar(model, start + i));
}
