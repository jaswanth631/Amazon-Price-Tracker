'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracked = async () => {
      setLoading(true);
      setError(null);
      try {
        // Placeholder: fetch all products (replace with user-specific API when auth is added)
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load tracked products.');
      } finally {
        setLoading(false);
      }
    };
    fetchTracked();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Dashboard</h1>
      {loading && <p className="text-center text-gray-500">Loading your tracked products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 && <p className="text-gray-500 col-span-full">No tracked products yet.</p>}
          {products.map((product, idx) => (
            <div key={product._id || idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <img src={product.imageUrl || product.image} alt={product.title || product.name} className="w-32 h-32 object-contain mb-2" />
              <h3 className="font-semibold mb-1 text-center">{product.title || product.name}</h3>
              <div className="text-blue-600 font-bold text-lg mb-1">{product.currency} {product.currentPrice}</div>
              <a href={product.productUrl || product.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline">View on Amazon</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 