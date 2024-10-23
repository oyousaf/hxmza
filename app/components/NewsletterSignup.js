const NewsletterSignup = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
  };

  return (
    <section className="p-8 bg-rose-600 text-center rounded-lg" id="newsletter">
      <h2 className="text-4xl font-bold text-center mb-4">
        Subscribe to Our Newsletter
      </h2>
      <p className="mb-4">Stay updated with our latest car offerings.</p>
      <form id="newsletter" name="newsletter" onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <input
          type="email"
          placeholder="Enter email"
          className="p-3 w-full sm:w-auto sm:flex-1 rounded-l-lg border-none text-black"
          required
        />
        <button type="submit" className="p-3 w-full sm:w-auto bg-rose-800 text-white rounded-r-lg">
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default NewsletterSignup;
