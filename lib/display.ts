// lib/display.ts
import { VENUES } from "@/lib/venues";

export const DISPLAY = {
  theme: {
    surface: "#070A12",
    surface2: "#0B1020",
    text: "#E8EEF9",
    muted: "rgba(232,238,249,0.72)",
    accent: "#FF3B3B",
    accent2: "#4CC9F0",
    glow: "rgba(76,201,240,0.28)",
    heroOverlay:
      "linear-gradient(180deg, rgba(7,10,18,0.10) 0%, rgba(7,10,18,0.72) 55%, rgba(7,10,18,0.92) 100%)",
  },

  images: {
    marketing: {
      vipSuv: "/images/marketing/vip-suv.jpg",
      fleet: "/images/marketing/fleet.jpg",
      shuttle: "/images/marketing/shuttle.jpg",
    },

    heroHome: "/hero/hero-home.jpg",
    heroDefaultVenue: "/hero/hero-home.jpg",

    sceneTiles: {
      jam: "/images/scenes/jam.jpg",
      edm: "/images/scenes/edm.jpg",
      hiphop: "/images/scenes/hiphop.jpg",
      metal: "/images/scenes/metal.jpg",
      bluegrass: "/images/scenes/bluegrass.jpg",
      indie: "/images/scenes/indie.jpg",
      country: "/images/scenes/country.jpg",
      reggae: "/images/scenes/reggae.jpg",
      punk: "/images/scenes/punk.jpg",
      latin: "/images/scenes/latin.jpg",
    },

    // venue images keyed by venue slug
    venues: {
      fallback: "/images/venues/fallback.jpg",
      "cervantes-masterpiece": "/images/venues/cervantes-masterpiece.jpg",
      "fiddlers-green-amphitheatre": "/images/venues/fiddlers-green-amphitheatre.jpg",
      "fillmore-auditorium": "/images/venues/fillmore-auditorium.jpg",
      "gothic-theatre": "/images/venues/gothic-theatre.jpg",
      "mission-ballroom": "/images/venues/mission-ballroom.jpg",
      "red-rocks-amphitheatre": "/images/venues/red-rocks-amphitheatre.jpg",
    },

    showFallback: "/images/shows/fallback.jpg",
  },

  ui: {
    brand: "Party @ Red Rocks",
    cta: {
      primary: "Book Shuttle",
      secondary: "This Week",
    },

    home: {
      badge: "Colorado Concert Shuttles",
      headline: "Red Rocks — without the parking chaos.",
      subhead:
        "Fixed-price shuttle seats and private SUVs from Denver to Red Rocks and major Colorado venues. No surge, no waiting, guaranteed ride home.",
      trustLine: "Sheraton pickup • Pro drivers • Clear meetup plan • Support text line",
      quickBookLabel: "Book in 10 seconds",
      tipPrefix: "Tip: browse an event on",
      tipLinkText: "This Week",
      tipSuffix: "then tap “Ride Options”.",
    },
  },

  nav: {
    links: [
      { label: "Book", href: "/book" },
      { label: "Guides", href: "/guide" },
      { label: "Shuttles", href: "/shuttles" },
      { label: "Scene", href: "/scene" },
    ],
  },

  pills: {
    // venue quick pills shown on homepage (order matters)
    venueSlugs: [
      "red-rocks-amphitheatre",
      "mission-ballroom",
      "fiddlers-green-amphitheatre",
      "fillmore-auditorium",
      "gothic-theatre",
      "cervantes-masterpiece",
    ],

    // scene pills shown on homepage
    scenes: [
      { key: "jam", label: "Jam", href: "/scene/jam" },
      { key: "edm", label: "EDM", href: "/scene/edm" },
      { key: "hiphop", label: "Hip-Hop", href: "/scene/hiphop" },
      { key: "metal", label: "Metal", href: "/scene/metal" },
      { key: "bluegrass", label: "Bluegrass", href: "/scene/bluegrass" },
      { key: "indie", label: "Indie", href: "/scene/indie" },
      { key: "country", label: "Country", href: "/scene/country" },
      { key: "reggae", label: "Reggae", href: "/scene/reggae" },
      { key: "punk", label: "Punk", href: "/scene/punk" },
      { key: "latin", label: "Latin", href: "/scene/latin" },
    ],
  },
} as const;

export function venueImage(slug: string) {
  const venues = DISPLAY.images.venues as Record<string, string>;
  return venues[slug] ?? venues.fallback ?? DISPLAY.images.showFallback;
}

// derived helpers
export const NAV_LINKS = DISPLAY.nav.links;

export const VENUE_PILLS = DISPLAY.pills.venueSlugs
  .map((slug) => VENUES.find((v) => v.slug === slug))
  .filter(Boolean)
  .map((v) => ({ name: v!.name, slug: v!.slug }));

export const SCENE_PILLS = DISPLAY.pills.scenes;
