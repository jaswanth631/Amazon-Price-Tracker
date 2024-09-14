import { Router } from "express";
import { getAllProduct, saveProductDetails } from "../controller/wrappers/server";
import { helperFunction } from "../controller/helper";
const router = Router();

router.post("/trackproduct", helperFunction(saveProductDetails));
router.get("/trackallproduct", getAllProduct);
export default router;
