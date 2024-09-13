"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchForm from "@/components/SearchForm";
import ProductDetails from "@/components/ProductDetails";
import Loading from "@/components/Loading";

export default function Home() {
  const [url, setUrl] = useState("");
  const [scrapData, setScrapData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isloading, setIsloading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  const scrapDataa = async (e: any) => {
    setIsLoading(true); // Start loading animation
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
      setIsLoading(false); // Stop loading animation
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
          <div className=" pt-10 h-screen flex flex-col items-center gap-10 px-15">
            <SearchForm
              scrapDataa={scrapDataa}
              url={url}
              setUrl={setUrl}
              isLoading={isLoading} // Pass loading state to the form
            />
            {isLoading ? (
              <div className="lds-hourglass"></div>
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
      </main>
    </>
  );
}
