"use server"

import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export async function scrapeAmazonProduct(url: string) {
  if(!url) return;

  console.log('[SCRAPER] Starting to scrape:', url);

  try {
    // Fetch the product page using native fetch
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log('[SCRAPER] HTML length:', html.length);
    
    const $ = cheerio.load(html);

    // Extract the product title
    const title = $('#productTitle').text().trim();
    console.log('[SCRAPER] Title:', title);

    // Extract price with multiple selectors
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('.a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base'),
      $('.a-price-whole'),
      $('.a-price .a-offscreen'),
    );

    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price'),
      $('.a-price .a-offscreen'),
    );

    console.log('[SCRAPER] Current price:', currentPrice);
    console.log('[SCRAPER] Original price:', originalPrice);

    const outOfStock = $('#availability span').text().trim().toLowerCase().includes('unavailable') || 
                      $('#availability').text().trim().toLowerCase().includes('unavailable');

    const images = 
      $('#imgBlkFront').attr('data-a-dynamic-image') || 
      $('#landingImage').attr('data-a-dynamic-image') ||
      $('#landingImage').attr('src') ||
      '{}'

    let imageUrls: string[] = [];
    try {
      const parsedImages = JSON.parse(images);
      if (parsedImages && typeof parsedImages === 'object') {
        imageUrls = Object.keys(parsedImages);
      }
    } catch {
      // If JSON parsing fails, try to get direct image URL
      if (images && !images.startsWith('{')) {
        imageUrls = [images];
      }
    }
    const imageUrl = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : '';

    console.log('[SCRAPER] Image URL:', imageUrl);

    const currency = extractCurrency($('.a-price-symbol')) || '$';
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

    const description = extractDescription($)

    // Extract ASIN from URL or page
    let asin = '';
    const asinMatch = url.match(/([A-Z0-9]{10})(?:[/?]|$)/i);
    if (asinMatch) {
      asin = asinMatch[1];
    } else {
      const asinValue = $('#ASIN').val() || $('input[name="ASIN"]').val();
      asin = Array.isArray(asinValue) ? asinValue[0] || '' : asinValue || '';
    }

    console.log('[SCRAPER] ASIN:', asin);

    // Seller type (default to 'Amazon')
    let sellerType = 'Amazon';
    const merchantInfo = $('#merchant-info').text().toLowerCase();
    if (merchantInfo.includes('fulfilled by amazon')) {
      sellerType = 'Amazon';
    } else if (merchantInfo.includes('third-party')) {
      sellerType = merchantInfo.includes('used') ? 'ThirdPartyUsed' : 'ThirdPartyNew';
    }

    // isAvailable
    const isAvailable = !outOfStock;

    // Marketplace (domain)
    const marketplaceMatch = url.match(/amazon\.([a-z.]+)/i);
    const marketplace = marketplaceMatch ? `amazon.${marketplaceMatch[1]}` : 'amazon.com';

    // imageUrl and productUrl
    const productUrl = url;

    // Extract rating and review count
    const ratingText = $('.a-icon-alt').text().trim();
    const rating = ratingText.match(/(\d+\.?\d*)/)?.[1] || '0';
    const reviewCountText = $('#acrCustomerReviewText, .a-size-base.a-color-secondary').text().trim();
    const reviewCount = reviewCountText.match(/(\d+(?:,\d+)*)/)?.[1]?.replace(/,/g, '') || '0';

    console.log('[SCRAPER] Rating:', rating);
    console.log('[SCRAPER] Review count:', reviewCount);

    // Construct data object with all required fields
    const data = {
      asin,
      title: title || 'Product Title Not Found',
      currentPrice: Number(currentPrice) || Number(originalPrice) || 0,
      currency: currency || '$',
      imageUrl,
      productUrl,
      lowestPriceEver: Number(currentPrice) || Number(originalPrice) || 0,
      highestPriceEver: Number(originalPrice) || Number(currentPrice) || 0,
      lastUpdated: new Date(),
      isAvailable,
      sellerType,
      priceHistory: [],
      marketplace,
      alerts: [],
      rating: Number(rating),
      reviewCount: Number(reviewCount),
      // Add fields that your frontend expects
      name: title || 'Product Title Not Found',
      image: imageUrl,
      lowestPrice: Number(currentPrice) || Number(originalPrice) || 0,
      highestPrice: Number(originalPrice) || Number(currentPrice) || 0,
      url: url,
    };

    console.log('[SCRAPER]  data:', data.highestPrice);
    return data;
  } catch (error: any) {
    console.log('[SCRAPER] Error scraping product:', error);
    return null;
  }
}