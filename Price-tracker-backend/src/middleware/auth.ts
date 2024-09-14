import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserDetails from "../models/User";
import { SECRET_KEY } from "../config";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);

    if (!token) {
      return res.status(401).json({ error: "Authentication token missing" });
    }
    const decodedToken = jwt.verify(token, SECRET_KEY) as { email: string };
    console.log(decodedToken);

    const user = await UserDetails.findOne({
      where: { email: decodedToken.email },
    });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // req.token = token;
    // req.user = user;

    next();
  } catch (error) {
    res
      .status(401)
      .json({ error: "Invalid token & Your are not authenticate" });
  }
};
