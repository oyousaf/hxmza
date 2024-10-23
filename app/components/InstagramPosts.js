import { useState, useEffect } from "react";

import { mockData } from "../constants/index";

const InstagramPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(mockData);
  }, []);

  return (
    <section className="py-8" id="instagram">
      <h2 className="text-4xl font-bold text-center mb-8">Latest Cars</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center px-4 lg:px-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-rose-800 hover:bg-rose-600 p-4 shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out">
            <h3 className="text-xl font-bold">{post.title}</h3>
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-auto mt-4 rounded"
            />
            <p className="mt-2">{post.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramPosts;
