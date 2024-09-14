import { Router } from "express";
import {
  createSignUp,
  createLogin,
  getAllUsers,
  getUserByIdController,
} from "../controller/wrappers/userDetailsWrapper";
import { helperFunction } from "../controller/helper";

const router = Router();

router.post("/signup", createSignUp);
router.post("/login", helperFunction(createLogin));
router.get("/users", getAllUsers);
router.get("/users/:id", helperFunction(getUserByIdController));

export default router;
