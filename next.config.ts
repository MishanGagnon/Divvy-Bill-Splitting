import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "knowing-cormorant-599.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
