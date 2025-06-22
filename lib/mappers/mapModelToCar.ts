import { Car } from "@/types/car";

const placeholderImage = "/cars/placeholder.webp";

/**
 * Maps /models response into a full Car object with default values
 * where data is not available (e.g., fuel, engine, etc.)
 */
export function mapModelToCar(apiModel: any, globalIndex: number): Car {
  const yearFrom = apiModel.yearFrom || 0;
  const yearTo = apiModel.yearTo ?? null;

  return {
    id: Number(apiModel.id ?? globalIndex),
    modelId: Number(apiModel.id ?? globalIndex),
    model: apiModel.name || "Unknown Model",
    year: `${yearFrom}${yearTo ? `–${yearTo}` : "–"}`,
    image: placeholderImage,

    // Preserved custom/default fields
    make: "",
    fuel: "unknown",
    type: "—",
    engine: "—",
    transmission: "—",
    mileage: 0,
    pricePerDay: 0,
    rating: 0,
    isFeatured: false,
    status: "available",
    numberOfSeats: "—",

    // Placeholder for trim/spec fields
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
    features: [],
    location: "",
  };
}
