// Central source of truth for non-event imagery.
// Rule: homepage, hubs, guides, and booking/fleet surfaces should use these
// fixed curated assets instead of broad dynamic image resolution.

export const curatedImages = {
  homepageHero: "/hero/hero-home.webp",
  homepageShared: "/images/marketing/shuttle.webp",
  homepagePrivate: "/images/marketing/vip-suv.webp",

  guideHero: "/hero/hero-guides.jpg",
  guideGeneral: "/hero/hero-home.webp",
  guideTransportation: "/hero/arrival.jpg",
  guideParking: "/venues/rrsite.jpg",
  guidePickup: "/images/marketing/vip-suv.webp",
  guidePolicy: "/hero/price.jpg",
  guideTailgating: "/images/marketing/fleet.webp",

  socialHero: "/hero/afterdark.jpg",
  weekHero: "/hero/hero-home.jpg",
  venuesHero: "/venues/rrsite.jpg",
  aboutHero: "/hero/hero-home.jpg",

  sharedShuttle: "/images/marketing/shuttle.webp",
  privateSUV: "/images/marketing/vip-suv.webp",
  sprinterVan: "/fleet/fleet-sprinter.webp",
  partyBus: "/images/marketing/fleet.webp",

  redRocksVenue: "/venues/rrsite.jpg",
  venueFallback: "/images/venues/fallback.jpg",
  showFallback: "/images/shows/fallback.jpg",
} as const;
