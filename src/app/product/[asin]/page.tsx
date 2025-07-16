'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ProductDetailsPage({ params }: { params: { asin: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/product/${params.asin}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.asin]);

  let chartData = { labels: [], datasets: [] };
  if (product && product.priceHistory) {
    chartData = {
      labels: product.priceHistory.map((item: any) => item.timestamp || item.date),
      datasets: [
        {
          label: 'Price History',
          data: product.priceHistory.map((item: any) => item.price),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Details</h1>
      {loading && <p className="text-center text-gray-500">Loading product...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && product && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            <img src={product.imageUrl || product.image} alt={product.title || product.name} className="w-48 h-48 object-contain mx-auto" />
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.title || product.name}</h2>
              <div className="mb-2 text-blue-600 font-bold text-xl">{product.currency} {product.currentPrice}</div>
              <div className="mb-2 text-green-600">Lowest: {product.currency} {product.lowestPriceEver || product.lowestPrice}</div>
              <div className="mb-2 text-red-600">Highest: {product.currency} {product.highestPriceEver || product.highestPrice}</div>
              <div className="mb-2">ASIN: <span className="font-mono">{product.asin}</span></div>
              <div className="mb-2">Marketplace: {product.marketplace}</div>
              <div className="mb-2">Availability: <span className={product.isAvailable ? 'text-green-600' : 'text-red-600'}>{product.isAvailable ? 'In Stock' : 'Out of Stock'}</span></div>
              <a href={product.productUrl || product.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View on Amazon</a>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Price History</h3>
            <div className="h-[300px]">
              <Line data={chartData} />
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Set Price/Availability Alert</h3>
            <p className="text-gray-500">(Alert form coming soon...)</p>
          </div>
        </div>
      )}
    </div>
  );
} 