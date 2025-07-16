const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const MONGODB_URI = 'mongodb+srv://jaswanthraju63:Dgjashh1590@cluster0.mxonkgh.mongodb.net/amazon-price-tracker';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jaswanthva123@gmail.com',
    pass: 'axrv hiai zums xrgi'
  }
});

// Define Alert Schema
const alertSchema = new mongoose.Schema({
  productUrl: { type: String, required: true },
  email: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastNotified: Date
});

// Define Product Schema
const productSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  name: String,
  image: String,
  currentPrice: Number,
  lowestPrice: Number,
  highestPrice: Number,
  currency: String,
  priceHistory: [{
    date: Date,
    price: Number,
    currency: String
  }],
  rating: Number,
  reviewCount: Number,
  isAvailable: Boolean,
  internationalPrices: [{
    marketplace: String,
    price: Number,
    currency: String,
    lastUpdated: Date
  }],
  lightningDeals: [{
    startTime: Date,
    endTime: Date,
    price: Number,
    discount: Number,
    currency: String
  }],
  coupons: [{
    code: String,
    description: String,
    discount: Number,
    expiryDate: Date
  }],
  lastUpdated: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const Alert = mongoose.model('Alert', alertSchema);

// Helper function to get random user agent
function getRandomUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Helper function to get currency symbol from marketplace
function getCurrencyFromMarketplace(marketplace) {
  // For now, we only support Indian Amazon
  if (marketplace === 'amazon.in') {
    return '₹';
  }
  return '₹'; // Default to Indian Rupee

  /* Commented out international marketplaces for now
  const currencies = {
    'amazon.com': 'USD',
    'amazon.co.uk': 'GBP',
    'amazon.de': 'EUR',
    'amazon.fr': 'EUR',
    'amazon.it': 'EUR',
    'amazon.es': 'EUR',
    'amazon.ca': 'CAD',
    'amazon.com.mx': 'MXN',
    'amazon.com.br': 'BRL',
    'amazon.com.au': 'AUD',
    'amazon.co.jp': 'JPY',
    'amazon.in': '₹',
    'amazon.sg': 'SGD',
    'amazon.ae': 'AED',
    'amazon.sa': 'SAR',
    'amazon.se': 'SEK',
    'amazon.nl': 'EUR',
    'amazon.pl': 'PLN',
    'amazon.eg': 'EGP',
    'amazon.tr': 'TRY'
  };
  return currencies[marketplace] || 'USD';
  */
}

// Helper function to check and send alerts
async function checkAndSendAlerts(product) {
  const alerts = await Alert.find({
    productUrl: product.url,
    isActive: true,
    targetPrice: { $gte: product.currentPrice }
  });

  if (alerts.length > 0) {
    for (const alert of alerts) {
      if (!alert.lastNotified || (Date.now() - alert.lastNotified) > 24 * 60 * 60 * 1000) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: alert.email,
          subject: `Price Alert: ${product.name} is now below your target price!`,
          html: `
            <h1>Price Alert!</h1>
            <p>The price of ${product.name} has dropped below your target price.</p>
            <p>Current Price: ${product.currency} ${product.currentPrice}</p>
            <p>Your Target Price: ${product.currency} ${alert.targetPrice}</p>
            <p>View the product: <a href="${product.url}">${product.url}</a></p>
          `
        });

        alert.lastNotified = new Date();
        await alert.save();
      }
    }
  }
}

// Helper function to extract price from string
function extractPrice(priceStr, currency) {
  if (!priceStr) return null;
  
  // Remove currency symbols and other non-numeric characters except decimal point
  let cleanPrice = priceStr;
  
  // Handle different currency formats
  if (currency === '₹') {
    // For Indian Rupee
    cleanPrice = priceStr.replace(/[^\d.,]/g, '');
    // Handle Indian number format (e.g., 1,00,000)
    cleanPrice = cleanPrice.replace(/,/g, '');
  } else {
    // For other currencies
    cleanPrice = priceStr.replace(/[^\d.,]/g, '');
    // Handle different decimal separators
    cleanPrice = cleanPrice.replace(',', '.');
  }
  
  const price = parseFloat(cleanPrice);
  return isNaN(price) ? null : price;
}

// Helper function to scrape product data
async function scrapeProductData(url) {
  try {
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await axios.get(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0',
        'TE': 'Trailers'
      },
      timeout: 10000, // 10 second timeout
      maxRedirects: 5
    });

    if (!response.data) {
      throw new Error('No data received from Amazon');
    }

    const $ = cheerio.load(response.data);
    const marketplace = new URL(url).hostname;
    const currency = getCurrencyFromMarketplace(marketplace);

    // Check if we got a captcha page
    if ($('body').text().includes('Type the characters you see in this image')) {
      throw new Error('Amazon is showing a captcha page');
    }

    // Try different price selectors for Indian Amazon
    const priceSelectors = [
      '.a-price .a-offscreen',  // Most common selector for Indian Amazon
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '.a-price .a-price-whole',
      '.a-price .a-price-fraction',
      '.a-price .a-price-symbol',
      '#price_inside_buybox',
      '.a-color-price',
      '#price',
      '.a-size-medium.a-color-price'
    ];

    let price = null;
    for (const selector of priceSelectors) {
      const priceElement = $(selector).first();
      if (priceElement.length) {
        const priceText = priceElement.text().trim();
        console.log('Found price element:', selector, priceText); // Debug log
        price = extractPrice(priceText, currency);
        if (price !== null) break;
      }
    }

    // Extract rating - try multiple selectors
    let rating = 0;
    const ratingSelectors = [
      '.a-icon-star .a-icon-alt',  // Most common for Indian Amazon
      '.a-icon-star',
      '#acrPopover',
      '.a-star-medium',
      '.a-star-small'
    ];

    for (const selector of ratingSelectors) {
      const ratingElement = $(selector).first();
      if (ratingElement.length) {
        const ratingText = ratingElement.text().trim();
        console.log('Found rating element:', selector, ratingText); // Debug log
        // Extract rating from text like "4.5 out of 5 stars"
        const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
        if (ratingMatch) {
          rating = parseFloat(ratingMatch[1]);
          break;
        }
      }
    }

    // Extract review count - try multiple selectors
    let reviewCount = 0;
    const reviewSelectors = [
      '#acrCustomerReviewText',  // Most common for Indian Amazon
      '.a-size-base.a-color-secondary',
      '#acrCustomerReviewLink',
      '.a-size-base.s-underline-text'
    ];

    for (const selector of reviewSelectors) {
      const reviewElement = $(selector).first();
      if (reviewElement.length) {
        const reviewText = reviewElement.text().trim();
        console.log('Found review element:', selector, reviewText); // Debug log
        // Extract number from text like "1,234 ratings" or "1,234 reviews"
        const reviewMatch = reviewText.match(/(\d+(?:,\d+)*)/);
        if (reviewMatch) {
          reviewCount = parseInt(reviewMatch[1].replace(/,/g, ''));
          break;
        }
      }
    }

    // Extract product details
    const name = $('#productTitle').text().trim();
    const image = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src');
    const isAvailable = !$('#availability').text().includes('unavailable');

    // Log the extracted data for debugging
    console.log('Extracted Data:', {
      name,
      price,
      currency,
      rating,
      reviewCount,
      isAvailable,
      marketplace,
      priceSelectors: priceSelectors.map(selector => ({
        selector,
        found: $(selector).length > 0,
        text: $(selector).first().text().trim()
      }))
    });

    return {
      name,
      image,
      currentPrice: price || 0,
      currency,
      rating,
      reviewCount,
      isAvailable,
      lightningDeals: [],
      coupons: []
    };
  } catch (error) {
    console.error('Error scraping product data:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
}

// API endpoint to scrape product data
app.post('/scrapData', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Check if URL is from Indian Amazon
    if (!url.includes('amazon.in')) {
      return res.status(400).json({ error: 'Only Indian Amazon (amazon.in) URLs are supported' });
    }

    let product = await Product.findOne({ url });
    const scrapedData = await scrapeProductData(url);
    
    if (product) {
      // Update existing product
      const priceHistory = product.priceHistory || [];
      if (scrapedData.currentPrice !== product.currentPrice) {
        priceHistory.push({
          date: new Date().toISOString().split('T')[0],
          price: scrapedData.currentPrice,
          currency: scrapedData.currency
        });
      }

      product = await Product.findOneAndUpdate(
        { url },
        {
          ...scrapedData,
          priceHistory,
          lowestPrice: Math.min(product.lowestPrice, scrapedData.currentPrice),
          highestPrice: Math.max(product.highestPrice, scrapedData.currentPrice),
          lastUpdated: new Date()
        },
        { new: true }
      );
    } else {
      // Create new product
      product = await Product.create({
        url,
        ...scrapedData,
        lowestPrice: scrapedData.currentPrice,
        highestPrice: scrapedData.currentPrice,
        priceHistory: [{
          date: new Date().toISOString().split('T')[0],
          price: scrapedData.currentPrice,
          currency: scrapedData.currency
        }]
      });
    }

    // Check for price alerts
    await checkAndSendAlerts(product);

    // Format the response
    const response = {
      ...product.toObject(),
      priceHistory: product.priceHistory.map(ph => ({
        date: ph.date,
        price: ph.price,
        currency: ph.currency
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error in /scrapData:', error.message);
    res.status(500).json({ 
      error: 'Failed to scrape product data',
      details: error.message
    });
  }
});

// API endpoint to set price alert
app.post('/setAlert', async (req, res) => {
  try {
    const { url, email, targetPrice } = req.body;
    if (!url || !email || !targetPrice) {
      return res.status(400).json({ error: 'URL, email, and target price are required' });
    }

    const alert = await Alert.create({
      productUrl: url,
      email,
      targetPrice: parseFloat(targetPrice)
    });
    res.json(alert);
  } catch (error) {
    console.error('Error in /setAlert:', error);
    res.status(500).json({ error: 'Failed to set price alert' });
  }
});

// API endpoint to get daily deals
app.get('/dailyDeals', async (req, res) => {
  try {
    // 1. Products with active lightning deals
    const lightningDeals = await Product.find({
      'lightningDeals.0': { $exists: true }
    }).sort({ 'lightningDeals.discount': -1 }).limit(6);

    // 2. Products with largest price drops in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const allProducts = await Product.find({ 'priceHistory.1': { $exists: true } });
    const drops = allProducts.map(product => {
      // Find price 7 days ago (or closest before)
      const history = product.priceHistory || [];
      const recent = history.filter(h => new Date(h.date || h.timestamp) >= sevenDaysAgo);
      const oldestRecent = recent.length > 0 ? recent[0] : history[0];
      const latest = history[history.length - 1];
      const oldPrice = oldestRecent ? oldestRecent.price : latest.price;
      const newPrice = latest.price;
      const absDrop = oldPrice - newPrice;
      const pctDrop = oldPrice > 0 ? (absDrop / oldPrice) * 100 : 0;
      return { product, absDrop, pctDrop };
    }).filter(d => d.absDrop > 0);
    // Sort by percentage drop, then absolute drop
    drops.sort((a, b) => b.pctDrop - a.pctDrop || b.absDrop - a.absDrop);
    const topDrops = drops.slice(0, 6).map(d => ({ ...d.product.toObject(), absDrop: d.absDrop, pctDrop: d.pctDrop }));

    res.json({ lightningDeals, topDrops });
  } catch (error) {
    console.error('Error in /dailyDeals:', error);
    res.status(500).json({ error: 'Failed to fetch daily deals' });
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 