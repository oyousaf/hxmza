import { Car } from "@/types/car";

export const mockCars: Car[] = [
  {
    id: "1",
    make: "Porsche",
    model: "Taycan Turbo S",
    year: 2025,
    image: "/cars/taycan.webp",
    pricePerDay: 240,
    fuel: "electric",
    transmission: "Automatic",
    seats: 4,
    isFeatured: true,
    type: "electric",
    status: "available",
  },
  {
    id: "2",
    make: "Mercedes-Benz",
    model: "EQS AMG",
    year: 2025,
    image: "/cars/eqs.webp",
    pricePerDay: 220,
    fuel: "electric",
    transmission: "Automatic",
    seats: 5,
    isFeatured: true,
    type: "electric",
    status: "available",
  },
  {
    id: "3",
    make: "Lamborghini",
    model: "Revuelto",
    year: 2025,
    image: "/cars/revuelto.jpg",
    pricePerDay: 350,
    fuel: "petrol",
    transmission: "Automatic",
    seats: 2,
    isFeatured: false,
    type: "supercar",
    status: "sold",
  },
  {
    id: "4",
    make: "Ferrari",
    model: "SF90 Stradale",
    year: 2025,
    image: "/cars/sf90.jpg",
    pricePerDay: 400,
    fuel: "petrol",
    transmission: "Automatic",
    seats: 2,
    isFeatured: false,
    type: "supercar",
    status: "available",
  },
];

export function filterCars(filters: {
  query: string;
  type: string;
  fuel: string;
  year: string;
  transmission: string;
  featured: boolean;
  available: boolean;
}): Car[] {
  return mockCars.filter((car) => {
    const { query, type, fuel, year, transmission, featured, available } =
      filters;

    if (
      query &&
      !`${car.make} ${car.model}`.toLowerCase().includes(query.toLowerCase())
    )
      return false;

    if (type && car.type.toLowerCase() !== type.toLowerCase()) return false;
    if (fuel && car.fuel.toLowerCase() !== fuel.toLowerCase()) return false;
    if (year && car.year.toString() !== year) return false;
    if (
      transmission &&
      car.transmission.toLowerCase() !== transmission.toLowerCase()
    )
      return false;
    if (featured && !car.isFeatured) return false;
    if (available && car.status?.toLowerCase() !== "available") return false;

    return true;
  });
}
