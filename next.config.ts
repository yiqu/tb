import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    //viewTransition: true,
    useCache: true,
    clientSegmentCache: true,
    //turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true,
    browserDebugInfoInTerminal: true,
  },
  reactCompiler: process.env.NODE_ENV === 'production' ? true : false,
  cacheComponents: true,
  
  // typedRoutes: true

  // 10/7/2025 added this to fix the prisma client initialization error
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
    '/*': ['./node_modules/.prisma/client/**/*'],
  },
};

export default nextConfig;
