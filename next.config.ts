import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    //dynamicIO: true,
    //viewTransition: true,
    useCache: true,
    //ppr: 'incremental',
    //clientSegmentCache: true,
    //turbopackPersistentCachingForBuild: true,
    // turbopackPersistentCachingForDev: true,
    cacheComponents: true,
    //turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true,
  },
  reactCompiler: process.env.NODE_ENV === 'production' ? true : false,
  // typedRoutes: true
  
  // 10/7/2025 added this to fix the prisma client initialization error
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
    '/*': ['./node_modules/.prisma/client/**/*'],
  },
};

export default nextConfig;
