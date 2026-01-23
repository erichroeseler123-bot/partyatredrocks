/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seatgeekcdn.com",
      },
      {
        protocol: "https",
        hostname: "img.seatgeek.com",
      },
    ],
  },
};

module.exports = nextConfig;
