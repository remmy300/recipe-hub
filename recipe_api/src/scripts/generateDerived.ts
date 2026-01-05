// Ensure .env is loaded before cloudinary config runs
import "dotenv/config";
import cloudinary from "../config/cloudinary.js";

async function main() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error(
      "Missing Cloudinary environment variables. Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set (e.g. in a .env file)."
    );
    process.exit(1);
  }
  const prefix = process.argv[2] || "recipes/";
  console.log("Generating derived transforms for prefix:", prefix);

  try {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix,
      max_results: 500,
    });

    const resources = res.resources || [];
    console.log(`Found ${resources.length} resources to process`);

    for (const r of resources) {
      console.log("Processing:", r.public_id);
      try {
        await cloudinary.uploader.explicit(r.public_id, {
          type: "upload",
          eager: [
            {
              width: 400,
              crop: "limit",
              quality: "auto:eco",
              fetch_format: "auto",
            },
            {
              width: 800,
              crop: "limit",
              quality: "auto:eco",
              fetch_format: "auto",
            },
            {
              width: 1200,
              crop: "limit",
              quality: "auto:eco",
              fetch_format: "auto",
            },
          ],
        });
        console.log("Derived created for:", r.public_id);
      } catch (err) {
        console.error("Failed to create derived for", r.public_id, err);
      }
    }

    console.log("Done generating derived images.");
  } catch (err) {
    console.error("Error listing resources:", err);
    process.exit(1);
  }
}

main();
