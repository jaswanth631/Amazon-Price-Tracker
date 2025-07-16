import { NextRequest, NextResponse } from 'next/server';
import { scrapeAndStoreProduct } from '../../../../lib/actions';
import { scrapeAmazonProduct } from '../../../../lib/scraper';

export async function POST(req: NextRequest) {
  console.log('[API] POST /api/scrapData called');
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('[API] Scraping product:', url);
    
    // First scrape the product to get the data
    const scrapedData = await scrapeAmazonProduct(url);
    if (!scrapedData) {
      return NextResponse.json({ error: 'Failed to scrape product data' }, { status: 500 });
    }

    // Then save it to the database
    await scrapeAndStoreProduct(url);

    // Return the scraped data for the frontend
    return NextResponse.json(scrapedData);
  } catch (error: any) {
    console.log('[API] Error in /api/scrapData:', error);
    return NextResponse.json({ 
      error: 'Failed to scrape product',
      details: error.message 
    }, { status: 500 });
  }
} 