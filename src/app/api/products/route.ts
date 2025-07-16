import { NextRequest, NextResponse } from 'next/server';
import Product from '../../../../lib/models/product.model';
import { connectToDB } from '../../../../lib/mongoose';

export async function GET(req: NextRequest) {
  await connectToDB();
  console.log('[API] GET /api/products');
  try {
    const products = await Product.find();
    console.log(`[API] Returning ${products.length} products`);
    return NextResponse.json(products);
  } catch (error: any) {
    console.log('[API] Error fetching products', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 