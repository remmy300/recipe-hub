import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { User } from "../models/User";

//Interface for JWT payload
interface JwtPayload {
  id: string;
}
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the enviroment variable");
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  //checks if token exists in the requests header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token from the header
      token = req.headers.authorization.split(" ")[1];

      //verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      //find User and attach to request (exclude password)

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }
      //Attach user to request
      req.user = { _id: user._id.toString() };
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized,invalid token" });
      next(error);
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }
};
