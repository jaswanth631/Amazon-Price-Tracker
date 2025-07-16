"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { User } from "../../types";
import { z } from 'zod';

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

export async function scrapeAndStoreProduct(productUrl: string) {
  // Validate input
  const parseResult = productInputSchema.safeParse({ input: productUrl });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0].message);
  }

  if (!productUrl) return;

  try {
    await connectToDB(); // Ensure DB connection
    console.log('test213323123');
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    console.log('[SCRAPER] Scraped product:', scrapedProduct);

    if (!scrapedProduct) {
      console.log('[SCRAPER] No product data returned from scraper.');
      return;
    }

    let product = scrapedProduct;

    // Use asin for lookup
    const existingProduct = await Product.findOne({ asin: scrapedProduct.asin });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        {
          price: scrapedProduct.currentPrice,
          timestamp: new Date(),
          sellerType: scrapedProduct.sellerType,
          condition: 'New', // Default or scraped value
        },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
      console.log('[DB] Updating existing product:', scrapedProduct.asin);
    } else {
      // New product, initialize priceHistory
      product.priceHistory = [{
        price: scrapedProduct.currentPrice,
        timestamp: new Date(),
        sellerType: scrapedProduct.sellerType,
        condition: 'New',
      }];
      console.log('[DB] Creating new product:', scrapedProduct.asin);
    }

    // Use asin for upsert
    const newProduct = await Product.findOneAndUpdate(
      { asin: scrapedProduct.asin },
      product,
      { upsert: true, new: true }
    );
    console.log('[DB] Product saved:', newProduct?._id);

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    console.log('[ERROR] Failed to create/update product:', error);
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });

    if (!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await Product.findById(productId);

    if (!product) return;

    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );

    if (!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}
