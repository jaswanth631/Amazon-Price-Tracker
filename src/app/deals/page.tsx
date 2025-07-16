'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DealsPage() {
  const [deals, setDeals] = useState<{ lightningDeals: any[]; topDrops: any[] }>({ lightningDeals: [], topDrops: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/dailyDeals');
        setDeals(response.data);
      } catch (err) {
        setError('Failed to load deals.');
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Deals</h1>
      {loading && <p className="text-center text-gray-500">Loading deals...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Lightning Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {deals.lightningDeals.length === 0 && <p className="text-gray-500 col-span-full">No lightning deals to display.</p>}
            {deals.lightningDeals.map((deal, idx) => (
              <div key={deal._id || idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <img src={deal.imageUrl || deal.image} alt={deal.title || deal.name} className="w-32 h-32 object-contain mb-2" />
                <h3 className="font-semibold mb-1 text-center">{deal.title || deal.name}</h3>
                <div className="text-blue-600 font-bold text-lg mb-1">{deal.currency} {deal.currentPrice}</div>
                <div className="text-green-600 text-sm mb-1">{deal.lightningDeals?.[0]?.discount || 0}% off</div>
                <a href={deal.productUrl || deal.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline">View on Amazon</a>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-semibold mb-4">Top Price Drops (7 days)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.topDrops.length === 0 && <p className="text-gray-500 col-span-full">No top price drops to display.</p>}
            {deals.topDrops.map((drop, idx) => (
              <div key={drop._id || idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <img src={drop.imageUrl || drop.image} alt={drop.title || drop.name} className="w-32 h-32 object-contain mb-2" />
                <h3 className="font-semibold mb-1 text-center">{drop.title || drop.name}</h3>
                <div className="text-blue-600 font-bold text-lg mb-1">{drop.currency} {drop.currentPrice}</div>
                <div className="text-red-600 text-sm mb-1">Drop: {drop.currency} {drop.absDrop?.toFixed(2)} ({drop.pctDrop?.toFixed(1)}%)</div>
                <a href={drop.productUrl || drop.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline">View on Amazon</a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
} 