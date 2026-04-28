import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: '/**'
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: '/**'
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: '/**'
      },
      {
        protocol: "https",
        hostname: "visaliv.s3.ap-south-1.amazonaws.com",
        pathname: '/**'
      },
    ],
  },
}

export default nextConfig;
