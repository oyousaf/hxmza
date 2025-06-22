import { Car } from "@/types/car";

const placeholderImage = "/cars/placeholder.webp";

export function mapApiCarToInternalCar(
  apiCar: Record<string, any>,
  index: number
): Car {
  const engine = String(apiCar.capacityCm3 ?? "—");
  const transmission = String(apiCar.transmission ?? "").toLowerCase();
  const fuelType = String(apiCar.engineType ?? "").toLowerCase();
  const body = String(apiCar.bodyType ?? apiCar.series ?? "Hatchback");

  const getFuelCategory = (): Car["fuel"] => {
    if (fuelType.includes("electric")) return "electric";
    if (fuelType.includes("hybrid")) return "hybrid";
    if (fuelType.includes("diesel")) return "diesel";
    if (fuelType.includes("petrol") || fuelType.includes("gasoline"))
      return "petrol";
    return "unknown";
  };

  const yearFrom = Number(apiCar.yearFrom) || 0;
  const yearTo = apiCar.yearTo ? Number(apiCar.yearTo) : null;
  const model = String(apiCar.model ?? "Model");
  const make = String(apiCar.make ?? "Unknown");

  return {
    id: Number(apiCar.id ?? index),
    modelId: Number(apiCar.modelId ?? index),
    make,
    model,
    year: `${yearFrom}${yearTo ? `–${yearTo}` : "–"}`,
    image: placeholderImage,

    fuel: getFuelCategory(),
    type: body.toLowerCase(),
    transmission:
      transmission.includes("auto") || transmission.includes("cvt")
        ? "Automatic"
        : "Manual",
    engine,
    mileage: 0,
    pricePerDay: 0,
    rating: 0,
    isFeatured: false,
    status: "available",
    numberOfSeats: String(apiCar.numberOfSeats ?? "—"),

    trim: String(apiCar.trim ?? ""),
    series: String(apiCar.series ?? ""),
    bodyType: body,

    lengthMm: String(apiCar.lengthMm ?? ""),
    widthMm: String(apiCar.widthMm ?? ""),
    heightMm: String(apiCar.heightMm ?? ""),
    wheelbaseMm: String(apiCar.wheelbaseMm ?? ""),
    frontTrackMm: String(apiCar.frontTrackMm ?? ""),
    rearTrackMm: String(apiCar.rearTrackMm ?? ""),
    curbWeightKg: String(apiCar.curbWeightKg ?? ""),
    maximumTorqueNM: String(apiCar.maximumTorqueNM ?? ""),
    injectionType: String(apiCar.injectionType ?? ""),
    cylinderLayout: String(apiCar.cylinderLayout ?? ""),
    numberOfCylinders: String(apiCar.numberOfCylinders ?? ""),
    valvesPerCylinder: String(apiCar.valvesPerCylinder ?? ""),
    turnoverOfMaximumTorqueRpm: String(apiCar.turnoverOfMaximumTorqueRpm ?? ""),
    engineHp: String(apiCar.engineHp ?? ""),
    engineHpRpm: String(apiCar.engineHpRpm ?? ""),
    driveWheels: String(apiCar.driveWheels ?? ""),
    turningCircleM: String(apiCar.turningCircleM ?? ""),
    cityFuelPer100KmL: String(apiCar.cityFuelPer100KmL ?? ""),
    mixedFuelConsumptionPer100KmL: String(
      apiCar.mixedFuelConsumptionPer100KmL ?? ""
    ),
    highwayFuelPer100KmL: String(apiCar.highwayFuelPer100KmL ?? ""),
    rangeKm: String(apiCar.rangeKm ?? ""),
    fuelTankCapacityL: String(apiCar.fuelTankCapacityL ?? ""),
    acceleration0To100KmPerHS: String(apiCar.acceleration0To100KmPerHS ?? ""),
    maxSpeedKmPerH: String(apiCar.maxSpeedKmPerH ?? ""),
    fuelGrade: String(apiCar.fuelGrade ?? ""),
    backSuspension: String(apiCar.backSuspension ?? ""),
    rearBrakes: String(apiCar.rearBrakes ?? ""),
    frontBrakes: String(apiCar.frontBrakes ?? ""),
    frontSuspension: String(apiCar.frontSuspension ?? ""),
  };
}
