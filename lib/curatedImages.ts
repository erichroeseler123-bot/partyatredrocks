// Central source of truth for non-event imagery.
// Reset rule:
// - Hero slots use only approved wide local assets unless a page needs an intentional sourced query.
// - Homepage/booking slots use fixed local files only.
// - Dynamic selection is for event/show surfaces, not hub or booking heroes.

const searchedImage = (query: string) => `/api/unsplash-image?q=${encodeURIComponent(query)}`;

export const curatedImages = {
  // Homepage / top-level commercial slots
  homepageHero: "/hero/hero_red_rocks.jpg",
  homepageShared: "/fleet/fleet-sprinter.jpg",
  homepagePrivate: "/fleet/fleet-suburban.jpg",

  // Hub heroes
  guideHero: "/hero/hero_red_rocks.jpg",
  guideGeneral: "/hero/custom/red_rocks_sunset_hero.jpg",
  guideTransportation: "/hero/arrival.jpg",
  guideParking: "/hero/custom/red_rocks_25_hero.jpg",
  guidePickup: "/hero/sprinter_red_rocks.jpg",
  guidePolicy: "/hero/custom/tophalf_hero.jpg",
  guideTailgating: "/hero/hero-home.jpg",

  // Compare page sourced visuals
  compareHero: searchedImage("red rocks amphitheatre parking sunset"),
  compareShared: searchedImage("group shuttle van people boarding night"),
  compareSUV: searchedImage("black suv mountain road scenic"),
  compareVan: searchedImage("black sprinter van exterior mountain road"),

  // Logistics page sourced visuals
  logisticsHero: searchedImage("red rocks amphitheatre walking up stairs concert night"),
  logisticsPickup: searchedImage("friends meeting outside bar night city"),
  logisticsArrival: searchedImage("red rocks amphitheatre walking up stairs concert night"),
  logisticsExit: searchedImage("concert crowd leaving parking lot night cars"),
  logisticsRideHome: searchedImage("friends in car night city lights"),

  socialHero: "/hero/hero-home.jpg",
  weekHero: "/hero/arrival.jpg",
  venuesHero: "/venues/rrsite.jpg",
  aboutHero: "/hero/hero-home.jpg",
  scheduleHero: "/hero/arrival.jpg",

  // Booking / fleet slots
  sharedShuttle: "/fleet/fleet-sprinter.jpg",
  privateSUV: "/hero/hero_red_rocks.jpg",
  sprinterVan: "/hero/sprinter_red_rocks.jpg",
  partyBus: "/images/marketing/fleet.webp",

  redRocksVenue: "/venues/rrsite.jpg",
  venueFallback: "/images/venues/fallback.jpg",
  showFallback: "/images/shows/fallback.jpg",
} as const;
