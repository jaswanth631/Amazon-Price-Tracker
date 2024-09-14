// import { Product } from "../models/Product";
// import { Alert } from "../models/Alert";
// import { sendPriceDropEmail } from "../controller/wrappers/priceAlertController";

// // This function checks if the price has dropped and sends an email
// export const checkPriceDrop = async () => {
//   try {
//     const alerts = await Alert.findAll();
//     for (const alert of alerts) {
//       const product = await Product.findOne({ where: { asin: alert.asin } });
//       if (
//         product &&
//         parseFloat(product.currentPrice) < parseFloat(alert.alertPrice)
//       ) {
//         // Send price drop email
//         await sendPriceDropEmail(alert.email, product);
//       }
//     }
//   } catch (error) {
//     console.error("Error checking for price drop:", error);
//   }
// };

// // Schedule this to run periodically (e.g., using cron or Agenda)
