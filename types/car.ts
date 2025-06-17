export type Car = {
  id: string;
  make: string;
  model: string;
  type: string;
  year: number;
  image: string;
  pricePerDay?: number;
  fuelType?: string;
  transmission?: string;
  seats?: number;
  isFeatured?: boolean;
};
