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
    loader: "custom",
    loaderFile: "./unsplash-loader.js",
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

module.exports = nextConfig;
