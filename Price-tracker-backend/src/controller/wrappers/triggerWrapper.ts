import { Request, Response } from "express";
import Trigger from "../../models/PriceTrigger";
import UserProduct from "../../models/UserProduct";
import PriceTrigger from "../../models/PriceTrigger";

// Create trigger
export const createTriggerController = async (req: Request, res: Response) => {
  const createTrigger = req.body;
  const trigger = await Trigger.create(createTrigger);
  return trigger;
};

// Get all triggers
export const getAllTriggersController = async (req: Request, res: Response) => {
  const triggers = await Trigger.findAll({
    include: UserProduct,
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return triggers;
};

// Get trigger by ID
export const getTriggerByIdController = async (req: Request, res: Response) => {
  const triggerId = parseInt(req.params.id, 10);
  const trigger = await Trigger.findByPk(triggerId, {
    include: UserProduct,
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  if (!trigger) {
    throw new Error("Trigger not found");
  }
  return trigger;
};

// Update trigger by ID
export const updateTriggerByIdController = async (
  req: Request,
  res: Response
) => {
  const triggerId = parseInt(req.params.id);
  const trigger = await PriceTrigger.findByPk(triggerId);
  if (!trigger) {
    return res.status(404).json({ error: "product not found" });
  }
  trigger.update(req.body, {
    where: { id: triggerId },
  });
  await trigger.save();
  return trigger;
};

// Delete trigger by ID
export const deleteTriggerByIdController = async (
  req: Request,
  res: Response
) => {
  const triggerId = parseInt(req.params.id);
  const trigger = await Trigger.findByPk(triggerId);
  if (!trigger) {
    return res.status(404).json({ error: "trigger not found" });
  }
  await trigger.destroy();
  return { message: "Trigger deleted successfully" };
};
