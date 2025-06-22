type TrimSpec = {
  trim: string;
  bodyType: string;
  engine: {
    horsepower: number;
    torqueNm: number;
    rpm: number;
    fuelType: string;
    injection: string;
    layout: string;
    cylinders: number;
    displacement: number;
  };
  performance: {
    acceleration0To100: number;
    topSpeed: number;
    range: string;
  };
  fuel: {
    city: number;
    mixed: number;
    highway: number;
    tankCapacity: number;
    grade: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
    weight: number;
  };
  seats: number;
  brakes: {
    front: string;
    rear: string;
  };
  suspension: {
    front: string;
    rear: string;
  };
  drive: string;
  transmission: string;
  turningCircle: number;
};

function toNumber(value: any): number {
  if (typeof value === "number") return value;
  if (typeof value === "string")
    return Number(value.replace(",", ".").replace(/[^\d.]/g, "")) || 0;
  return 0;
}

export function mapTrimToSpec(raw: any): TrimSpec {
  return {
    trim: raw.trim || "",
    bodyType: raw.bodyType || "",

    engine: {
      horsepower: toNumber(raw.engineHp),
      torqueNm: toNumber(raw.maximumTorqueNM),
      rpm: toNumber(raw.engineHpRpm),
      fuelType: raw.engineType || "",
      injection: raw.injectionType || "",
      layout: raw.cylinderLayout || "",
      cylinders: toNumber(raw.numberOfCylinders),
      displacement: toNumber(raw.capacityCm3),
    },

    performance: {
      acceleration0To100: toNumber(raw.acceleration0To100KmPerHS),
      topSpeed: toNumber(raw.maxSpeedKmPerH),
      range: raw.rangeKm || "",
    },

    fuel: {
      city: toNumber(raw.cityFuelPer100KmL),
      mixed: toNumber(raw.mixedFuelConsumptionPer100KmL),
      highway: toNumber(raw.highwayFuelPer100KmL),
      tankCapacity: toNumber(raw.fuelTankCapacityL),
      grade: raw.fuelGrade || "",
    },

    dimensions: {
      length: toNumber(raw.lengthMm),
      width: toNumber(raw.widthMm),
      height: toNumber(raw.heightMm),
      wheelbase: toNumber(raw.wheelbaseMm),
      weight: toNumber(raw.curbWeightKg),
    },

    seats: toNumber(raw.numberOfSeats),

    brakes: {
      front: raw.frontBrakes || "",
      rear: raw.rearBrakes || "",
    },

    suspension: {
      front: raw.frontSuspension || "",
      rear: raw.backSuspension || "",
    },

    drive: raw.driveWheels || "",
    transmission: raw.transmission || "",
    turningCircle: toNumber(raw.turningCircleM),
  };
}
