import { Request, Response } from "express";
import { Product } from "../../models/Product";

import Platform from "../../models/Platform";
import UserProduct from "../../models/UserProduct";
// import ProductPrice from "../../models/ProductPrice";
import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";

// Create product
export const saveProductController = async (req: Request, res: Response) => {
  const productData = req.body;

  try {
    const product = await Product.create({
      asin: productData.asin,
      title: productData.title,
      price: productData.price,
      image: productData.image,
      rating: parseFloat(productData.rating),
      reviewCount: productData.reviewCount,
      currentPrice: productData.currentPrice,
      originalPrice: productData.originalPrice,
      currency: productData.currency,
      discountRate: productData.discountRate,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error saving product data:", error);
    res.status(500).json({ error: "Failed to save product data" });
  }
};
export const getProductByAsinController = async (
  req: Request,
  res: Response
) => {
  const { asin } = req.params; 
  try {
    const product = await Product.findOne({ where: { asin } });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the product if found
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ASIN:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Trending
export const getTrendingProductsController = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
      limit: 15, // Fetch top 15 recently created products
    });

    // Return the products
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const createProductController = async (req: Request, res: Response) => {
  const scrapeAmazonProduct = req.body;
  console.log("scrapeAmazonProduct::", scrapeAmazonProduct);

  const productData = {
    platform_id: scrapeAmazonProduct.asin, // This should now work as a STRING
    platform_product_id: scrapeAmazonProduct.asin, // This should also be a STRING
    currency: scrapeAmazonProduct.currency,
    title: scrapeAmazonProduct.title,
    rating: scrapeAmazonProduct.rating,
    isOutOfStock: scrapeAmazonProduct.outOfStock,
    ProductPrice: scrapeAmazonProduct.currentPrice,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log("createProduct...", productData);

  try {
    const product = await Product.create(productData);
    return res.status(201).json(product);
  } catch (error) {
    console.error("Error saving:", error);
  }
};


// Get all products
export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    return products;
  } catch (err) {
    console.log("Errr:::", err);
  }
};

// Get product by ID
export const getProductByIdController = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const product = await Product.findByPk(productId, {
    attributes: { exclude: ["updatedAt"] },
  });
  if (!product) {
    try {
      const productId = req.params.id;
      const URL = `https://www.amazon.com/dp/${productId}`;
      const head = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      };
      const response = await axios.get(URL, {
        headers: head,
      });
      const html = response.data;
      const $ = cheerio.load(html);
      const title: string = $("#productTitle").text().trim();
      const imageElements = $("#landingImage"); // Find all img elements
      imageElements.each((index, element) => {
        const imageUrl = $(element).attr("src"); // Get the 'src' attribute of the img element
        console.log(imageUrl);
      });
      const platform_product_id = productId;
      const result = await Product.create({
        title,
        platform_product_id,
        platform_id: 1,
      });
      console.log("Result:::", result);
      return result;
      const Price = $("span.a-offscreen").first().text().split(" ");
      const price = Price[0];
    } catch (error) {
      console.log("error::", error);
    }
  }
  return product;
};

// Update product by ID
export const updateProductByIdController = async (
  req: Request,
  res: Response
) => {
  const productId = req.params.id;
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ error: "product not found" });
  }
  product.update(req.body, {
    where: { id: productId },
  });
  await product.save();
  return product;
};

// Delete product by ID
export const deleteProductByIdController = async (
  req: Request,
  res: Response
) => {
  const productId = req.params.id;
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ error: "product not found" });
  }
  await product.destroy();
  return { message: "Product deleted successfully" };
};
