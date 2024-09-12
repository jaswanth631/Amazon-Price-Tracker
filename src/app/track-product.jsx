// /pages/api/track-product.ts

import { req, res } from "next";
import { ProductPrice } from "../../models/ProductPrice"; // Adjust import path
import { Product } from "../../models/Product"; // Adjust import path
import axios from "axios";
import cheerio from "cheerio";
import sequelize from "../../lib/sequelize"; // Sequelize initialization

const trackProduct = async (req, res) => {
  if (req.method === "POST") {
    const { productId } = req.body;

    try {
      // Scrape product details from Amazon (you should be careful with legal and ethical implications of scraping)
      const productUrl = `https://www.amazon.in/dp/${productId}`;
      const response = await axios.get(productUrl);
      const html = response.data;
      const $ = cheerio.load(html);

      // Extract the necessary data from the scraped HTML
      const price = $("#priceblock_ourprice").text(); // Adjust this selector to match the price element
      const name = $("#productTitle").text().trim(); // Extract the product title

      // Ensure the product exists in the database
      let product = await Product.findOne({ where: { id: productId } });
      if (!product) {
        product = await Product.create({
          id: productId,
          name,
        });
      }

      // Save the scraped price data
      await ProductPrice.create({
        product_id: productId,
        price,
      });

      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Product tracked successfully" });
    } catch (error) {
      console.error("Error tracking product:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to track product" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
};

export default trackProduct;
