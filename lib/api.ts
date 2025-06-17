import { Car } from "@/types/car";

export const mockCars: Car[] = [
  {
    id: "1",
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    image: "/car1.jpg",
    pricePerDay: 120,
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    isFeatured: true,
  },
  {
    id: "2",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    image: "/car2.jpg",
    pricePerDay: 60,
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    isFeatured: false,
  },
  {
    id: "3",
    make: "BMW",
    model: "i4",
    year: 2023,
    image: "/car3.jpg",
    pricePerDay: 150,
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    isFeatured: true,
  },
];

export function filterCars(query: string): Car[] {
  const q = query.toLowerCase();
  return mockCars.filter((car) =>
    `${car.make} ${car.model}`.toLowerCase().includes(q)
  );
}
