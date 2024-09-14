import { Router } from "express";
import {
  createUserProductController,
  getAllUserProductsController,
  getUserProductByIdController,
  updateUserProductByIdController,
  deleteUserProductByIdController,
} from "../controller/wrappers/userProductWrapper";
import { helperFunction } from "../controller/helper";
const router = Router();

router.post("/userProducts", helperFunction(createUserProductController));
router.get("/userProducts", helperFunction(getAllUserProductsController));
router.get("/userProducts/:id", helperFunction(getUserProductByIdController));
router.put(
  "/userProducts/:id",
  helperFunction(updateUserProductByIdController)
);
router.delete(
  "/userProducts/:id",
  helperFunction(deleteUserProductByIdController)
);

export default router;
