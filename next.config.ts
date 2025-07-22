import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Optimize images
  images: {
    domains: ['localhost', 'hondaplus.vn'],
    formats: ['image/webp', 'image/avif'],
  },

  // External packages for server components
  serverExternalPackages: ['mongoose'],

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-API-Version',
            value: '1.0.0',
          },
          {
            key: 'X-Powered-By',
            value: 'Honda Plus',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/api/docs',
        permanent: true,
      },
    ];
  },

  // Turbopack configuration (for development)
  turbo: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
