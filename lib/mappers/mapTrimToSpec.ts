export function mapTrimToSpec(raw: any) {
  return {
    trim: raw.trim,
    bodyType: raw.bodyType,
    engine: {
      horsepower: Number(raw.engineHp),
      torqueNm: Number(raw.maximumTorqueNM),
      rpm: Number(raw.engineHpRpm),
      fuelType: raw.engineType,
      injection: raw.injectionType,
      layout: raw.cylinderLayout,
      cylinders: Number(raw.numberOfCylinders),
      displacement: Number(raw.capacityCm3),
    },
    performance: {
      acceleration0To100: Number(raw.acceleration0To100KmPerHS),
      topSpeed: Number(raw.maxSpeedKmPerH),
      range: raw.rangeKm,
    },
    fuel: {
      city: Number(raw.cityFuelPer100KmL),
      mixed: Number(raw.mixedFuelConsumptionPer100KmL),
      highway: Number(raw.highwayFuelPer100KmL),
      tankCapacity: Number(raw.fuelTankCapacityL),
      grade: raw.fuelGrade,
    },
    dimensions: {
      length: Number(raw.lengthMm),
      width: Number(raw.widthMm),
      height: Number(raw.heightMm),
      wheelbase: Number(raw.wheelbaseMm),
      weight: Number(raw.curbWeightKg),
    },
    seats: Number(raw.numberOfSeats),
    brakes: {
      front: raw.frontBrakes,
      rear: raw.rearBrakes,
    },
    suspension: {
      front: raw.frontSuspension,
      rear: raw.backSuspension,
    },
    drive: raw.driveWheels,
    transmission: raw.transmission,
    turningCircle: Number(raw.turningCircleM),
  };
}