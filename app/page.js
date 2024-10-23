"use client";

import HeroSection from "./components/HeroSection";
import InstagramPosts from "./components/InstagramPosts";
import ScrollToTopBtn from "./components/ScrollToTopBtn";
import Reviews from "./components/Reviews";
import CarComparison from "./components/CarComparison";
import NewsletterSignup from "./components/NewsletterSignup";
import About from "./components/About";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <About />
      <InstagramPosts />
      <NewsletterSignup />
      <Reviews />
      <ScrollToTopBtn />
    </div>
  );
};

export default Home;
