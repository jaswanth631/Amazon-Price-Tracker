import { Router } from "express";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductByIdController,
  deleteProductByIdController,
  saveProductController,
  getProductByAsinController,
  getTrendingProductsController,
} from "../controller/wrappers/productWrapper";
import { helperFunction } from "../controller/helper";
// import { trackProduct } from "../index";

const router = Router();
router.post("/save-product", saveProductController);
router.get("/product/:asin", getProductByAsinController);
router.get("/trending", getTrendingProductsController);
router.get("/get-product", helperFunction(getAllProductsController));
router.post("/products", helperFunction(createProductController));
// router.post("/trackProduct", helperFunction(trackProduct));
router.post("/api/products/save", saveProductController);
router.get("/products", helperFunction(getAllProductsController));
router.get("/products/:id", helperFunction(getProductByIdController));
router.put("/products/:id", helperFunction(updateProductByIdController));
router.delete("/products/:id", helperFunction(deleteProductByIdController));

export default router;
