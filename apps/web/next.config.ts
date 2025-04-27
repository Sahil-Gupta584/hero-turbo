import dotenv from "dotenv";
import type { NextConfig } from "next";
import path from "path";
console.log(__dirname);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "i.ibb.co",
      },
    ],
  },
  env: {
    CREATOR_BASE_URL: process.env.CREATOR_BASE_URL,
  },
};

export default nextConfig;
