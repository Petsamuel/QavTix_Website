import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Compress responses with gzip — significant reduction in HTML/JSON payload size
    compress: true,

    // Optimize specific heavy packages to avoid bundling their entire tree
    experimental: {
        optimizePackageImports: ["@iconify/react", "framer-motion", "date-fns", "lucide-react"],
    },

    images: {
        formats: ["image/avif", "image/webp"],
        // Aggressive caching: images served from Next.js cache for 7 days
        minimumCacheTTL: 60 * 60 * 24 * 7,
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
            { protocol: "https", hostname: "example.com", pathname: "/**" },
            { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
            { protocol: "https", hostname: "visaliv.s3.ap-south-1.amazonaws.com", pathname: "/**" },
        ],
    },
}

export default nextConfig;
