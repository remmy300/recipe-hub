import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "avatars",
      allowed_formats: ["png", "jpg", "jpeg", "webp"],
      transformation: [
        {
          width: 800,
          height: 800,
          crop: "limit",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    };
  },
});

const upload = multer({ storage });

export default upload;
