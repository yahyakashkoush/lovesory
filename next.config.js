/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  // Vercel optimization
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
