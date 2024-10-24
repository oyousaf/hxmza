import { useState } from "react";
import {
  FaHandshake,
  FaCar,
  FaUsers,
  FaHistory,
} from "react-icons/fa";

const About = () => {
  const [currentYear] = useState(new Date().getFullYear());
  const establishedYear = 2019;
  const yearsEstablished = currentYear - establishedYear;

  const about = [
    {
      icon: FaHandshake,
      title: "Customer Satisfaction",
      description:
        "We prioritise exceptional service, ensuring a seamless experience and complete satisfaction for every customer.",
    },
    {
      icon: FaCar,
      title: "Quality Vehicles",
      description:
        "Our diverse selection of certified, pre-owned vehicles undergoes rigorous inspection, guaranteeing exceptional quality. Additionally, you have the opportunity to sell or part-exchange your vehicle with us.",
    },
    {
      icon: FaHistory,
      title: `Established ${yearsEstablished} Years`,
      description: `Since our inception in ${establishedYear}, we have cultivated a reputation for reliability and trust, dedicated to serving our customers with integrity.`,
    },
    {
      icon: FaUsers,
      title: "Community Commitment",
      description:
        "We take pride in our longstanding relationships within the community, delivering trusted service and unmatched value to all our clients.",
    },
  ];

  return (
    <section className="py-16" id="about">
      <h2 className="text-4xl font-bold text-center mb-12">About</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto text-center px-4 lg:px-8">
        {about.map((tile, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-rose-600 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <tile.icon className="text-rose-950 text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">{tile.title}</h3>
            <p className="text-center text-white">{tile.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
