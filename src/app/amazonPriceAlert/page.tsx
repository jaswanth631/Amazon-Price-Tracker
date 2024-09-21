"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchForm from "@/components/SearchForm";
import ProductDetails from "@/components/ProductDetails";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import TrendingProducts from "@/components/card";
interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  rating: number;
  reviewCount: number;
  url: string;
}
export default function Home() {
  const [url, setUrl] = useState("");
  const [scrapData, setScrapData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isloading, setIsloading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const scrapDataa = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/scrapData", {
        url,
      });
      setScrapData(response.data);
      console.log("Response", response.data);
      setContentVisible(true);
    } catch (error) {
      console.error("Error scraping data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setPriceAlert = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/products/save",
        scrapData
      );

      if (response.status === 201) {
        setPopupMessage("Price alert set successfully!");
        setIsPopupVisible(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setPopupMessage("You have already set a price alert for this product.");
        setIsPopupVisible(true);
      } else {
        console.error("Error setting price alert:", error);
      }
    }
  };

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/get-product");
        setTrendingProducts(response.data);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingProducts();
    setTimeout(() => {
      setIsloading(false);
    }, 2000);
  }, []);

  const bounceAnimation = {
    animation: isLoading ? "bounce 1s infinite" : "none",
  };

  return (
    <>
      <main className={`container ${isPopupVisible ? "blur-md" : ""}`}>
        {isloading ? (
          <Loading />
        ) : (
          <div className="pt-10 h-screen flex flex-col items-center gap-10 px-15">
            <SearchForm
              scrapDataa={scrapDataa}
              url={url}
              setUrl={setUrl}
              isLoading={isLoading}
            />
            {isLoading ? (
              <div style={bounceAnimation} className="lds-hourglass"></div>
            ) : (
              contentVisible && (
                <ProductDetails
                  scrapData={scrapData}
                  setPriceAlert={setPriceAlert}
                />
              )
            )}
          </div>
        )}
        <div className="bg-navy-blue min-h-screen p-10">
          {isLoading ? (
            <div className="text-center text-white">Loading...</div>
          ) : (
            <TrendingProducts products={trendingProducts} />
          )}
        </div>
        {showProductDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <ProductDetails
              scrapData={scrapData}
              setPriceAlert={setPriceAlert}
              onClose={() => setShowProductDetails(false)}
            />
          </div>
        )}
      </main>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold text-gray-800 font-mono">
              {popupMessage}
            </p>
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => setIsPopupVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </>
  );
}
