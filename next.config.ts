import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Firebase App Hosting with Cloud Run (SSR)
  output: 'standalone',
  // Treat ESLint errors as warnings during build
  eslint: {
    // Warning instead of error during build
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during build
  typescript: {
    // Dangerously allow production builds to succeed even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Disable prerendering for problematic pages
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google authentication profile images
      'firebasestorage.googleapis.com', // Firebase storage images
      'storage.googleapis.com'      // Another Google storage domain
    ],
    // Add timeout configuration to avoid abrupt timeouts
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Disable remote pattern image optimization for Firebase storage (can help with timeouts)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ],
    // Increase timeout values
    minimumCacheTTL: 60, // Cache for at least 60 seconds
  },
  // Increase server timeout for API routes
  serverRuntimeConfig: {
    // Will only be available on the server side
    imageResponseTimeout: 60000, // 60 seconds
  },
};

export default nextConfig;
