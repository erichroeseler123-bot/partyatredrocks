// Central source of truth for non-event imagery.
// Rule: homepage, hubs, guides, and booking/fleet surfaces should use these
// fixed curated assets instead of broad dynamic image resolution.

export const curatedImages = {
  homepageHero: "/hero/hero_red_rocks.jpg",
  homepageShared: "/hero/sprinter_red_rocks.jpg",
  homepagePrivate: "/images/marketing/vip-suv.webp",

  guideHero: "/hero/hero-guides.jpg",
  guideGeneral: "/hero/hero-home.webp",
  guideTransportation: "/hero/arrival.jpg",
  guideParking: "/venues/rrsite.jpg",
  guidePickup: "/images/marketing/vip-suv.webp",
  guidePolicy: "/hero/price.jpg",
  guideTailgating: "/images/marketing/fleet.webp",

  socialHero: "/images/marketing/fleet.webp",
  weekHero: "/hero/arrival.jpg",
  venuesHero: "/venues/rrsite.jpg",
  aboutHero: "/hero/price.jpg",
  scheduleHero: "/hero/arrival.jpg",

  sharedShuttle: "/hero/sprinter_red_rocks.jpg",
  privateSUV: "/images/marketing/vip-suv.webp",
  sprinterVan: "/fleet/fleet-sprinter.webp",
  partyBus: "/images/marketing/fleet.webp",

  redRocksVenue: "/venues/rrsite.jpg",
  venueFallback: "/images/venues/fallback.jpg",
  showFallback: "/images/shows/fallback.jpg",
} as const;
