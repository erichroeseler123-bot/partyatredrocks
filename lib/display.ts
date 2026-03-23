// lib/display.ts
import { buildUnsplashImageSrc } from "@/lib/unsplash";
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
      vipSuv: buildUnsplashImageSrc({ query: "private suv concert transportation denver night" }),
      fleet: buildUnsplashImageSrc({ query: "sprinter van concert transportation denver" }),
      shuttle: buildUnsplashImageSrc({ query: "concert shuttle bus denver night" }),
    },

    heroHome: buildUnsplashImageSrc({ query: "red rocks amphitheatre concert night denver" }),
    heroDefaultVenue: buildUnsplashImageSrc({ query: "red rocks amphitheatre concert crowd" }),

    sceneTiles: {
      jam: buildUnsplashImageSrc({ query: "jam band concert colorado" }),
      edm: buildUnsplashImageSrc({ query: "edm concert denver" }),
      hiphop: buildUnsplashImageSrc({ query: "hip hop concert denver" }),
      metal: buildUnsplashImageSrc({ query: "metal concert denver" }),
      bluegrass: buildUnsplashImageSrc({ query: "bluegrass concert colorado" }),
      indie: buildUnsplashImageSrc({ query: "indie concert denver" }),
      country: buildUnsplashImageSrc({ query: "country concert colorado" }),
      reggae: buildUnsplashImageSrc({ query: "reggae concert crowd" }),
      punk: buildUnsplashImageSrc({ query: "punk concert denver" }),
      latin: buildUnsplashImageSrc({ query: "latin concert denver" }),
    },

    // venue images keyed by venue slug
    venues: {
      fallback: buildUnsplashImageSrc({ query: "denver concert venue exterior" }),
      "cervantes-masterpiece": buildUnsplashImageSrc({ query: "cervantes masterpiece denver concert venue" }),
      "fiddlers-green-amphitheatre": buildUnsplashImageSrc({ query: "fiddlers green amphitheatre concert venue colorado" }),
      "fillmore-auditorium": buildUnsplashImageSrc({ query: "fillmore auditorium denver concert venue" }),
      "gothic-theatre": buildUnsplashImageSrc({ query: "gothic theatre denver concert venue" }),
      "mission-ballroom": buildUnsplashImageSrc({ query: "mission ballroom denver concert venue" }),
      "red-rocks-amphitheatre": buildUnsplashImageSrc({ query: "red rocks amphitheatre concert venue" }),
    },

    showFallback: buildUnsplashImageSrc({ query: "concert stage crowd lights" }),
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
      { label: "Schedule", href: "/schedule" },
      { label: "Guides", href: "/guide" },
      { label: "Scene", href: "/scenes" },
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
