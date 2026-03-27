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
  guideHero: "/hero/hero_red_rocks.jpg",
  guideGeneral: "/hero/custom/red_rocks_sunset_hero.jpg",
  guideTransportation: "/hero/arrival.jpg",
  guideParking: "/hero/custom/red_rocks_25_hero.jpg",
  guidePickup: "/hero/sprinter_red_rocks.jpg",
  guidePolicy: "/hero/custom/tophalf_hero.jpg",
  guideTailgating: "/hero/hero-home.jpg",

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
