/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    inlineCss: true,
  },
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
      {
        source: "/guide/local/trailhead-taphouse",
        destination: "/guide/local/denver-pickups",
        permanent: true,
      },
      {
        source: "/shuttles",
        destination: "/red-rocks/shuttle",
        permanent: true,
      },
      {
        source: "/red-rocks/red-rocks-shuttle",
        destination: "/red-rocks/shuttle",
        permanent: true,
      },
      {
        source: "/book-shuttle",
        destination: "/red-rocks/shuttle",
        permanent: true,
      },
      {
        source: "/party-bus",
        destination: "/red-rocks/group-transportation",
        permanent: true,
      },
      {
        source: "/red-rocks/how-to-get-to-red-rocks",
        destination: "/red-rocks/transportation",
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
