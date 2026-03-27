// Central source of truth for non-event imagery.
// Rule: homepage, hubs, guides, and booking/fleet surfaces should use these
// fixed curated assets instead of broad dynamic image resolution.

export const curatedImages = {
  homepageHero: "/hero/hero_red_rocks.jpg",
  homepageShared: "/images/marketing/vip-suv.webp",
  homepagePrivate: "/hero/sprinter_red_rocks.jpg",

  guideHero: "/hero/custom/red_rocks_sunset_hero.jpg",
  guideGeneral: "/hero/hero-home.webp",
  guideTransportation: "/hero/arrival.jpg",
  guideParking: "/venues/rrsite.jpg",
  guidePickup: "/images/marketing/vip-suv.webp",
  guidePolicy: "/hero/price.jpg",
  guideTailgating: "/images/marketing/fleet.webp",

  socialHero: "/hero/hero-home.jpg",
  weekHero: "/hero/arrival.jpg",
  venuesHero: "/venues/rrsite.jpg",
  aboutHero: "/hero/hero-home.jpg",
  scheduleHero: "/hero/hero-home.jpg",

  sharedShuttle: "/images/marketing/vip-suv.webp",
  privateSUV: "/hero/sprinter_red_rocks.jpg",
  sprinterVan: "/fleet/fleet-sprinter.webp",
  partyBus: "/images/marketing/fleet.webp",

  redRocksVenue: "/venues/rrsite.jpg",
  venueFallback: "/images/venues/fallback.jpg",
  showFallback: "/images/shows/fallback.jpg",
} as const;
