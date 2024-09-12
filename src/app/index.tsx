// import { useEffect, useState } from "react";
// import axios from "axios";
// import AdBanner from "@/components/Adbanner";
// import Loading from "@/components/Loading";
// // import Loading from "@/components/Loading";
// export default function Home() {
//   const [Title, setTitle] = useState("");
//   const [url, setUrl] = useState("");
//   const [scrapData, setScrapData] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isloading, setIsloading] = useState(true);

//   const productData = async () => {
//     const resp = await axios.get("http://localhost:3030/product/B00176F2BS");
//     setTitle(resp.data.name);
//   };
//   const [contentVisible, setContentVisible] = useState(false);
//   const scrapDataa = async (e: any) => {
//     setIsLoading(true);
//     e.preventDefault();
//     const scrapData = await axios.post("http://localhost:3030/scrapData", {
//       url,
//     });
//     setIsLoading(false);
//     setScrapData(scrapData.data);
//     setContentVisible(true);
//     console.log("scrapData::", scrapData.data);
//   };
//   useEffect(() => {
//     setTimeout(() => {
//       setIsloading(false);
//     }, 2000);
//   }, []);

//   return (
//     <main className="container">
//       {isloading ? (
//         <Loading />
//       ) : (
//         <div className="bg-blue-100 pt-10 h-screen flex flex-col items-center gap-6 px-10">
//           <form>
//             <label
//               htmlFor="default-search"
//               className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
//             >
//               Search
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <svg
//                   className="w-4 h-4 text-gray-500 dark:text-gray-400"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="search"
//                 id="default-search"
//                 value={url}
//                 onChange={(e) => {
//                   setUrl(e.target.value);
//                 }}
//                 className="block w-[40rem] p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 placeholder="Enter the Amazon product link..."
//                 required
//               />
//               <button
//                 type="submit"
//                 onClick={scrapDataa}
//                 className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//               >
//                 Search
//               </button>
//             </div>
//           </form>
//           <div className="box flex justify-between w-screen p-10">
//             <div className="left adsesne  bg-white min-w-[150px] h-full mt-5 relative">
//               <AdBanner
//                 data-ad-slot="1566962684"
//                 data-ad-format="auto"
//                 data-full-width-responsive="true"
//               />
//             </div>
//             {isLoading ? (
//               <div className="lds-hourglass"></div>
//             ) : (
//               <div
//                 className={`information ${
//                   contentVisible ? "block" : "hidden"
//                 } flex flex-col justify-start gap-4 px-10 max-w-4xl`}
//               >
//                 <img
//                   className="mix-blend-multiply mx-auto min-h-[25vh] max-h-[30vh]"
//                   src={scrapData.image}
//                   alt="product_image"
//                 />
//                 <div className="title font-bold text-lg">{scrapData.name}</div>
//                 <div className="rating flex items-center gap-6">
//                   <div className="star bg-green-600 px-2 py-1 rounded-md font-bold">
//                     {scrapData.rating} ☆
//                   </div>
//                   <div className="review text-sm">
//                     ({scrapData.review} ratings)
//                   </div>
//                 </div>
//                 <div className="text-2xl font-bold">{scrapData.price}</div>
//               </div>
//             )}
//             <div className="right adsesne  bg-white min-w-[150px] h-full mt-5 relative">
//               <AdBanner
//                 data-ad-slot="1566962684"
//                 data-ad-format="auto"
//                 data-full-width-responsive="true"
//               />
//             </div>{" "}
//           </div>
//           <AdBanner
//             data-ad-slot="3080227042"
//             data-ad-format="auto"
//             data-full-width-responsive="true"
//           />
//         </div>
//       )}
//     </main>
//   );
// }
