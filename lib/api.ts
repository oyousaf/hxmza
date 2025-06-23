import { fetchModels } from "./client/fetchModels";
import { mapModelToCar } from "./mappers/mapModelToCar";
import { Car } from "@/types/car";

/**
 * Fetch models by makeId with pagination and filtering.
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

  // Get only models for current page
  const start = (page - 1) * limit;
  const end = start + limit;
  const modelsPage = models.slice(start, end);

  // Map all models to full Car objects in parallel
  const carPromises = modelsPage.map((model, i) =>
    mapModelToCar(model, start + i)
  );
  let cars = await Promise.all(carPromises);

  // Apply filters if provided
  if (filters) {
    const { fuel, transmission, featured } = filters;

    if (fuel) {
      const userFuel = fuel.toLowerCase();
      const fuelAliases: Record<string, string[]> = {
        petrol: ["petrol", "gasoline"],
        diesel: ["diesel"],
        electric: ["electric", "ev", "electricity", "battery"],
        hybrid: ["hybrid", "plug-in hybrid", "mild hybrid", "phev"],
      };
      const acceptedFuelTerms = fuelAliases[userFuel] ?? [userFuel];

      cars = cars.filter((car) => {
        const carFuel = car.fuel?.toLowerCase() || "";
        return acceptedFuelTerms.some((alias) => carFuel.includes(alias));
      });
    }

    if (transmission) {
      const transmissionValue = transmission.toLowerCase();
      cars = cars.filter((car) =>
        car.transmission?.toLowerCase().includes(transmissionValue)
      );
    }

    if (featured) {
      cars = cars.filter((car) => car.featured);
    }
  }

  return cars;
}
