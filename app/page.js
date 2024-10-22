"use client";

import HeroSection from "./components/HeroSection";
import InstagramPosts from "./components/InstagramPosts";
import ScrollToTopBtn from "./components/ScrollToTopBtn";
import Reviews from "./components/Reviews";
import CarComparison from "./components/CarComparison";
import NewsletterSignup from "./components/NewsletterSignup";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <InstagramPosts />
      <NewsletterSignup />
      <Reviews />
      <ScrollToTopBtn />
    </div>
  );
};

export default Home;
