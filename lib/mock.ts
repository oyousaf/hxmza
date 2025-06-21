import mockTrim from "./dev/mockTrim.json";
import mockGenerations from "./dev/mockGenerations.json";
import { mapApiCarToInternalCar } from "@/lib/utils";
import { Car } from "@/types/car";

/**
 * Returns a single mock-mapped car (used for grid/card UI).
 */
export function getMockCar(index: number = 0, modelId: number = 99999): Car {
  return mapApiCarToInternalCar(mockTrim, index, modelId);
}

/**
 * Returns an array of mock-mapped cars (for homepage or list view).
 */
export function getMockCars(
  count: number = 10,
  modelId: number = 99999
): Car[] {
  return Array.from({ length: count }, (_, i) => getMockCar(i, modelId));
}

/**
 * Returns mock generation data for the given model (one in mock for now).
 */
export function getMockGenerations(): {
  id: number;
  name: string;
  yearFrom: number;
  yearTo?: number | null;
}[] {
  return mockGenerations;
}

/**
 * Returns a static list of mock trims for the selected generation.
 */
export function getMockTrims(): {
  id: number;
  trim: string;
  bodyType: string;
}[] {
  return [
    {
      id: 88888,
      trim: mockTrim.trim,
      bodyType: mockTrim.bodyType || "Hatchback",
    },
  ];
}

/**
 * Returns the full raw spec data from mockTrim.json.
 * Used in CarModal for detailed specs display.
 */
export function getFullMockTrimSpec() {
  return mockTrim;
}
