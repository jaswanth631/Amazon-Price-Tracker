/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["mongoose", "cheerio"],
  },
  images: {
    domains: ["m.media-amazon.com"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle undici compatibility issue
      config.externals = config.externals || [];
      config.externals.push('undici');
      
      // Add fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http2: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
