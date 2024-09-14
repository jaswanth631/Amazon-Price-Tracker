// routes/priceAlertRoutes.ts
import { Router } from "express";
import {
  setPriceAlert,
} from "../controller/wrappers/priceAlertController";

const router = Router();

// Route to set the price alert
router.post("/price-alert", setPriceAlert);
// router.post("/alert", sendPriceDropEmail);


export default router;
