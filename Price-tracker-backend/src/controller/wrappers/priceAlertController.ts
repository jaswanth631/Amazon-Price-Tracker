// controllers/priceAlertController.ts
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { Alert } from "../../models/Alert";

export const setPriceAlert = async (req: Request, res: Response) => {
  const { email, asin, currentPrice } = req.body;

  try {
    // Save the price alert to the database
    const alert = await Alert.create({
      email,
      asin,
      alertPrice: currentPrice,
    });

    // Send a success response
    res.status(200).json({ message: "Price alert set successfully." });
  } catch (error) {
    console.error("Error setting price alert:", error);
    res.status(500).json({ error: "Failed to set price alert." });
  }
};

// Configure the transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any other email service like SendGrid, Outlook, etc.
  auth: {
    user: "jaswanthva123@gmail.com", // Your email
    pass: "Dgjashh1590@", // Your email password or app password
  },
});

// Function to send email
export const sendTestEmail = async (
  toEmail: string,
  subject: string,
  text: string
) => {
  const mailOptions = {
    from: '"Price Alert" <jaswanthva123@gmail.com>', // Sender address
    to: toEmail, // Recipient address
    subject: subject, // Email subject
    text: text, // Email content in plain text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
