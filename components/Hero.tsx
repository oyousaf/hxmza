"use client";

import Image from "next/image";
import CustomButton from "./CustomButton";

const Hero = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("discover");

    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#d1cbc1]">
      <div className="hero">
        <div className="flex-1 pt-36 padding-x">
          <h1 className="hero__title">Search, book or rent a car</h1>
          <p className="hero__subtitle">
            Simplify your car rental journey with our seamless reservation
            system
          </p>

          <CustomButton
            title="Explore"
            containerStyles="bg-gray-300 hover:bg-gray-100 rounded-full mt-10"
            handleClick={handleScroll}
          />
        </div>
        <div className="hero__image-container">
          <div className="hero__image">
            <Image src="/hero.png" alt="hero" fill className="object-contain" />
          </div>
          <div className="hero__image-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
