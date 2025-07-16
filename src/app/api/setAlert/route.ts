import { NextRequest, NextResponse } from 'next/server';
import Product from '../../../../lib/models/product.model';
import { connectToDB } from '../../../../lib/mongoose';

export async function POST(req: NextRequest) {
  console.log('[API] POST /api/setAlert called');
  try {
    const { url, email, targetPrice, alertType, notificationChannel } = await req.json();
    
    if (!url || !email || !targetPrice) {
      return NextResponse.json({ error: 'URL, email, and target price are required' }, { status: 400 });
    }

    await connectToDB();

    // Find the product by URL or ASIN
    const product = await Product.findOne({ 
      $or: [{ productUrl: url }, { asin: url }] 
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Add the alert to the product
    const newAlert = {
      targetPrice: parseFloat(targetPrice),
      alertType: alertType || 'priceDrop',
      notificationChannel: notificationChannel || 'email',
      isActive: true,
      createdAt: new Date(),
    };

    product.alerts.push(newAlert);
    await product.save();

    console.log(`[API] Alert set for product: ${product.asin}`);
    return NextResponse.json({ 
      message: 'Price alert set successfully',
      productId: product._id 
    });
  } catch (error: any) {
    console.log('[API] Error in /api/setAlert:', error);
    return NextResponse.json({ error: 'Failed to set price alert' }, { status: 500 });
  }
} 