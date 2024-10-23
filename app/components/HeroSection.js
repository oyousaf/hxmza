"use client";

import { Link as ScrollLink } from "react-scroll";
import { FaArrowDown } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center items-center h-screen p-8 text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/porsche-taycan.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Ace Motor Sales
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-6">
          Explore our selection of certified, pre-owned vehicles, each
          thoroughly inspected to ensure top quality, reliability, and
          performance.
        </p>
      </div>
      <ScrollLink
        to="about"
        smooth={true}
        duration={500}
        className="z-20 mt-4 flex items-center justify-center bg-rose-600 text-white p-4 rounded-full hover:bg-rose-700 transition duration-200 cursor-pointer"
        aria-label="Scroll to About section"
      >
        <FaArrowDown className="animate-bounce text-3xl" />
      </ScrollLink>
    </section>
  );
};

export default HeroSection;
