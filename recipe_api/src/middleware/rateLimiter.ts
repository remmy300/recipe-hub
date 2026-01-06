import rateLimit from "../config/upstash.js";
import { Request, Response, NextFunction } from "express";

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await rateLimit.limit("test_user");
    console.log(result);

    const { success } = await rateLimit.limit(req.ip || "unknown");
    if (!success) {
      return res.status(429).json({
        message: "Too many requests,please try again later",
      });
    }
    next();
  } catch (error) {
    console.log("Failed to send the request:", error);
    next(error);
  }
};

export default rateLimiter;
