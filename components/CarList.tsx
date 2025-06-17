import type { Car } from "@/types/car";
import CarCard from "./CarCard";

type Props = {
  cars: Car[];
};

export default function CarList({ cars }: Props) {
  if (cars.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p className="text-lg font-medium">🚫 No cars found.</p>
        <p className="text-sm mt-2">Try a different search or reset filters.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
