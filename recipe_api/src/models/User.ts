import { Schema, InferSchemaType, model } from "mongoose";
import bycrypt from "bcryptjs";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true, required: [true, "Name is required"] },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);
//Pre-save hook for hashing the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); //only hash if  new password has changed
  const salt = await bycrypt.genSalt(10); // generate random strings to be added to the created password
  this.password = await bycrypt.hash(this.password, salt); //add the generated random string to the password before hashing
  next();
});

//methods to campare passwords during login

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bycrypt.compare(enteredPassword, this.password);
};

export const User = model<IUser>("User", userSchema);
