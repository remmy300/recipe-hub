import { User } from "../models/User.js";
import { Response, Request, CookieOptions } from "express";
import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import { cookieOptions } from "../utils/cookieOptions.js";

// Register user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, avatar, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, avatar });

    const token = generateToken(user._id.toString());

    // Save token in cookie
    res.cookie("token", token, cookieOptions as CookieOptions);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());

    // Save token in cookie
    res.cookie("token", token, cookieOptions as CookieOptions);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// google login
const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    console.log("Google login attempt");

    // verify the token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Google payload received:", payload?.email);

    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, name, picture } = payload as {
      email: string;
      name?: string;
      picture?: string;
    };

    // check if user exists
    let user = await User.findOne({ email });
    console.log("Creating new user for:", email);

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        password: Math.random().toString(36).slice(-20),
      });
    }

    const jwtToken = generateToken(user._id.toString());

    res.cookie("token", jwtToken, cookieOptions as CookieOptions);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: jwtToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Log  out user

export const logOutUser = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out succesfully!" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed!" });
  }
};
