/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Common SeatGeek performer/venue image hosts
      { protocol: "https", hostname: "seatgeekimages.com" },
      { protocol: "https", hostname: "*.seatgeekimages.com" },

      // Sometimes returned in the wild (safe to allow)
      { protocol: "https", hostname: "seatgeek.com" },
      { protocol: "https", hostname: "*.seatgeek.com" },
      { protocol: "https", hostname: "seatgeekcdn.com" },
      { protocol: "https", hostname: "*.seatgeekcdn.com" },
      { protocol: "https", hostname: "static.seatgeek.com" },
    ],
  },
};

module.exports = nextConfig;
