"use client";
import axios from "axios";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [scrapData, setScrapData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isloading, setIsloading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

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
        alert("Price alert set successfully!");
      }
    } catch (error) {
      console.error("Error setting price alert:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsloading(false);
    }, 2000);
  }, []);

  return (
    <>
      <main className="container">
        {isloading ? (
          <Loading />
        ) : (
          <div className="bg-white pt-10 h-screen flex flex-col items-center gap-6 px-10">
            <form>
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <div className="w-full mt-9">
                  <input
                    type="search"
                    id="default-search"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="block w-[40rem] p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter the Amazon product link..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  onClick={scrapDataa}
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
              </div>
            </form>
            <div className="">
              {isLoading ? (
                <div className="lds-hourglass"></div>
              ) : (
                <div
                  className={`information mt-2 ${
                    contentVisible ? "block" : "hidden"
                  } pt-10 h-screen flex flex-col items-center gap-10 px-20 py-20   mt-5 max-w-5xl`}
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
                            <div className="font-bold">
                              {scrapData.currency}
                              {scrapData.currentPrice}
                            </div>
                          </div>
                          <div className="price-info bg-gray-100 p-2 rounded-md text-center">
                            <div className="text-sm">Highest Price</div>
                            <div className="font-bold">
                              {scrapData.currency}
                              {scrapData.originalPrice}
                            </div>
                          </div>
                          <div className="price-info bg-gray-100 p-2 rounded-md text-center">
                            <div className="text-sm">Average Price</div>
                            <div className="font-bold">
                              {scrapData.currency}
                              {scrapData.currentPrice}
                            </div>
                          </div>
                          <div className="price-info bg-gray-100 p-2 rounded-md text-center">
                            <div className="text-sm">Lowest Price</div>
                            <div className="font-bold">
                              {scrapData.currency}
                              {scrapData.currentPrice}
                            </div>
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
                            window.open(
                              scrapData.url,
                              "_blank",
                              "noopener noreferrer"
                            )
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
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
