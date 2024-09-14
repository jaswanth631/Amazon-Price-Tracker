import { Request, Response } from "express";
import UserProduct from "../../models/UserProduct";
import User from "../../models/User";
import PriceTrigger from "../../models/PriceTrigger";
import { Product } from "../../models/Product";

// Create user product
export const createUserProductController = async (
  req: Request,
  res: Response
) => {
  const createUserProduct = req.body;
  const userProduct = await UserProduct.create(createUserProduct);
  return userProduct;
};

// Get all user products
export const getAllUserProductsController = async (
  req: Request,
  res: Response
) => {
  const userProducts = await UserProduct.findAll({
    include: [
      { model: User, attributes: ["id"] },
      { model: Product, attributes: ["name"] },
      {
        model: PriceTrigger,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });
  return userProducts;
};

// Get user product by ID
export const getUserProductByIdController = async (
  req: Request,
  res: Response
) => {
  const userProductId = parseInt(req.params.id);
  const userProduct = await UserProduct.findByPk(userProductId, {
    include: [
      { model: User, attributes: ["id"] },
      { model: Product, attributes: ["name"] },
      {
        model: PriceTrigger,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });
  if (!userProduct) {
    return res.status(404).json({ error: "UserProduct not found" });
  }
  return userProduct;
};

// Update user product by ID
export const updateUserProductByIdController = async (
  req: Request,
  res: Response
) => {
  const userProductId = parseInt(req.params.id);
  const userProduct = await UserProduct.findByPk(userProductId);
  if (!userProduct) {
    return res.status(404).json({ error: "User Product not found" });
  }
  userProduct.update(req.body, {
    where: { id: userProduct },
  });
  await userProduct.save();
  return userProduct;
};

// Delete user product by ID
export const deleteUserProductByIdController = async (
  req: Request,
  res: Response
) => {
  const userProductId = parseInt(req.params.id);
  const userProduct = await UserProduct.findByPk(userProductId);
  if (!userProduct) {
    throw new Error("User Product not found");
  }
  await userProduct.destroy();
  return { message: "User Product deleted successfully" };
};
