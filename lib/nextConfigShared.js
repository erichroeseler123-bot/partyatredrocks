/**
 * Single authoritative Next.js configuration shared by `next.config.js`
 * (consumed by `next build` / `next start` per Next.js `CONFIG_FILES` precedence)
 * and `next.config.ts` (consumed by TypeScript test imports).
 *
 * Keeping one shared CommonJS module without a `.ts` sibling guarantees zero
 * configuration drift and avoids tsx `.js -> .ts` circular resolution.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  htmlLimitedBots: /.*/,
  transpilePackages: ["react-map-gl", "mapbox-gl"],
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
        source: "/shuttle",
        destination: "/red-rocks/shuttle",
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
        source: "/party-bus-to-red-rocks",
        destination: "/red-rocks/group-transportation",
        permanent: true,
      },
      {
        source: "/red-rocks/how-to-get-to-red-rocks",
        destination: "/red-rocks/transportation",
        permanent: true,
      },
      // 11 Historical 404 routes -> exact topical successors (one-hop 308)
      {
        source: "/red-rocks-schedule",
        destination: "/red-rocks/concerts",
        permanent: true,
      },
      {
        source: "/transportation-services",
        destination: "/red-rocks/shuttle",
        permanent: true,
      },
      {
        source: "/red-rocks-shuttle",
        destination: "/red-rocks/shuttle",
        permanent: true,
      },
      {
        source: "/shared-shuttle",
        destination: "/red-rocks/shuttle",
        permanent: true,
      },
      {
        source: "/private-shuttle",
        destination: "/book/red-rocks-amphitheatre/private",
        permanent: true,
      },
      {
        source: "/denver-marriott-west",
        destination: "/guide/local/denver-pickups",
        permanent: true,
      },
      {
        source: "/guide/local/denver-pickup-locations",
        destination: "/guide/local/denver-pickups",
        permanent: true,
      },
      {
        source: "/guide/tailgate",
        destination: "/guide/tailgating",
        permanent: true,
      },
      {
        source: "/rain",
        destination: "/red-rocks/weather",
        permanent: true,
      },
      {
        source: "/venues/fiddlers-green",
        destination: "/venues/fiddlers-green-amphitheatre",
        permanent: true,
      },
      {
        source: "/venues/mishawaka",
        destination: "/venues/mishawaka-amphitheatre",
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
