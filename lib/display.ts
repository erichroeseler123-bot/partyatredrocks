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

    // scene tile images (add these files later in /public/images/scenes/)
    sceneTiles: {
      jam: "/images/scenes/jam.jpg",
      edm: "/images/scenes/edm.jpg",
      hiphop: "/images/scenes/hiphop.jpg",
    },

    venueFallback: "/images/venues/fallback.jpg",
    showFallback: "/images/shows/fallback.jpg",
  },

  ui: {
    ctaText: {
      primary: "Book Shuttle",
      secondary: "This Week",
    },
  },
} as const;
