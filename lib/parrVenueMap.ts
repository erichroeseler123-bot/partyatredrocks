import { DCC_ORIGIN, buildBookingHref, normalizeVenueSlug } from "@/lib/parrHandoff";

export type ParrDccVenueEntry = {
  slug: string;
  parrVenuePath: string;
  bookingPath: string;
  dccAuthorityPath: string;
};

export const PARR_DCC_VENUE_MAP: Record<string, ParrDccVenueEntry> = {
  "red-rocks-amphitheatre": {
    slug: "red-rocks-amphitheatre",
    parrVenuePath: "/venues/red-rocks-amphitheatre",
    bookingPath: "/book/red-rocks-amphitheatre",
    dccAuthorityPath: `${DCC_ORIGIN}/red-rocks`,
  },
  "mission-ballroom": {
    slug: "mission-ballroom",
    parrVenuePath: "/venues/mission-ballroom",
    bookingPath: buildBookingHref({ target: "book", venue: "mission-ballroom" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/mission-ballroom`,
  },
  "ball-arena": {
    slug: "ball-arena",
    parrVenuePath: "/venues/ball-arena",
    bookingPath: buildBookingHref({ target: "book", venue: "ball-arena" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/ball-arena`,
  },
  "fiddlers-green-amphitheatre": {
    slug: "fiddlers-green-amphitheatre",
    parrVenuePath: "/venues/fiddlers-green-amphitheatre",
    bookingPath: buildBookingHref({ target: "book", venue: "fiddlers-green-amphitheatre" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/fiddlers-green-amphitheatre`,
  },
  "fillmore-auditorium": {
    slug: "fillmore-auditorium",
    parrVenuePath: "/venues/fillmore-auditorium",
    bookingPath: buildBookingHref({ target: "book", venue: "fillmore-auditorium" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/fillmore-auditorium`,
  },
  "1stbank-center": {
    slug: "1stbank-center",
    parrVenuePath: "/venues/1stbank-center",
    bookingPath: buildBookingHref({ target: "book", venue: "1stbank-center" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/1stbank-center`,
  },
  "levitt-pavilion-denver": {
    slug: "levitt-pavilion-denver",
    parrVenuePath: "/venues/levitt-pavilion-denver",
    bookingPath: buildBookingHref({ target: "book", venue: "levitt-pavilion-denver" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/levitt-pavilion-denver`,
  },
  "ogden-theatre": {
    slug: "ogden-theatre",
    parrVenuePath: "/venues/ogden-theatre",
    bookingPath: buildBookingHref({ target: "book", venue: "ogden-theatre" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/ogden-theatre`,
  },
  "gothic-theatre": {
    slug: "gothic-theatre",
    parrVenuePath: "/venues/gothic-theatre",
    bookingPath: buildBookingHref({ target: "book", venue: "gothic-theatre" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/gothic-theatre`,
  },
  "cervantes-masterpiece": {
    slug: "cervantes-masterpiece",
    parrVenuePath: "/venues/cervantes-masterpiece",
    bookingPath: buildBookingHref({ target: "book", venue: "cervantes-masterpiece" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/cervantes-masterpiece`,
  },
  "bluebird-theater": {
    slug: "bluebird-theater",
    parrVenuePath: "/venues/bluebird-theater",
    bookingPath: buildBookingHref({ target: "book", venue: "bluebird-theater" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/bluebird-theater`,
  },
  "summit-music-hall": {
    slug: "summit-music-hall",
    parrVenuePath: "/venues/summit-music-hall",
    bookingPath: buildBookingHref({ target: "book", venue: "summit-music-hall" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/summit-music-hall`,
  },
  "marquis-theater": {
    slug: "marquis-theater",
    parrVenuePath: "/venues/marquis-theater",
    bookingPath: buildBookingHref({ target: "book", venue: "marquis-theater" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/marquis-theater`,
  },
  "boulder-theater": {
    slug: "boulder-theater",
    parrVenuePath: "/venues/boulder-theater",
    bookingPath: buildBookingHref({ target: "book", venue: "boulder-theater" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/boulder-theater`,
  },
  "fox-theatre": {
    slug: "fox-theatre",
    parrVenuePath: "/venues/fox-theatre",
    bookingPath: buildBookingHref({ target: "book", venue: "fox-theatre" }),
    dccAuthorityPath: `${DCC_ORIGIN}/venues/fox-theatre`,
  },
} as const;

export function getParrDccVenueEntry(slug?: string | null) {
  const normalized = normalizeVenueSlug(slug);
  if (!normalized) return null;
  return PARR_DCC_VENUE_MAP[normalized] ?? null;
}

export function getPlanningLinksForVenue(slug?: string | null) {
  const entry = getParrDccVenueEntry(slug);
  if (!entry) return [];

  if (entry.slug === "red-rocks-amphitheatre") {
    return [
      { label: "Red Rocks Guide", href: `${DCC_ORIGIN}/red-rocks` },
      { label: "Parking Guide", href: `${DCC_ORIGIN}/red-rocks/parking` },
      { label: "Transportation Guide", href: `${DCC_ORIGIN}/red-rocks/transportation` },
    ];
  }

  return [{ label: "Venue Guide", href: entry.dccAuthorityPath }];
}
