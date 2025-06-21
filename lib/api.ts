import { fetchModels } from "./client/fetchModels";
import { mapModelToCar } from "./mappers/mapModelToCar";
import { Car } from "@/types/car";

export async function fetchCarsFromAPI(
  makeId: number,
  limit = 10
): Promise<Car[]> {
  const models = await fetchModels(makeId);
  return models
    .slice(0, limit)
    .map((model, index) => mapModelToCar(model, index));
}
