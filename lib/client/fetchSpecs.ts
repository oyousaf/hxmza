const API_HOST = "car-specs.p.rapidapi.com";
const HEADERS = {
  "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
  "X-RapidAPI-Host": API_HOST,
};

export type Spec = {
  engineHp: number | null;
  engineHpRpm: number | null;
  maximumTorqueNM: number | null;
  acceleration0To100KmPerHS: number | null;
  maxSpeedKmPerH: number | null;
  driveWheels: string;
  transmission: string;
  curbWeightKg: number | null;
  fuelTankCapacityL: number | null;
  lengthMm: number | null;
  widthMm: number | null;
  heightMm: number | null;
  wheelbaseMm: number | null;

  // New fields
  engineType: string;
  capacityCm3: number | null;
  numberOfCylinders: number | null;
  injectionType: string;
  valvesPerCylinder: number | null;
  turningCircleM: number | null;
  frontTrackMm: number | null;
  rearTrackMm: number | null;
  numberOfSeats: number | null;
};

export async function fetchSpecs(trimId: number): Promise<Spec | null> {
  try {
    const res = await fetch(`https://${API_HOST}/v2/cars/trims/${trimId}`, {
      headers: HEADERS,
    });

    if (!res.ok) return null;

    const raw = await res.json();

    return {
      engineHp: Number(raw.engineHp) || null,
      engineHpRpm: Number(raw.engineHpRpm) || null,
      maximumTorqueNM: Number(raw.maximumTorqueNM) || null,
      acceleration0To100KmPerHS: Number(raw.acceleration0To100KmPerHS) || null,
      maxSpeedKmPerH: Number(raw.maxSpeedKmPerH) || null,
      driveWheels: raw.driveWheels ?? "—",
      transmission: raw.transmission ?? "—",
      curbWeightKg: Number(raw.curbWeightKg) || null,
      fuelTankCapacityL: Number(raw.fuelTankCapacityL) || null,
      lengthMm: Number(raw.lengthMm) || null,
      widthMm: Number(raw.widthMm) || null,
      heightMm: Number(raw.heightMm) || null,
      wheelbaseMm: Number(raw.wheelbaseMm) || null,

      engineType: raw.engineType ?? "—",
      capacityCm3: Number(raw.capacityCm3) || null,
      numberOfCylinders: Number(raw.numberOfCylinders) || null,
      injectionType: raw.injectionType ?? "—",
      valvesPerCylinder: Number(raw.valvesPerCylinder) || null,
      turningCircleM: Number(raw.turningCircleM) || null,
      frontTrackMm: Number(raw.frontTrackMm) || null,
      rearTrackMm: Number(raw.rearTrackMm) || null,
      numberOfSeats: Number(raw.numberOfSeats) || null,
    };
  } catch (err) {
    console.error("❌ Failed to fetch specs:", err);
    return null;
  }
}
