import multer from "multer";
import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recipes",
    allowed_formats: ["png", "jpg", "jpeg"],
  } as any,
});

const upload = multer({ storage });

export default upload;
