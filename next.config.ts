import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/reservations",
  images: {
    domains: ["images.unsplash.com", "example.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true, // Prevents redirect loops with cPanel’s Apache
  async rewrites() {
    return [
      {
        source: "/reservations/api/:path*",
        destination: "/api/:path*", // Map API routes correctly
      },
    ];
  },
};

export default nextConfig;
