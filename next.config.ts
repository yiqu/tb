import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    //dynamicIO: true,
    //viewTransition: true,
    useCache: true,
    //ppr: 'incremental',
    clientSegmentCache: true,
    //turbopackPersistentCachingForBuild: true,
    // turbopackPersistentCachingForDev: true,
    cacheComponents: true,
  },
  reactCompiler: process.env.NODE_ENV === 'production' ? true : false,
  // typedRoutes: true
};

export default nextConfig;
