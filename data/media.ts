import venueMediaRegistry from "@/data/venue-media.registry.json";
import guideMediaRegistry from "@/data/guide-media.registry.json";
import bookingMediaRegistry from "@/data/booking-media.registry.json";
import socialProofRegistry from "@/data/social-proof.registry.json";

type VenueMediaRegistryEntry = {
  wikiTitle?: string | null;
  manualImage?: string | null;
  resolvedImage?: string | null;
  fallbackImage?: string | null;
};

type GuideMediaRegistryEntry = {
  manualImage?: string | null;
  resolvedImage?: string | null;
  fallbackImage?: string | null;
};

type BookingMediaRegistryEntry = {
  aliases?: string[];
  heroImage?: string | null;
  heroAlt?: string | null;
  cardImage?: string | null;
  cardAlt?: string | null;
};

type SocialProofRegistryEntry = {
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export const MEDIA = {
  scenes: {
    jam: {
      primary: "/images/scenes/jam.webp",
    },
    edm: {
      primary: "/images/scenes/edm.webp",
    },
    hiphop: {
      primary: "/images/scenes/hiphop.webp",
    },
    metal: {
      primary: "/images/venues/fillmore-auditorium.webp",
    },
    bluegrass: {
      primary: "/venues/mishsite.webp",
    },
    indie: {
      primary: "/images/venues/gothic-theatre.webp",
    },
    country: {
      primary: "/images/venues/fiddlers-green-amphitheatre.webp",
    },
    reggae: {
      primary: "/images/venues/cervantes-masterpiece.webp",
    },
    punk: {
      primary: "/images/venues/mission-ballroom.webp",
    },
    latin: {
      primary: "/images/venues/red-rocks-amphitheatre.webp",
    },
  },
} as const;

const DEFAULT_FALLBACK = "/images/venues/fallback.webp";
const DEFAULT_GUIDE_FALLBACK = "/hero/hero-guides.webp";
const DEFAULT_SOCIAL_FALLBACK = "/images/marketing/fleet.webp";

const TRANSPORT_RELATED_MEDIA = {
  shuttle: {
    imageSrc: "/images/marketing/shuttle.webp",
    imageAlt: "Shuttle loading for a Red Rocks show night",
  },
  fleet: {
    imageSrc: "/images/marketing/fleet.webp",
    imageAlt: "Fleet lineup for concert transportation and group pickup",
  },
} as const;

export const VENUE_MEDIA_REGISTRY = venueMediaRegistry as Record<string, VenueMediaRegistryEntry>;
export const GUIDE_MEDIA_REGISTRY = guideMediaRegistry as Record<string, GuideMediaRegistryEntry>;
export const BOOKING_MEDIA_REGISTRY = bookingMediaRegistry as Record<string, BookingMediaRegistryEntry>;
export const SOCIAL_PROOF_REGISTRY = socialProofRegistry as Record<string, SocialProofRegistryEntry>;

const BOOKING_ALIAS_TO_SLUG: Record<string, string> = Object.entries(BOOKING_MEDIA_REGISTRY).reduce(
  (acc, [slug, entry]) => {
    for (const alias of entry.aliases || []) {
      acc[alias] = slug;
    }
    return acc;
  },
  {} as Record<string, string>
);

function resolveVenueImage(slug: string) {
  const entry = VENUE_MEDIA_REGISTRY[slug];
  if (!entry) return DEFAULT_FALLBACK;
  return entry.manualImage || entry.resolvedImage || entry.fallbackImage || DEFAULT_FALLBACK;
}

function resolveGuideImage(slug: string) {
  const entry = GUIDE_MEDIA_REGISTRY[slug];
  if (!entry) return DEFAULT_GUIDE_FALLBACK;
  return entry.manualImage || entry.resolvedImage || entry.fallbackImage || DEFAULT_GUIDE_FALLBACK;
}

function resolveBookingSlug(slug: string) {
  return BOOKING_MEDIA_REGISTRY[slug] ? slug : BOOKING_ALIAS_TO_SLUG[slug] || slug;
}

function prettifySlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getVenueCardImage(slug: string) {
  return resolveVenueImage(slug);
}

export function getVenueHeroImage(slug: string) {
  return resolveVenueImage(slug);
}

export function getVenueMedia(slug: string) {
  const image = resolveVenueImage(slug);
  return { card: image, hero: image };
}

export function getGuideCardImage(slug: string) {
  return resolveGuideImage(slug);
}

export function getBookingVenueImage(slug: string): {
  hero: string;
  heroAlt: string;
  card: string;
  cardAlt: string;
} {
  const resolvedSlug = resolveBookingSlug(slug);
  const entry = BOOKING_MEDIA_REGISTRY[resolvedSlug];
  const venueFallback = resolveVenueImage(resolvedSlug);
  const prettyName = prettifySlug(resolvedSlug);

  return {
    hero: entry?.heroImage || venueFallback,
    heroAlt: entry?.heroAlt || `${prettyName} booking hero image`,
    card: entry?.cardImage || entry?.heroImage || venueFallback,
    cardAlt: entry?.cardAlt || `${prettyName} booking card image`,
  };
}

export function getVenueRelatedCardImage(input: {
  intent: "transport" | "guide" | "venue";
  slug?: string;
  transportKey?: keyof typeof TRANSPORT_RELATED_MEDIA;
}) {
  if (input.intent === "transport") {
    const key = input.transportKey || "shuttle";
    return TRANSPORT_RELATED_MEDIA[key] || TRANSPORT_RELATED_MEDIA.shuttle;
  }

  if (!input.slug) {
    return {
      imageSrc: DEFAULT_FALLBACK,
      imageAlt: "Related venue planning image",
    };
  }

  if (input.intent === "guide") {
    return {
      imageSrc: getGuideCardImage(input.slug),
      imageAlt: `${prettifySlug(input.slug)} guide image`,
    };
  }

  return {
    imageSrc: getVenueCardImage(input.slug),
    imageAlt: `${prettifySlug(input.slug)} venue image`,
  };
}

export function getSocialProofImage(postId: string) {
  const entry = SOCIAL_PROOF_REGISTRY[postId];
  return {
    imageUrl: entry?.imageUrl || DEFAULT_SOCIAL_FALLBACK,
    imageAlt: entry?.imageAlt || "Social proof image",
  };
}

export function assertUniqueGuideImages() {
  if (process.env.NODE_ENV === "production") return;

  const seen = new Map<string, string>();
  for (const [slug, item] of Object.entries(GUIDE_MEDIA_REGISTRY)) {
    const image = item.manualImage || item.resolvedImage || item.fallbackImage || DEFAULT_GUIDE_FALLBACK;
    const existing = seen.get(image);
    if (existing) {
      console.warn(`Duplicate guide image detected: ${slug} and ${existing} -> ${image}`);
      continue;
    }
    seen.set(image, slug);
  }
}

export function getSceneMedia(slug: string) {
  return MEDIA.scenes[slug as keyof typeof MEDIA.scenes] ?? { primary: DEFAULT_FALLBACK };
}
