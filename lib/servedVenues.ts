import { ALL_VENUES, type CanonicalVenue } from "@/lib/venues/registry";

export type ServedVenueGroup = {
  title: string;
  description: string;
  slugs: string[];
};

const SERVED_VENUE_GROUPS: ServedVenueGroup[] = [
  {
    title: "Red Rocks & Canyon Amphitheatres",
    description: "Flagship Red Rocks private group service plus Poudre Canyon private charters.",
    slugs: ["red-rocks-amphitheatre", "mishawaka-amphitheatre"],
  },
  {
    title: "Denver - Large Venues",
    description: "Major concert rooms, arenas, and amphitheatres around Denver.",
    slugs: [
      "mission-ballroom",
      "ball-arena",
      "fiddlers-green-amphitheatre",
      "fillmore-auditorium",
      "levitt-pavilion-denver",
      "paramount-theatre",
    ],
  },
  {
    title: "Denver - Medium & Club Venues",
    description: "Popular Denver theaters and ballrooms with private group charter coverage.",
    slugs: [
      "ogden-theatre",
      "gothic-theatre",
      "cervantes-masterpiece",
      "bluebird-theater",
      "summit-music-hall",
    ],
  },
  {
    title: "Boulder",
    description: "Boulder theaters with active private group charter support.",
    slugs: ["boulder-theater", "fox-theatre"],
  },
];

/**
 * Canonical 15 actively served Colorado concert venues (all present in `venues.registry.json`).
 * The remaining 9 entries in the 24-venue registry are:
 * - 1 permanently closed/demolished historical venue (`1stbank-center`)
 * - 8 unserved club/campus/Colorado Springs venues (`black-sheep`, `broadmoor-world-arena`,
 *   `ford-amphitheater-colorado-springs`, `chautauqua-auditorium`, `macky-auditorium`,
 *   `larimer-lounge`, `marquis-theater`, `ophelias`).
 */
export const ACTIVE_PARR_VENUE_SLUGS: readonly string[] = SERVED_VENUE_GROUPS.flatMap(
  (group) => group.slugs
);

const VENUES_BY_SLUG = new Map<string, CanonicalVenue>(
  ALL_VENUES.map((venue) => [venue.slug, venue])
);
if (!VENUES_BY_SLUG.has("mishawaka-amphitheatre")) {
  VENUES_BY_SLUG.set("mishawaka-amphitheatre", {
    slug: "mishawaka-amphitheatre",
    name: "Mishawaka Amphitheatre",
    city: "Bellvue",
    state: "CO",
    neighborhood: "Poudre Canyon",
    capacity: 1000,
    kind: "amphitheatre",
    region: "Northern Colorado",
    featured: true,
  });
}

export function getServedVenueGroups(): Array<ServedVenueGroup & { venues: CanonicalVenue[] }> {
  return SERVED_VENUE_GROUPS.map((group) => ({
    ...group,
    venues: group.slugs
      .map((slug) => VENUES_BY_SLUG.get(slug))
      .filter((venue): venue is CanonicalVenue => Boolean(venue)),
  })).filter((group) => group.venues.length > 0);
}

export function getServedVenues() {
  return getServedVenueGroups().flatMap((group) => group.venues);
}
