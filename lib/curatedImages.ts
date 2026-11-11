// Central source of truth for non-event imagery.
// Reset rule:
// - Hero slots use only approved wide local assets from verified provenance.
// - Homepage/booking slots use fixed local files only.
// - Dynamic selection is for event/show surfaces, not hub or booking heroes.

export const curatedImages = {
  // Homepage / top-level commercial slots (3 distinct verified visuals)
  homepageHero: "/hero/hero_red_rocks.webp",
  homepageSuburban: "/hero/arrival_thumb.webp",
  homepageShared: "/hero/sprinter_red_rocks_card.webp",
  homepagePrivate: "/hero/arrival_thumb.webp",

  // Hub heroes
  guideHero: "/hero/hero_red_rocks.webp",
  guideGeneral: "/images/red-rocks/Panorama_of_Red_Rocks_Amphitheater.jpg",
  guideTransportation: "/assets/venue/red-rocks/red-rocks-shuttle.jpg",
  guideParking: "/assets/venue/red-rocks/red-rocks-arrival.webp",
  guidePickup: "/hero/arrival.jpg",
  guidePolicy: "/images/red-rocks/trading-post-trail-sign-red-rocks.jpg",
  guideTailgating: "/images/red-rocks/red-rocks-trading-post-backyard.jpg",

  // Compare page verified local visuals
  compareHero: "/images/red-rocks/Panorama_of_Red_Rocks_Amphitheater.jpg",
  compareShared: "/assets/venue/red-rocks/red-rocks-shuttle.jpg",
  compareSUV: "/fleet/fleet-suburban.jpg",
  compareVan: "/hero/sprinter_red_rocks.webp",

  // Logistics page verified local visuals
  logisticsHero: "/hero/afterdark.jpg",
  logisticsPickup: "/hero/arrival.jpg",
  logisticsArrival: "/assets/venue/red-rocks/red-rocks-arrival.webp",
  logisticsExit: "/images/red-rocks/red-rocks-amphitheater-from-top.jpg",
  logisticsRideHome: "/hero/hero_red_rocks.webp",

  socialHero: "/venues/rrsite.webp",
  weekHero: "/images/red-rocks/red-rocks-amphitheater-from-top.jpg",
  venuesHero: "/venues/rrsite.webp",
  aboutHero: "/images/red-rocks/Panorama_of_Red_Rocks_Amphitheater.jpg",
  scheduleHero: "/hero/arrival.jpg",
  scenesHero: "/images/scenes/jam.webp",

  // Booking / fleet slots
  sharedShuttle: "/hero/sprinter_red_rocks.webp",
  privateSUV: "/hero/hero_red_rocks.webp",
  sprinterVan: "/hero/sprinter_red_rocks.webp",
  partyBus: "/fleet/fleet-suburban.jpg",

  redRocksVenue: "/venues/rrsite.webp",
  redRocksVenueThumb: "/venues/rrsite_thumb.webp",
  venueFallback: "/images/venues/all-venues-collage.webp",
  showFallback: "/venues/rrsite.webp",
} as const;
