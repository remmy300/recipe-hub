import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { User } from "../models/User.js";

interface JwtPayload {
  id: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  // DEBUG: log incoming auth-related headers/cookies (dev only)
  if (process.env.NODE_ENV !== "production") {
    console.log("authMiddleware: origin=", req.headers.origin);
    console.log("authMiddleware: cookies=", req.cookies);
    console.log("authMiddleware: authorization=", req.headers.authorization);
  }

  // CHECK COOKIE FIRST
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // FALLBACK: CHECK AUTH HEADER IF PROVIDED
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // VERIFY TOKEN
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { _id: user._id.toString() };
    next();
  } catch (error) {
    console.log("JWT VERIFY ERROR:", error);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
