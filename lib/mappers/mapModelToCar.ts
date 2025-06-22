import { Car } from "@/types/car";
import { CarModel } from "@/lib/client/fetchModels";

const placeholderImage = "/cars/placeholder.webp";

/**
 * Maps CarModel to Car object with defaults.
 */
export function mapModelToCar(apiModel: CarModel, globalIndex: number): Car {
  const id = Number(apiModel.id ?? globalIndex);
  const modelId = Number(apiModel.modelId);

  return {
    id,
    modelId,
    model: apiModel.model || "Unknown Model",
    image: placeholderImage,

    // Custom local app metadata
    make: apiModel.make || "",
    fuel: "unknown",
    type: "—",
    engine: "—",
    transmission: "—",
    mileage: 0,
    pricePerDay: 0,
    rating: 0,
    featured: false,
    status: "available",
    numberOfSeats: "—",

    // Specs to be hydrated later
    trim: "",
    series: "",
    bodyType: "",
    lengthMm: "",
    widthMm: "",
    heightMm: "",
    wheelbaseMm: "",
    frontTrackMm: "",
    rearTrackMm: "",
    curbWeightKg: "",
    maximumTorqueNM: "",
    injectionType: "",
    cylinderLayout: "",
    numberOfCylinders: "",
    valvesPerCylinder: "",
    turnoverOfMaximumTorqueRpm: "",
    engineHp: "",
    engineHpRpm: "",
    driveWheels: "",
    turningCircleM: "",
    cityFuelPer100KmL: "",
    mixedFuelConsumptionPer100KmL: "",
    highwayFuelPer100KmL: "",
    rangeKm: "",
    capacityCm3: "",
    engineType: "",
    fuelTankCapacityL: "",
    acceleration0To100KmPerHS: "",
    maxSpeedKmPerH: "",
    fuelGrade: "",
    backSuspension: "",
    rearBrakes: "",
    frontBrakes: "",
    frontSuspension: "",
  };
}
