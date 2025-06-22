import { Car } from "@/types/car";

const placeholderImage = "/cars/placeholder.webp";

/**
 * Maps raw model data (from /models endpoint) to a Car object for grid/list display.
 * Does NOT include trim/spec data.
 */
export function mapModelToCar(apiModel: any, index: number): Car {
  const {
    id,
    make,
    name,
    numberOfSeats,
    imageUrl,
    bodyType,
    engineType,
    transmission,
    capacityCm3,
  } = apiModel;

  const engine = String(capacityCm3) || "1500";
  const fuelType = String(engineType ?? "").toLowerCase();
  const transmissionType = String(transmission ?? "").toLowerCase();

  const getFuelCategory = (): Car["fuel"] => {
    if (fuelType.includes("electric")) return "electric";
    if (fuelType.includes("hybrid")) return "hybrid";
    if (fuelType.includes("diesel")) return "diesel";
    if (fuelType.includes("gasoline") || fuelType.includes("petrol"))
      return "petrol";
    return "unknown";
  };

  return {
    id: Number(id),
    make: String(make ?? "Unknown"),
    model: name || "Unknown Model",
    modelId: Number(id),
    image: imageUrl || placeholderImage,
    fuel: getFuelCategory(),
    type: (bodyType || "coupe").toLowerCase(),
    transmission:
      transmissionType.includes("auto") || transmissionType.includes("cvt")
        ? "Automatic"
        : "Manual",
    engine,
    mileage: 0,
    pricePerDay: 0,
    rating: 0,
    numberOfSeats: String(numberOfSeats) || "2",
    status: "available",
    isFeatured: false,
  };
}
