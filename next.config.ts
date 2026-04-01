import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        
        protocol: 'https',
        hostname: 'pub-d7db6dfe5c1542f7bfaa9b3c1bd944f3.r2.dev',
        
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;





