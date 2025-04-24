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
  images: {
    path: '/reservations/_next/image',
    domains: ['maps.googleapis.com', 'maps.google.com', 'metrodtw.wizardcomm.in'], // For Google Maps
    disableStaticImages: false,
  },
  typescript: {
    ignoreBuildErrors: true, // Retain for now, but fix errors long-term
  },
  eslint: {
    ignoreDuringBuilds: true, // Retain for now, but fix errors long-term
  },
};

export default nextConfig;