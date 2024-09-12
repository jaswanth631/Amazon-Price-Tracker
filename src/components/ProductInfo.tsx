import React from 'react';

const ProductInfo = ({ scrapData, contentVisible }) => {
  return (
    <div
      className={`information mt-2 ${
        contentVisible ? 'block' : 'hidden'
      } flex flex-col h-full max-w-4xl`}
    >
      <div className="flex flex-col md:flex-row items-center bg-white shadow-lg p-4 rounded-lg">
        {/* Product Image */}
        <div className="flex-initial w-auto md:w-1/3">
          <img
            className="object-contain"
            src={scrapData.image}
            alt="product_image"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-initial w-full md:w-2/3 mt-4 md:mt-0 md:ml-6">
          {/* Title */}
          <div className="text-xl font-bold">{scrapData.name}</div>

          {/* Price */}
          <div className="flex justify-between mt-2">
            <div className="text-3xl font-bold text-red-600">
              ₹{scrapData.price}
            </div>
            <div className="line-through text-gray-500">
              ₹{scrapData.originalPrice}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-yellow-400 px-2 py-1 rounded-md font-bold">
              {scrapData.rating} ☆
            </div>
            <div className="text-sm text-gray-600">
              ({scrapData.review} ratings)
            </div>
          </div>

          {/* Price History */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'Current Price', value: scrapData.price },
              { label: 'Average Price', value: scrapData.averagePrice },
              { label: 'Highest Price', value: scrapData.highestPrice },
              { label: 'Lowest Price', value: scrapData.lowestPrice },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 p-2 rounded-md text-center"
              >
                <div className="text-sm">{item.label}</div>
                <div className="font-bold">₹{item.value}</div>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="mt-2 text-sm text-green-600">
            93% of buyers have recommended this.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
