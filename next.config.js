/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seatgeekimages.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
