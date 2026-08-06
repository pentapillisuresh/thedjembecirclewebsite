import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      // Allow any HTTPS hostname (use cautiously)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;