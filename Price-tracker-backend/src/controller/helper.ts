import { Request, Response } from "express";

export const sendSuccessResponse = (res: Response, data: any, status = 200) => {
  res.status(status).json(data);
};

export const sendErrorResponse = (
  res: Response,
  message: string,
  status = 500
) => {
  res.status(status).json({ error: message });
};
export const helperFunction = (
  processFunction: (req: Request, res: Response) => Promise<any>
) => {
  return async (req: Request, res: Response) => {
    try {
      const result = await processFunction(req, res);
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  };
};
