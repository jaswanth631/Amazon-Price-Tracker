import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">About Amazon Price Tracker</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="mb-4">Amazon Price Tracker helps you monitor product prices, set alerts, and find the best deals on Amazon. Track any product, view price history, and get notified when prices drop or items are back in stock.</p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Track Amazon products by URL or ASIN</li>
          <li>View interactive price history charts</li>
          <li>Set up price drop and availability alerts</li>
          <li>Discover trending deals and lightning offers</li>
        </ul>
      </div>
    </div>
  );
} 