import { useState } from "react";
import {
  FaHandshake,
  FaCar,
  FaUsers,
  FaHistory,
  FaExchangeAlt,
} from "react-icons/fa";

const About = () => {
  const [currentYear] = useState(new Date().getFullYear());
  const establishedYear = 2019;
  const yearsEstablished = currentYear - establishedYear;

  return (
    <section className="py-16" id="about">
      <h2 className="text-4xl font-bold text-center mb-12">About</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto text-center px-4 lg:px-8">
        <div className="flex flex-col items-center bg-rose-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
          <FaHandshake className="text-rose-950 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Customer-Centric Approach
          </h3>
          <p className="text-center text-white">
            We prioritise exceptional service, ensuring a seamless experience
            and complete satisfaction for every customer.
          </p>
        </div>

        <div className="flex flex-col items-center bg-rose-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
          <FaCar className="text-rose-950 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Premium Quality Vehicles
          </h3>
          <p className="text-center text-white">
            Our diverse selection of certified, pre-owned vehicles undergoes
            rigorous inspection, guaranteeing exceptional quality. Additionally,
            you have the opportunity to sell or part-exchange your vehicle with
            us.
          </p>
        </div>

        <div className="flex flex-col items-center bg-rose-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
          <FaHistory className="text-rose-950 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Established {yearsEstablished} Years
          </h3>
          <p className="text-center text-white">
            Since our inception in {establishedYear}, we have cultivated a
            reputation for reliability and trust, dedicated to serving our
            customers with integrity.
          </p>
        </div>

        <div className="flex flex-col items-center bg-rose-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
          <FaUsers className="text-rose-950 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Community Commitment</h3>
          <p className="text-center text-white">
            We take pride in our longstanding relationships within the
            community, delivering trusted service and unmatched value to all our
            clients.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
