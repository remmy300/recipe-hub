import {
  Schema,
  InferSchemaType,
  model,
  Model,
  Document,
  Types,
  HydratedDocument,
} from "mongoose";
import bcrypt from "bcryptjs";

//interface for the document
export interface IUser {
  name: string;
  email: string;
  password: string;
  bio?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  recipes: Types.ObjectId[];
  avatar?: string;
  provider?: "local" | "google";
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
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
      required: function (this: any) {
        return this.provider === "local";
      },
    },

    bio: { type: String, default: "" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

//Pre-save hook for hashing the password....runs beforea doc is saved in the DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); //only hash if  new password has changed
  const salt = await bcrypt.genSalt(10); // generate random strings to be added to the created password
  this.password = await bcrypt.hash(this.password, salt); //add the generated random string to the password before hashing
  next();
});

//methods to campare passwords during login

userSchema.methods.matchPassword = async function (
  this: HydratedDocument<IUser>,
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = model<IUser>("User", userSchema);
