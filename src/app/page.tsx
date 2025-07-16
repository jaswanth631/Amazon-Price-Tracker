'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useForm as useAlertForm } from 'react-hook-form';
import { zodResolver as alertZodResolver } from '@hookform/resolvers/zod';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

interface PriceHistory {
  date: string;
  price: number;
  currency: string;
}

interface LightningDeal {
  startTime: Date;
  endTime: Date;
  price: number;
  discount: number;
  currency: string;
}

interface Coupon {
  code: string;
  description: string;
  discount: number;
  expiryDate: Date;
}

interface ProductData {
  url: string;
  name: string;
  image: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  currency: string;
  priceHistory: PriceHistory[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  lightningDeals: LightningDeal[];
  coupons: Coupon[];
}

// Zod schema for Amazon URL or ASIN
const productInputSchema = z.object({
  input: z.string().min(5, 'Please enter a valid Amazon URL or ASIN').refine(
    (val) => {
      // Basic check for Amazon URL or 10-char ASIN
      return (
        /^https?:\/\/(www\.)?amazon\./.test(val) || /^[A-Z0-9]{10}$/.test(val)
      );
    },
    { message: 'Enter a valid Amazon product URL or ASIN' }
  ),
});

type ProductInput = z.infer<typeof productInputSchema>;

const alertSchema = z.object({
  email: z.string().email('Enter a valid email'),
  targetPrice: z.number().min(0.01, 'Target price must be positive'),
  alertType: z.enum(['priceDrop', 'availability']),
  notificationChannel: z.enum(['email', 'pushNotification']),
});

type AlertInput = z.infer<typeof alertSchema>;

// Define types for the daily deals
interface DailyDeal {
  _id: string;
  asin: string;
  title: string;
  imageUrl: string;
  currentPrice: number;
  currency: string;
  lightningDeals?: Array<{
    price: number;
    discount: number;
    endTime: string;
  }>;
  absDrop?: number;
  pctDrop?: number;
}

interface DailyDealsData {
  lightningDeals: DailyDeal[];
  topDrops: DailyDeal[];
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertEmail, setAlertEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [dailyDeals, setDailyDeals] = useState<DailyDealsData>({ lightningDeals: [], topDrops: [] });
  const [timeRange, setTimeRange] = useState<'1w' | '1m' | '3m' | '1y' | 'all'>('all');
  const [dealsLoading, setDealsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductInput>({
    resolver: zodResolver(productInputSchema),
  });

  const {
    register: alertRegister,
    handleSubmit: handleAlertSubmit,
    formState: { errors: alertErrors },
    reset: resetAlert,
  } = useAlertForm<AlertInput>({
    resolver: alertZodResolver(alertSchema),
  });

  useEffect(() => {
    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      fetchDailyDeals();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchDailyDeals = async () => {
    setDealsLoading(true);
    try {
      console.log('[Frontend] Fetching daily deals...');
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/dailyDeals`;
      console.log('[Frontend] Requesting URL:', url);
      
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('[Frontend] Daily deals response:', response.data);
      setDailyDeals(response.data);
    } catch (error: any) {
      console.error("[Frontend] Error fetching daily deals:", error);
      console.error("[Frontend] Error details:", error.response?.data || error.message);
      console.error("[Frontend] Error status:", error.response?.status);
      console.error("[Frontend] Error config:", error.config);
      // Set empty deals but don't show error to user since it's not critical
      setDailyDeals({ lightningDeals: [], topDrops: [] });
    } finally {
      setDealsLoading(false);
    }
  };

  const fetchProductData = async (data: ProductInput) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/scrapData", { url: data.input });
      setProductData(response.data);
      reset();
    } catch (error) {
      setError("Failed to fetch product data. Please check the URL/ASIN and try again.");
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  const setPriceAlert = async (data: AlertInput) => {
    if (!productData) return;
    try {
      await axios.post('/api/setAlert', {
        url: productData.url,
        email: data.email,
        targetPrice: data.targetPrice,
        alertType: data.alertType,
        notificationChannel: data.notificationChannel,
      });
      alert('Price alert set successfully!');
      resetAlert();
    } catch (error) {
      console.error('Error setting price alert:', error);
      alert('Failed to set price alert');
    }
  };

  const getFilteredPriceHistory = () => {
    if (!productData?.priceHistory) return [];
    const now = new Date();
    let cutoff: Date | null = null;
    switch (timeRange) {
      case '1w':
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3m':
        cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoff = null;
    }
    return cutoff
      ? productData.priceHistory.filter(item => new Date(item.date) >= cutoff)
      : productData.priceHistory;
  };

  const filteredHistory = getFilteredPriceHistory();
  const chartData = {
    labels: filteredHistory.map(item => item.date),
    datasets: [
      {
        label: 'Price History',
        data: filteredHistory.map(item => item.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 7,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Price History',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Price: ${context.parsed.y}`;
          }
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy' as 'x' | 'y' | 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy' as 'x' | 'y' | 'xy',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Amazon Price Tracker</h1>

        {/* Product Search Section - Moved to top */}
        <section className="mb-12">
          <form onSubmit={handleSubmit(fetchProductData)} className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                {...register('input')}
                className="w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Amazon product URL or ASIN..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Loading...' : 'Track'}
              </button>
            </div>
            {errors.input && (
              <p className="text-red-500 text-sm mt-2">{errors.input.message}</p>
            )}
          </form>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
              {error}
            </div>
          )}
        </section>

        {/* Daily Deals Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Today's Best Deals</h2>
          {dealsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Loading deals...</p>
            </div>
          ) : dailyDeals.lightningDeals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-4">
                No deals found yet. Start tracking products to see amazing deals!
              </p>
              <p className="text-gray-400 text-sm">
                Use the search bar above to track your first Amazon product.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dailyDeals.lightningDeals.map((deal: DailyDeal, index: number) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-4">
                  <img src={deal.imageUrl} alt={deal.title} className="w-full h-48 object-contain mb-4" />
                  <h3 className="font-semibold mb-2">{deal.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">{deal.currency} {deal.currentPrice}</span>
                    <span className="text-sm text-green-600">
                      {deal.lightningDeals?.[0]?.discount || deal.pctDrop || 0}% off
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Product Display Section */}
        {productData && (
          <section className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <img
                    src={productData.image}
                    alt={productData.name}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-4">{productData.name}</h1>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Current Price:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {productData.currency} {productData.currentPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Lowest Price:</span>
                      <span className="text-xl font-semibold text-green-600">
                        {productData.currency} {productData.lowestPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Highest Price:</span>
                      <span className="text-xl font-semibold text-red-600">
                        {productData.currency} {productData.highestPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Rating:</span>
                      <span className="text-xl font-semibold">
                        {productData.rating} ⭐ ({productData.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Availability:</span>
                      <span className={`text-xl font-semibold ${productData.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {productData.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Alert Form */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Set Price Alert</h2>
                <form onSubmit={handleAlertSubmit(setPriceAlert)} className="flex flex-wrap gap-4 items-end">
                  <input
                    type="email"
                    {...alertRegister('email')}
                    placeholder="Enter your email"
                    className="flex-1 p-2 border rounded"
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      step="0.01"
                      {...alertRegister('targetPrice', { valueAsNumber: true })}
                      placeholder="Target price"
                      className="w-32 p-2 border rounded"
                    />
                    <span className="p-2 text-gray-600">{productData.currency}</span>
                  </div>
                  <select {...alertRegister('alertType')} className="p-2 border rounded">
                    <option value="priceDrop">Price Drop</option>
                    <option value="availability">Availability</option>
                  </select>
                  <select {...alertRegister('notificationChannel')} className="p-2 border rounded">
                    <option value="email">Email</option>
                    <option value="pushNotification">Push Notification</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Set Alert
                  </button>
                  <div className="w-full">
                    {alertErrors.email && <p className="text-red-500 text-sm mt-2">{alertErrors.email.message}</p>}
                    {alertErrors.targetPrice && <p className="text-red-500 text-sm mt-2">{alertErrors.targetPrice.message}</p>}
                    {alertErrors.alertType && <p className="text-red-500 text-sm mt-2">{alertErrors.alertType.message}</p>}
                    {alertErrors.notificationChannel && <p className="text-red-500 text-sm mt-2">{alertErrors.notificationChannel.message}</p>}
                  </div>
                </form>
              </div>

              {/* Lightning Deals */}
              {productData?.lightningDeals?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Lightning Deals</h2>
                  <div className="space-y-4">
                    {productData.lightningDeals.map((deal, index) => (
                      <div key={index} className="bg-yellow-50 p-4 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">Deal Price: {deal.currency} {deal.price}</div>
                            <div className="text-green-600">{deal.discount}% off</div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Ends: {new Date(deal.endTime).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Coupons */}
              {productData?.coupons?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Available Coupons</h2>
                  <div className="space-y-4">
                    {productData.coupons.map((coupon, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{coupon.code}</div>
                            <div className="text-sm">{coupon.description}</div>
                          </div>
                          <div className="text-green-600 font-bold">
                            {coupon.discount}% off
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price History Chart */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Price History</h2>
                <div className="flex gap-4 mb-2">
                  {['1w', '1m', '3m', '1y', 'all'].map(range => (
                    <button
                      key={range}
                      className={`px-3 py-1 rounded ${timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => setTimeRange(range as any)}
                    >
                      {range === '1w' ? '1W' : range === '1m' ? '1M' : range === '3m' ? '3M' : range === '1y' ? '1Y' : 'All'}
                    </button>
                  ))}
                </div>
                <div className="h-[400px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 