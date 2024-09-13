import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: string;
  title: string;
  image: string;
  price: string;
  rating: string;
  url: string;
}

const TrendingProducts: React.FC = () => {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/products/trending"
        );
        setTrendingProducts(response.data);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div className="mt-10 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Trending Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {trendingProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center transition-transform hover:scale-105"
          >
            <img
              className="object-contain w-full h-48 mb-4"
              src={product.image}
              alt={product.title}
            />
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              <p className="text-red-600 text-xl font-bold mb-2">
                {product.price}
              </p>
              <p className="text-gray-600 mb-4">Rating: {product.rating} ★</p>
              <button
                onClick={() =>
                  window.open(product.url, "_blank", "noopener noreferrer")
                }
                className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg w-full"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
