import { ALL_VENUES, type CanonicalVenue } from "@/lib/venues/registry";

export type ServedVenueGroup = {
  title: string;
  description: string;
  slugs: string[];
};

const SERVED_VENUE_GROUPS: ServedVenueGroup[] = [
  {
    title: "Red Rocks",
    description: "The main shuttle destination.",
    slugs: ["red-rocks-amphitheatre"],
  },
  {
    title: "Denver - Large Venues",
    description: "Major concert rooms and amphitheatres around Denver.",
    slugs: [
      "mission-ballroom",
      "ball-arena",
      "fiddlers-green-amphitheatre",
      "fillmore-auditorium",
      "1stbank-center",
      "levitt-pavilion-denver",
    ],
  },
  {
    title: "Denver - Medium Venues",
    description: "Popular theaters and ballrooms for regular concert nights.",
    slugs: ["ogden-theatre", "gothic-theatre", "cervantes-masterpiece"],
  },
  {
    title: "Smaller Rooms",
    description: "Smaller Denver venues we cover.",
    slugs: ["bluebird-theater", "summit-music-hall", "marquis-theater"],
  },
  {
    title: "Boulder",
    description: "Boulder venues with active shuttle support.",
    slugs: ["boulder-theater", "fox-theatre"],
  },
];

const VENUES_BY_SLUG = new Map(ALL_VENUES.map((venue) => [venue.slug, venue]));

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
