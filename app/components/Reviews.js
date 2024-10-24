import { reviews } from "../constants/index";
import { FaQuoteLeft } from "react-icons/fa";

const Reviews = () => {
  return (
    <section className="py-8" id="reviews">
      <h2 className="text-4xl font-bold text-center mb-8">Reviews</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 lg:px-8">
        {reviews.map(({ name, feedback }, index) => (
          <div
            key={index}
            className="bg-rose-800 p-4 shadow-md rounded-lg text-center hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <div className="flex justify-center mb-2">
              <FaQuoteLeft className="text-3xl text-white mt-2" />
            </div>
            <p className="text-lg pt-2">{feedback}</p>
            <h4 className="text-3xl font-bold mt-4">{name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
