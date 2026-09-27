import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // The development badge otherwise intercepts the mobile movement buttons.
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
