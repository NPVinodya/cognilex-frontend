import type { NextConfig } from "next";

const IMAGE_HOST = process.env.NEXT_PUBLIC_IMAGE_HOST || 'pub-d7db6dfe5c1542f7bfaa9b3c1bd944f3.r2.dev';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: IMAGE_HOST,
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;





