import { Car } from "@/types/car";

const placeholderImage = "/cars/placeholder.webp";

/**
 * Represents a simplified model object returned from /models endpoint
 */
export interface ModelInput {
  id?: number | string;
  name?: string;
  yearFrom?: number | string;
  yearTo?: number | string | null;
}

export function mapModelToCar(apiModel: ModelInput, globalIndex: number): Car {
  const id = Number(apiModel.id ?? globalIndex);

  return {
    id,
    modelId: id,
    model: apiModel.name || "Unknown Model",
    image: placeholderImage,

    // Custom local app metadata
    make: "",
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

    // Specs will be populated later
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
