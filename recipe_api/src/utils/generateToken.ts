import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1hr" });
};
