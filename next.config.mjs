/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination:"https://localhost:3002/api/:path*",  //"https://secure1.mirrorhub.in/api/:path*", 
      },
    ];
  },
};

export default nextConfig;
