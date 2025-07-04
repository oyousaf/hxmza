import { Car } from "@/types/car";
import { CarModel } from "@/lib/client/fetchModels";
import { fetchCarImage } from "@/lib/client/fetchUnsplashImage";

const placeholderImage = "/cars/placeholder.webp";

function getRandomInRange(min: number, max: number, decimal = false) {
  const val = Math.random() * (max - min) + min;
  return decimal ? Number(val.toFixed(1)) : Math.floor(val);
}

export async function mapModelToCar(
  apiModel: CarModel,
  globalIndex: number
): Promise<Car> {
  const id = Number(apiModel.id ?? globalIndex);
  const modelId = Number(apiModel.modelId);
  const isNewer =
    typeof apiModel.yearFrom === "number" && apiModel.yearFrom > 2015;

  const rawMileage = getRandomInRange(
    isNewer ? 5000 : 25000,
    isNewer ? 25000 : 50000
  );
  const image =
    (await fetchCarImage(apiModel.make || "", apiModel.model || "")) ||
    placeholderImage;

  return {
    id,
    modelId,
    model: apiModel.model || "Unknown Model",
    image,
    make: apiModel.make || "",
    fuel: "unknown",
    type: "—",
    engine: "—",
    transmission: "—",
    mileage: rawMileage,
    pricePerDay: getRandomInRange(isNewer ? 1000 : 500, isNewer ? 1800 : 800),
    rating: getRandomInRange(4.0, 5.0, true),
    featured: false,
    status: "available",
    numberOfSeats: "—",
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
