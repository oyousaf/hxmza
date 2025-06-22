import { Car } from "@/types/car";

const placeholderImage = "/cars/placeholder.webp";

/**
 * Maps /models response into a lightweight Car object with defaults.
 * This only uses fields available from the /models endpoint.
 */
export function mapModelToCar(apiModel: any, globalIndex: number): Car {
  const id = Number(apiModel.id ?? globalIndex);
  const yearFrom = apiModel.yearFrom ?? 0;
  const yearTo = apiModel.yearTo ?? null;

  return {
    id,
    modelId: id,
    model: apiModel.name || "Unknown Model",
    year: `${yearFrom}${yearTo ? `–${yearTo}` : "–"}`,
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
    isFeatured: false,
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
    features: [],
    location: "",
  };
}
