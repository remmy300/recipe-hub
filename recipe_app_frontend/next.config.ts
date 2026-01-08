import { NextConfig } from "next";

const devProxyTarget =
  process.env.NEXT_PUBLIC_API_URL_DEV || "http://localhost:8080";

const nextConfig: NextConfig = {
  images: {
    // Allowlisted remote hostnames for next/image
    domains: ["res.cloudinary.com", "lh3.googleusercontent.com", "localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/images/**",
      },

      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Only add a dev-time proxy so the browser sees requests as same-origin
  // (useful for cookies during local development).
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: `${devProxyTarget}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
