/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Always use static export for AWS S3 deployment
  output: 'export',
  trailingSlash: true,
  distDir: 'out', // Change to 'out' to match expected directory for S3 deployment
  compiler: {
    styledComponents: true
  },
  images: {
    unoptimized: true
  },
  // Clean the output directory before building
  cleanDistDir: true,
  env: {
    API_URL: process.env.API_URL || 'https://pv72dt90k2.execute-api.us-east-1.amazonaws.com/dev',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.theroundtableai.com'
  }
};

module.exports = nextConfig;