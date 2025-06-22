export type Car = {
  id: number;
  make: string;
  model: string;
  modelId: number;
  year: string;
  fuel: string;
  type: string;
  engine: string;
  transmission: string;
  image: string;
  mileage: number;
  pricePerDay: number;
  rating: number;
  isFeatured: boolean;
  status: "available" | "sold" | "reserved";
  numberOfSeats: string;

  // Optional / API spec fields
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
  capacityCm3?: string;
  engineType?: string;

  fuelTankCapacityL?: string;
  acceleration0To100KmPerHS?: string;
  maxSpeedKmPerH?: string;
  fuelGrade?: string;
  backSuspension?: string;
  rearBrakes?: string;
  frontBrakes?: string;
  frontSuspension?: string;

  // Optional metadata
  features?: string[];
  location?: string;
};
