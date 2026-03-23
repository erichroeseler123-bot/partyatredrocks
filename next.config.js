/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/guide/post-encore-strategy",
        destination: "/guide/show-night-strategy/post-show-pickup-plan",
        permanent: true,
      },
      {
        source: "/guide/bag-policy-2026",
        destination: "/guide/logistics/bag-policy",
        permanent: true,
      },
      {
        source: "/guide/sheraton-pickup",
        destination: "/guide/local/denver-pickups",
        permanent: true,
      },
    ];
  },
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

      // Wikimedia / Wikipedia venue-image resolver
      { protocol: "https", hostname: "upload.wikimedia.org" },

      // DCC public media feed assets
      { protocol: "https", hostname: "destinationcommandcenter.com" },
      { protocol: "https", hostname: "www.destinationcommandcenter.com" },
    ],
  },
};

module.exports = nextConfig;
