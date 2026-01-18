import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    //viewTransition: true,
    useCache: true,
    //turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true,
    browserDebugInfoInTerminal: false,
    // Cache dynamic pages in the Router Cache to prevent Suspense re-triggering on back navigation
    staleTimes: {
      dynamic: 30, // Cache dynamic pages for 30 seconds
      static: 180, // Cache static pages for 3 minutes (default is 5 minutes)
    },
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
