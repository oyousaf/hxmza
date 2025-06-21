export type Car = {
  id: string;
  make: string;
  model: string;
  modelId: number;
  year: number;
  fuel: "petrol" | "diesel" | "electric" | "hybrid" | "unknown";
  type: string;
  transmission: string;
  pricePerDay: number;
  image: string;
  mileage: number;
  color: string;
  engine: number;
  rating: number;
  isFeatured: boolean;
  status: "available" | "sold" | "reserved";

  // Optional / API Spec Fields
  trim?: string;
  series?: string;
  bodyType?: string;
  lengthMm?: string;
  widthMm?: string;
  heightMm?: string;
  wheelbaseMm?: string;
  frontTrackMm?: string;
  rearTrackMm?: string;
  curbWeightKg?: string;
  maximumTorqueNM?: string;
  injectionType?: string;
  cylinderLayout?: string;
  numberOfCylinders?: string;
  valvesPerCylinder?: string;
  turnoverOfMaximumTorqueRpm?: string;
  engineHp?: string;
  engineHpRpm?: string;
  driveWheels?: string;
  turningCircleM?: string;
  cityFuelPer100KmL?: string;
  mixedFuelConsumptionPer100KmL?: string;
  highwayFuelPer100KmL?: string;
  rangeKm?: string;
  fuelTankCapacityL?: string;
  acceleration0To100KmPerHS?: string;
  maxSpeedKmPerH?: string;
  fuelGrade?: string;
  backSuspension?: string;
  rearBrakes?: string;
  frontBrakes?: string;
  frontSuspension?: string;
  numberOfSeats: number;

  // Optional metadata
  features?: string[];
  location?: string;
};
