import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/create-clerk-token',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
