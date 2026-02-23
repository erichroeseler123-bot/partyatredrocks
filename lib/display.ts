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
    heroHome: "/hero/hero-home.jpg",
    heroDefaultVenue: "/hero/hero-home.jpg",

    sceneTiles: {
      jam: "/images/scenes/jam.jpg",
      edm: "/images/scenes/edm.jpg",
      hiphop: "/images/scenes/hiphop.jpg",
    },

    venueFallback: "/images/venues/fallback.jpg",
    showFallback: "/images/shows/fallback.jpg",
  },

  ui: {
    brand: "Party @ Red Rocks",
    cta: {
      primary: "Book Shuttle",
      secondary: "This Week",
    },
  },

  nav: {
    links: [
      { label: "Book", href: "/book" },
      { label: "This Week", href: "/week" },
      { label: "Venues", href: "/venues" },
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
    ],
  },
} as const;

// derived helpers
export const NAV_LINKS = DISPLAY.nav.links;

export const VENUE_PILLS = DISPLAY.pills.venueSlugs
  .map((slug) => VENUES.find((v) => v.slug === slug))
  .filter(Boolean)
  .map((v) => ({ name: v!.name, slug: v!.slug }));

export const SCENE_PILLS = DISPLAY.pills.scenes;
