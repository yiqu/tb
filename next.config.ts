import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    dynamicIO: true,
    viewTransition: true,
    useCache: true,
    reactCompiler: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
