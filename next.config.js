/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Core Settings & Performance
  reactStrictMode: true,
  images: {
    // Ensuring your fleet and venue photos load instantly in modern formats
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.partyatredrocks.com',
      },
    ],
  },

  // 2. The SEO Shield (301 Redirects)
  // This fixes the high-priority 404 issues and consolidates your link juice.
  async redirects() {
    return [
      // --- Global Authority Consolidation ---
      {
        source: '/(event-details|post|heres-the-latest|group/party-red-rocks)/:slug*',
        destination: '/guide',
        permanent: true,
      },

      // --- Local Entity & Hotel Anchors ---
      // This forces all hotel-intent traffic to your localized guide pages.
      {
        source: '/(sheraton|fairfield|hampton-inn|hoiday-inn|the-rally-hotel|downtown-denver-hotels|la-quinta-fairfield)/:path*',
        destination: '/guide/local/denver-pickups',
        permanent: true,
      },
      {
        source: '/(denver-marriott-west|denver-marriott-west-1|copy-of-la-quinta|copy-of-fairfield-inn)',
        destination: '/guide/local/trailhead-taphouse',
        permanent: true,
      },

      // --- Logistics Pillars ---
      // Capturing all parking and weather-related queries.
      {
        source: '/(parking-lots|red-rocks-parking-situation|lower-south|upper-south|down-south|lower-north|upper-north|west-side|hiking-at-red-rocks)',
        destination: '/guide/logistics/parking-lots',
        permanent: true,
      },
      {
        source: '/(rain|clear-creek|tubing)',
        destination: '/guide/logistics/weather-prep',
        permanent: true,
      },

      // --- Service & Fleet Cleanup ---
      // Pointing old service names directly to your modern booking engine.
      {
        source: '/(sprinter|party-bus|party-bus-to-red-rocks|private-van|dia-shuttle|red-rocks-shuttle-options|red-rocks-transportation-options)',
        destination: '/book-shuttle',
        permanent: true,
      },

      // --- Security & Spam Shield ---
      // Redirecting weird community or proxy paths back to safety.
      {
        source: '/community/:path*',
        destination: '/guide',
        permanent: true,
      },
      {
        source: '/(schedule|panic|choppa|after-party|general-7|faq)',
        destination: '/guide',
        permanent: true,
      }
    ];
  },

  // 3. Crawl Control
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
};

module.exports = nextConfig;
