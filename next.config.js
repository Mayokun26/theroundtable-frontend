/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'dist',
  compiler: {
    styledComponents: true
  },
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  // Removing rewrites as they don't work with static export
  // API calls should be made directly to the API endpoint
  env: {
    API_URL: process.env.API_URL || 'https://pv72dt90k2.execute-api.us-east-1.amazonaws.com/dev',
  }
};

module.exports = nextConfig; 