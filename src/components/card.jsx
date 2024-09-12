// components/ProductCard.js
import React, { useState } from "react";

const ProductCard = () => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-black text-white p-6 rounded-lg shadow-lg">
      <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-6">
        <img
          src="/path/to/headphones-image.jpg"
          alt="Product Image"
          className="w-full rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Product Name</h2>
          <p className="mb-2">Description</p>
          <p className="mb-4">Specifications</p>
          <div className="flex items-center mb-4">
            <span className="text-yellow-400 mr-2">★★★★★</span>
            <span>Rating & Reviews</span>
          </div>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            convallis mauris et purus gravida, ac tristique odio malesuada.
            Integer id tortor vel velit posuere malesuada. Sed et quam vel
            ligula tristique lacinia. Proin nec augue at justo fringilla
            gravida. Quisque vel est id purus condimentum commodo vel non magna.
            Sed nec mi nec nisi feugiat lacinia.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={decrementQuantity}
              className="bg-gray-700 px-3 py-1 rounded-lg"
            >
              -
            </button>
            <span className="mx-3">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="bg-gray-700 px-3 py-1 rounded-lg"
            >
              +
            </button>
          </div>
          <p className="text-2xl font-bold">$99.99</p>
        </div>
        <div className="flex mt-6">
          <button className="bg-orange-500 px-6 py-2 rounded-lg mr-2">
            Add to Cart
          </button>
          <button className="bg-orange-500 px-6 py-2 rounded-lg mr-2">
            Track Price
          </button>
          <button className="bg-orange-600 px-6 py-2 rounded-lg">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
