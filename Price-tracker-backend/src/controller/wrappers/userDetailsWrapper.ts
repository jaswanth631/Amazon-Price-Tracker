import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../../models/User";
import { SECRET_KEY } from "../../config";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import express from "express";
const app = express();
app.use(cookieParser());
//for now
export const createSignUp = async (req: Request, res: Response) => {
  const { email, password, cpassword, phone } = req.body;

  if (!email || !password || !cpassword) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  if (password !== cpassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ msg: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedCPassword = await bcrypt.hash(cpassword, 10);

    // Create the new user in the database
    const signUpDetails = await User.create({
      email,
      password: hashedPassword,
      cpassword: hashedCPassword,
      phone,
    });

    // Send a success response
    res.status(201).json({
      msg: "User successfully signed up",
      signUpDetails,
    });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};

// Get All Users Function
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Server error, unable to fetch users" });
  }
};
// User SignUp
// export const createSignUp = async (req: Request, res: Response) => {
//   const { email, password, cpassword, phone } = req.body;

//   if (!email || !password || !cpassword) {
//     res.status(404).json({ msg: "Missing required fields" });
//   }
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const hashedCPassword = await bcrypt.hash(cpassword, 10);

//   const data = {
//     email,
//     password: hashedPassword,
//     cpassword: hashedCPassword,
//     phone,
//   };

//   const signUpDetails = await User.create({
//     email: data.email,
//     password: data.password,
//     cpassword: data.cpassword,
//     phone: data.phone,
//   });

//   res.send({
//     msg: "User successfully Signed_Up",
//     signUpDetails,
//   });
// };

// //Get User's
// export const getAllUsers = async (req: Request, res: Response) => {
//   const users = await User.findAll();
//   return users;
// };

// Get user By Id
export const getUserByIdController = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return user;
};

//User login and Generate Token
export const createLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userDetails = await User.findOne({ where: { email: email } });

  if (!userDetails) {
    res.status(404).send({ message: "User not exist." });
  }

  if (userDetails) {
    let passMatch = await bcrypt.compare(password, userDetails.password);
    console.log(passMatch);
    if (!passMatch) {
      res.send({ message: "Password is incorrect." });
    }
    if (passMatch) {
      let token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "3m" });
      console.log("Login Token: ", token);
      console.log("Cookie will be creating soon......");
      res.cookie("jwt", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 260000),
      });
      console.log("Cookie created successfully");

      res.json({
        msg: "User successfully Login",
        token: token,
      });
    } else {
      res.json("User is not Logined, Please Put Correct Details!");
    }
  }
};
