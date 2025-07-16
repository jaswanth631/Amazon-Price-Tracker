import { NextRequest, NextResponse } from 'next/server';
import Product from '../../../lib/models/product.model';
import { connectToDB } from '../../../lib/mongoose';

export async function GET(req: NextRequest, { params }: { params: { asin: string } }) {
  await connectToDB();
  const { asin } = params;
  console.log(`[API] GET /api/product/${asin}`);
  try {
    const product = await Product.findOne({ asin });
    if (!product) {
      console.log(`[API] Product not found for ASIN: ${asin}`);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    console.log(`[API] Product found for ASIN: ${asin}`);
    return NextResponse.json(product);
  } catch (error: any) {
    console.log(`[API] Error fetching product for ASIN: ${asin}`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 