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

  // Smart filtering
  if (filters) {
    const { fuel, transmission, featured } = filters;

    // Fuel filter with alias support
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

    // Transmission filter (simple case-insensitive match)
    if (transmission) {
      const transmissionValue = transmission.toLowerCase();
      cars = cars.filter((car) =>
        car.transmission?.toLowerCase().includes(transmissionValue)
      );
    }

    // Featured flag filter
    if (featured) {
      cars = cars.filter((car) => car.featured);
    }
  }

  // Paginate after filtering
  const start = (page - 1) * limit;
  const end = start + limit;

  return cars.slice(start, end);
}
