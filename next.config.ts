import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/reservations',
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/reservations/' : '',
  async rewrites() {
    return [
      {
        source: '/reservations/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Ensure images and static assets are served correctly
  images: {
    path: '/reservations/_next/image',
  },
  // Optimize for Vercel
  output: 'standalone', // Recommended for Vercel to optimize serverless functions
};

export default nextConfig;