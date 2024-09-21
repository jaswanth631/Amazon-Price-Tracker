interface ProductDetailsProps {
  scrapData: any;
  setPriceAlert: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  scrapData,
  setPriceAlert,
}) => {
  return (
    <div
      className={`information mt-2 block pt-10 flex-col items-center gap-10 px-20 py-20 max-h-5`} // Change max-width here
    >
      <div className="flex flex-col md:flex-row items-center bg-white shadow-lg p-10 rounded-lg w-full ">
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
          <div className="title Roboto text-xl font-bold">
            {scrapData.title}
          </div>

          {/* Price */}
          <div className="flex justify-between mt-2">
            <div className="text-3xl font-bold text-red-600">
              {scrapData.price}
            </div>
          </div>

          {/* Rating */}
          <div className="rating flex items-center gap-2 mt-2">
            <div className="star bg-yellow-400 px-2 py-1 rounded-md font-bold">
              {scrapData.rating} ☆
            </div>
            <div className="review text-sm text-gray-600">
              ({scrapData.reviewCount} ratings )
            </div>
          </div>

          {/* Price History */}
          <div className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="price-info bg-gray-100 p-2 rounded-md text-center">
                <div className="text-sm">Current Price</div>
                <div className="font-bold">{scrapData.price}</div>
              </div>
              <div className="price-info bg-gray-100 p-2 rounded-md text-center">
                <div className="text-sm">Highest Price</div>
                <div className="font-bold">
                  {scrapData.currency}
                  {scrapData.originalPrice}.00
                </div>
              </div>
              <div className="price-info bg-gray-100 p-2 rounded-md text-center">
                <div className="text-sm">Average Price</div>
                <div className="font-bold">{scrapData.price}</div>
              </div>
              <div className="price-info bg-gray-100 p-2 rounded-md text-center">
                <div className="text-sm">Lowest Price</div>
                <div className="font-bold">{scrapData.price}</div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="gap-2 text-sm text-green-600">
            93% of buyers have recommended this.
          </div>
          <div className="grid grid-cols-2 mt-2 ">
            <button
              type="button"
              className="mt-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() =>
                window.open(scrapData.url, "_blank", "noopener noreferrer")
              }
            >
              Buy on Amazon
            </button>
            <button
              type="button"
              className="mt-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={setPriceAlert}
            >
              Set Price Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
