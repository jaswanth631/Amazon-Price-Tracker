import React from "react";

// Example Product Data Interface
interface Product {
  id: string;
  currency: string;
  image: string;
  title: string;
  price: string;
  currentPrice: string; // New field for highest price
  originalPrice: string; // New field for lowest price
  rating: number;
  reviewCount: number;
  url: string;
}

interface TrendingProductsProps {
  products: Product[];
}

const TrendingProducts: React.FC<TrendingProductsProps> = ({ products }) => {
  return (
    <div id="trending-products" className="bg-navy-blue py-10 px-5">
      <h2 className="text-3xl font-bold text-white mb-6">Trending Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.slice(0, 20).map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300"
          >
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              {/* Product Image */}
              <div className="w-full h-64 bg-white rounded-lg mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {product.title}
                </h3>

                {/* Price */}
                <div className="flex justify-between mt-2">
                  <div className="flex flex-col">
                    <p className="text-xl font-bold text-red-500">
                      {product.price}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="text-green-500 font-serif">
                        Lowest Price
                      </span>
                      <span className="text-green-500 ml-2">
                        {" "}
                        {product.price} ⤵
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="text-red-500 font-serif">
                        Highest Price
                      </span>
                      <span className="text-red-500 ml-2">
                        {" "}
                        {product.currency}
                        {product.originalPrice}.00 ⤴
                      </span>
                    </p>
                  </div>
                </div>
                {/* Rating */}
                <div className="flex items-center mt-1">
                  <div className="star bg-yellow-400 px-2 py-1 rounded-md font-bold text-sm">
                    {product.rating} ☆
                  </div>
                </div>
                {/* View Product Button */}
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  <button className="mt-3 bg-blue-600 text-white font-bold py-1 px-4 rounded transition duration-300 hover:bg-blue-700">
                    View Product
                  </button>
                </a>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
