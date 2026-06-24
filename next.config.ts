import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
