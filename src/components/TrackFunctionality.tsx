import { useState } from "react";
import axios from "axios";

const ProductPage = ({ product }: { product: any }) => {
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = async () => {
    setIsTracking(true);

    try {
      const response = await axios.post("/api/track-product", {
        productId: "B08PPL3ZM8", // The extracted productId
        price: product.currentPrice, // Current price to be saved
      });

      if (response.status === 200) {
        alert("Product tracked successfully!");
      }
    } catch (error) {
      console.error("Error tracking product:", error);
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <>
      <div className="flex justify-between">
        {" "}
        {/* Changed from `justify-left` to `justify-between` */}
        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Buy on Amazon
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Set Price Alert
        </button>
      </div>
  
    </>
  );
};

export default ProductPage;
