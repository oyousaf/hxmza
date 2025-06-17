import { Car } from "@/types/car";

export const mockCars: Car[] = [
  {
    id: "1",
    make: "Porsche",
    model: "Taycan Turbo S",
    year: 2025,
    image: "/cars/taycan.webp",
    pricePerDay: 240,
    fuelType: "electric",
    transmission: "Automatic",
    seats: 4,
    isFeatured: true,
    type: "electric",
  },
  {
    id: "2",
    make: "Mercedes-Benz",
    model: "EQS AMG",
    year: 2025,
    image: "/cars/eqs.webp",
    pricePerDay: 220,
    fuelType: "electric",
    transmission: "Automatic",
    seats: 5,
    isFeatured: true,
    type: "electric",
  },
  {
    id: "3",
    make: "Lamborghini",
    model: "Revuelto",
    year: 2025,
    image: "/cars/revuelto.jpg",
    pricePerDay: 350,
    fuelType: "petrol",
    transmission: "Automatic",
    seats: 2,
    isFeatured: false,
    type: "supercar",
  },
  {
    id: "4",
    make: "Ferrari",
    model: "SF90 Stradale",
    year: 2025,
    image: "/cars/sf90.jpg",
    pricePerDay: 400,
    fuelType: "petrol",
    transmission: "Automatic",
    seats: 2,
    isFeatured: false,
    type: "supercar",
  },
];

export function filterCars(
  query: string,
  type: string = "",
  year?: number
): Car[] {
  return mockCars.filter((car) => {
    const matchesQuery = `${car.make} ${car.model}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesType = type ? car.type === type : true;
    const matchesYear = year ? car.year === year : true;

    return matchesQuery && matchesType && matchesYear;
  });
}
