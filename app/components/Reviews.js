import { reviews } from "../constants/index";

const Reviews = () => {
  return (
    <section className="py-8" id="reviews">
      <h2 className="text-4xl font-bold text-center mb-8">Reviews</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {reviews.map(({ name, feedback }, index) => (
          <div
            key={index}
            className="bg-rose-800 p-4 shadow-md rounded-lg text-center"
          >
            <p className="text-lg">{`"${feedback}"`}</p>
            <h4 className="mt-4 font-bold text-xl">{name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
