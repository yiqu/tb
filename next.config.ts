import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    //dynamicIO: true,
    //viewTransition: true,
    useCache: true,
    reactCompiler: process.env.NODE_ENV === 'production' ? true : false,
    ppr: 'incremental',
    clientSegmentCache: true,
    turbopackPersistentCaching: true,
    devtoolSegmentExplorer: true,
  },
  // typedRoutes: true
};

export default nextConfig;
