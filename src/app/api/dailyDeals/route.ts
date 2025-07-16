import { NextRequest, NextResponse } from 'next/server';
import Product from '../../../../lib/models/product.model';
import { connectToDB } from '../../../../lib/mongoose';

export async function GET(req: NextRequest) {
  console.log('[API] GET /api/dailyDeals called');
  try {
    await connectToDB();

    // Check if we have any products in the database
    const totalProducts = await Product.countDocuments();
    console.log(`[API] Total products in database: ${totalProducts}`);

    if (totalProducts === 0) {
      console.log('[API] No products in database, returning empty deals');
      return NextResponse.json({ 
        lightningDeals: [], 
        topDrops: [],
        message: 'No products tracked yet. Start tracking products to see deals!'
      });
    }

    // 1. Products with active lightning deals (more flexible query)
    let lightningDeals = [];
    try {
      lightningDeals = await Product.find({
        $or: [
          { 'lightningDeals.0': { $exists: true } },
          { discountRate: { $gt: 0 } }
        ]
      }).sort({ discountRate: -1, currentPrice: 1 }).limit(12);
      console.log(`[API] Found ${lightningDeals.length} lightning deals`);
    } catch (error) {
      console.log('[API] Error fetching lightning deals:', error);
      lightningDeals = [];
    }

    // 2. Products with largest price drops in last 7 days (more flexible)
    let topDrops = [];
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      // Get all products with price history
      const allProducts = await Product.find({ 
        $or: [
          { 'priceHistory.1': { $exists: true } },
          { 'priceHistory': { $exists: true, $ne: [] } }
        ]
      });
      
      console.log(`[API] Found ${allProducts.length} products with price history`);

      const drops = allProducts.map(product => {
        try {
          const history = product.priceHistory || [];
          if (history.length < 2) {
            // If not enough history, use current price vs original price
            const currentPrice = product.currentPrice || 0;
            const originalPrice = product.highestPrice || currentPrice;
            const absDrop = originalPrice - currentPrice;
            const pctDrop = originalPrice > 0 ? (absDrop / originalPrice) * 100 : 0;
            return { product, absDrop, pctDrop };
          }

          // Find price 7 days ago (or closest before)
          const recent = history.filter((h: any) => {
            const date = h.date || h.timestamp;
            return new Date(date) >= sevenDaysAgo;
          });
          
          const oldestRecent = recent.length > 0 ? recent[0] : history[0];
          const latest = history[history.length - 1];
          
          const oldPrice = oldestRecent ? oldestRecent.price : latest.price;
          const newPrice = latest.price;
          const absDrop = oldPrice - newPrice;
          const pctDrop = oldPrice > 0 ? (absDrop / oldPrice) * 100 : 0;
          
          return { product, absDrop, pctDrop };
        } catch (error) {
          console.log(`[API] Error processing product ${product.asin}:`, error);
          return null;
        }
      }).filter(d => d && d.absDrop > 0);

      // Sort by percentage drop, then absolute drop
      drops.sort((a, b) => b.pctDrop - a.pctDrop || b.absDrop - a.absDrop);
      topDrops = drops.slice(0, 12).map(d => ({ 
        ...d.product.toObject(), 
        absDrop: d.absDrop, 
        pctDrop: d.pctDrop 
      }));
      
      console.log(`[API] Found ${topDrops.length} top drops`);
    } catch (error) {
      console.log('[API] Error fetching top drops:', error);
      topDrops = [];
    }

    // 3. If no deals found, return some recent products as fallback
    if (lightningDeals.length === 0 && topDrops.length === 0) {
      console.log('[API] No deals found, returning recent products as fallback');
      const recentProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .lean();
      
      return NextResponse.json({ 
        lightningDeals: recentProducts, 
        topDrops: [],
        message: 'No deals found. Here are some recently tracked products!'
      });
    }

    console.log(`[API] Successfully returning ${lightningDeals.length} lightning deals and ${topDrops.length} top drops`);
    return NextResponse.json({ lightningDeals, topDrops });
  } catch (error: any) {
    console.log('[API] Error in /api/dailyDeals:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch daily deals',
      details: error.message,
      lightningDeals: [], 
      topDrops: []
    }, { status: 500 });
  }
} 