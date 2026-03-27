// Central source of truth for non-event imagery.
// Reset rule:
// - Hero slots use only approved wide local assets.
// - Homepage/booking slots use fixed local files only.
// - Dynamic selection is for event/show surfaces, not hub or booking heroes.

export const curatedImages = {
  // Homepage / top-level commercial slots
  homepageHero: "/hero/hero_red_rocks.jpg",
  homepageShared: "/hero/sprinter_red_rocks.jpg",
  homepagePrivate: "/images/marketing/vip-suv.webp",

  // Hub heroes
  guideHero: "/hero/hero-guides.jpg",
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
  scheduleHero: "/hero/arrival.jpg",

  // Booking / fleet slots
  sharedShuttle: "/hero/sprinter_red_rocks.jpg",
  privateSUV: "/images/marketing/vip-suv.webp",
  sprinterVan: "/hero/sprinter_red_rocks.jpg",
  partyBus: "/images/marketing/fleet.webp",

  redRocksVenue: "/venues/rrsite.jpg",
  venueFallback: "/images/venues/fallback.jpg",
  showFallback: "/images/shows/fallback.jpg",
} as const;
