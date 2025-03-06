/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only run ESLint in development, not during production builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 