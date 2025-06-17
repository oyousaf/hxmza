import Image from "next/image";
import type { Car } from "@/types/car";

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Image
        src={car.image}
        alt={`${car.make} ${car.model}`}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold text-textPrimary">
          {car.make} {car.model}
        </h3>
        <p className="text-sm text-gray-500">{car.year}</p>
      </div>
    </div>
  );
}
