import { useState } from "react";
import { FaHandshake, FaCar, FaUsers, FaHistory } from "react-icons/fa";

const About = () => {
  const [currentYear] = useState(new Date().getFullYear());
  const establishedYear = 2019;
  const yearsEstablished = currentYear - establishedYear;

  return (
    <section className="py-16" id="about">
      <h2 className="text-4xl font-bold text-center mb-12">About</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto text-center">
        {/* Tile 1 */}
        <div className="flex flex-col items-center bg-rose-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
          <FaHandshake className="text-rose-950 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
          <p className="text-center text-white">
            Our top priority is providing excellent customer service and
            ensuring customer satisfaction.
          </p>
        </div>

        {/* Tile 2 */}
        <div className="flex flex-col items-center bg-rose-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
          <FaCar className="text-rose-950 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Quality Cars</h3>
          <p className="text-center text-white">
            We offer a wide range of certified, pre-owned vehicles, inspected
            for top quality.
          </p>
        </div>

        {/* Tile 3 */}
        <div className="flex flex-col items-center bg-rose-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
          <FaHistory className="text-rose-950 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Established {yearsEstablished} Years Ago
          </h3>
          <p className="text-center text-white">
            We've been in business since {establishedYear}, building a
            reputation for reliability and trustworthiness.
          </p>
        </div>

        {/* Tile 4 */}
        <div className="flex flex-col items-center bg-rose-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
          <FaUsers className="text-rose-950 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Community Trusted</h3>
          <p className="text-center text-white">
            Proudly serving our community with trusted service and value.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
