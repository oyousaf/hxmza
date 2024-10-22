import { useState } from "react";
import { mockData } from "../constants/index";

const CarComparison = () => {
  const [car1, setCar1] = useState("");
  const [car2, setCar2] = useState("");

  const compareCars = () => {
    const car1Specs = mockData.find((car) => car.name === car1);
    const car2Specs = mockData.find((car) => car.name === car2);

    if (car1Specs && car2Specs) {
      return (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold mb-4">Comparison Results:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[car1Specs, car2Specs].map((car, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-rose-600 text-white rounded-lg shadow-lg"
              >
                <h4 className="text-lg font-semibold">{car.name}</h4>
                <p className="mb-2">Horsepower: {car.horsepower}</p>
                <p>Speed: {car.speed}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-8" id="comparison">
      <h2 className="text-3xl font-bold text-center mb-8">Compare Cars</h2>
      <div className="max-w-5xl mx-auto text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <select
            onChange={(e) => setCar1(e.target.value)}
            className="p-2 bg-rose-800 text-white rounded-md shadow-md"
          >
            <option value="">Select Car 1</option>
            {mockData.map((car) => (
              <option key={car.name} value={car.name}>
                {car.name}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setCar2(e.target.value)}
            className="p-2 bg-rose-800 text-white rounded-md shadow-md"
          >
            <option value="">Select Car 2</option>
            {mockData.map((car) => (
              <option key={car.name} value={car.name}>
                {car.name}
              </option>
            ))}
          </select>
        </div>
        {compareCars()}
      </div>
    </section>
  );
};

export default CarComparison;
