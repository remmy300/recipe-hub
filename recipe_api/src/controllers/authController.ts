import { User } from "../models/User.js";
import { Response, Request, CookieOptions } from "express";
import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import { cookieOptions } from "../utils/cookieOptions.js";
import { Types } from "mongoose";
import { Recipe } from "../models/Recipe.js";
import { Comment } from "../models/Comment.js";

// Register user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, avatar, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      avatar,
      provider: "local",
    });

    const token = generateToken(user._id.toString());

    // Save token in cookie
    res.cookie("token", token, cookieOptions as CookieOptions);
    if (process.env.NODE_ENV !== "production") {
      try {
        console.log("SET COOKIE (register):", {
          token: `${String(token).slice(0, 6)}...`,
          sameSite: (cookieOptions as any).sameSite,
          secure: (cookieOptions as any).secure,
          httpOnly: (cookieOptions as any).httpOnly,
        });
      } catch (e) {}
    }

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
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.provider === "google") {
      return res.status(400).json({
        message: "This account uses Google login. Please sign in with Google.",
      });
    }

    const token = generateToken(user._id.toString());

    // Save token in cookie
    res.cookie("token", token, cookieOptions as CookieOptions);
    if (process.env.NODE_ENV !== "production") {
      try {
        console.log("SET COOKIE (login):", {
          token: `${String(token).slice(0, 6)}...`,
          sameSite: (cookieOptions as any).sameSite,
          secure: (cookieOptions as any).secure,
          httpOnly: (cookieOptions as any).httpOnly,
        });
      } catch (e) {}
    }

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
    if (process.env.NODE_ENV !== "production") {
      console.log("Google payload received:", {
        email: payload?.email,
        name: payload?.name,
      });
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, name, picture } = payload as {
      email: string;
      name?: string;
      picture?: string;
    };

    // check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (process.env.NODE_ENV !== "production") {
      console.log("Google login for:", {
        email,
        foundUser: !!user,
        provider: user?.provider,
      });
    }

    // If an account exists registered with local credentials, ask user to sign in with email/password
    if (user && user.provider === "local") {
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Google login blocked: existing local provider account for",
          email
        );
      }
      return res
        .status(401)
        .json({ message: "Please sign in using email and password" });
    }

    // Create a new google user if none exists
    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        avatar: picture,
        provider: "google",
      });
      if (process.env.NODE_ENV !== "production") {
        console.log("Created new google user for:", email);
      }
    }

    const jwtToken = generateToken(user._id.toString());

    res.cookie("token", jwtToken, cookieOptions as CookieOptions);
    if (process.env.NODE_ENV !== "production") {
      try {
        console.log("SET COOKIE (google):", {
          token: `${String(jwtToken).slice(0, 6)}...`,
          sameSite: (cookieOptions as any).sameSite,
          secure: (cookieOptions as any).secure,
          httpOnly: (cookieOptions as any).httpOnly,
        });
      } catch (e) {}
    }

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

    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("recipes")
      .populate("followers", "name avatar")
      .populate("following", "name avatar");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//follow and unfollow
export const toggleFollow = async (req: Request, res: Response) => {
  try {
    //extract user ids
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "Cant follow yourself" });
    }

    const targetUserObjectId = new Types.ObjectId(targetUserId);
    const currentUserObjectId = new Types.ObjectId(currentUserId);

    //fetch users from DB
    const targetUser = await User.findById(targetUserObjectId);
    const currentUser = await User.findById(currentUserObjectId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser?.following?.some((id) =>
      id.equals(targetUserObjectId)
    );

    if (isFollowing) {
      currentUser.following = currentUser?.following.filter(
        (id) => !id.equals(targetUserObjectId)
      );
      targetUser.followers = targetUser?.followers.filter(
        (id) => !id.equals(currentUserObjectId)
      );
    } else {
      currentUser.following.push(targetUserObjectId);
      targetUser.followers.push(currentUserObjectId);
    }
    await currentUser.save();
    await targetUser.save();

    return res.json({ following: !isFollowing });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
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

export const editProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      followers: updatedUser.followers,
      following: updatedUser.following,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Missing passwords" });

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid current password" });

    user.password = newPassword;
    await user.save();

    // issue new token and set cookie
    const token = generateToken(user._id.toString());
    res.cookie("token", token, cookieOptions as CookieOptions);
    if (process.env.NODE_ENV !== "production") {
      try {
        console.log("SET COOKIE (changePassword):", {
          token: `${String(token).slice(0, 6)}...`,
          sameSite: (cookieOptions as any).sameSite,
          secure: (cookieOptions as any).secure,
          httpOnly: (cookieOptions as any).httpOnly,
        });
      } catch (e) {}
    }

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete account and related data
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const userId = req.user._id;

    // delete user's recipes
    await Recipe.deleteMany({ createdBy: userId });

    // delete user's comments
    await Comment.deleteMany({ userId });

    // remove from other users' followers/following
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    // remove user from recipe likes and favorites
    await Recipe.updateMany(
      {},
      { $pull: { likes: userId, favorites: userId } }
    );

    // finally delete the user
    await User.findByIdAndDelete(userId);

    // clear token cookie
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(0),
    });

    res.json({ message: "Account deleted" });
  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
