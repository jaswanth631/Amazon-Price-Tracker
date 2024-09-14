import express, { Request, Response, NextFunction } from "express";
// import userRouter from "./routes/user";
import userProductRouter from "./routes/userProduct";
import productRouter from "./routes/product";
import routeRoter from "./routes/route";
import userDetails from "./routes/user";
import { sequelize } from "./db/db";
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/authRoutes";
import { auth } from "./middleware/auth";
import { extractCurrency, extractDescription, extractPrice } from "./utilities";
import { sendTestEmail } from "./controller/wrappers/priceAlertController";
// import Product from "./models/Product";
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
export const app = express();
export const PORT = 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.post("/scrapData", async (req, res) => {
  try {
    const { url } = req.body;
    const response = await axios.get(url, {
      headers: {
        /* Your headers here */
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const asin = url.match(/\/dp\/([A-Z0-9]{10})/)[1];
    const title = $("#productTitle").text().trim();
    const price = $("span.a-price span.a-offscreen").first().text().trim();
    const image = $("#landingImage").attr("src");
    const rating = $("span.a-icon-alt").first().text().trim();
    const review = $("span#acrCustomerReviewText").text().trim();
    const reviewCount = review.match(/\d[\d,]*/)[0]; // Extracts the first numeric part
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );
    app.post("/send-test-email", async (req: Request, res: Response) => {
      const { email } = req.body; // Get the recipient email from the request body

      try {
        await sendTestEmail(
          email,
          "Test Email from NodeMailer",
          "This is a test email."
        );
        res.status(200).json({ message: "Test email sent successfully" });
      } catch (error) {
        res.status(500).json({ message: "Failed to send test email", error });
      }
    });
    function extractStrikethroughPrice() {
      const strikethroughPrice =
        $(".priceBlockStrikePriceString").text().trim() ||
        $(".a-text-price .a-offscreen").text().trim();

      if (strikethroughPrice) {
        return strikethroughPrice.replace(/[^\d.,]/g, "").trim(); // Removes any extra text or symbols
      }
      return null; // If no strikethrough price is found
    }
    const originalPrice = extractStrikethroughPrice();
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
    res.json({
      asin,
      title,
      price,
      image,
      rating,
      reviewCount,
      currentPrice,
      originalPrice,
      currency,
      discountRate,
      url,
      // description,
    });
  } catch (error) {
    console.error("Error scraping data:", error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use("/save-product", productRouter);

//routes
// app.use(userRouter);
app.use(userProductRouter);
app.use(productRouter);
app.use(routeRoter);
app.use(userDetails);

// server.ts or app.ts

// Middleware
app.use(express.json());
sequelize
  .sync()
  .then(() => {
    // initializeActiveMq()
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
