// lib/venues/registry.ts
export type CanonicalVenue = {
  // your site URL slug: /venues/[slug]
  slug: string;

  // Display name on your site
  name: string;

  // Your local metadata (optional but useful)
  city?: string;
  state?: string;
  address?: string;
  pickupNote?: string;

  // SeatGeek mapping (fill these in over time)
  seatgeekSlug?: string;   // preferred: exact SeatGeek venue slug
  seatgeekId?: number;     // best: numeric id once resolved
};

export const VENUE_REGISTRY: CanonicalVenue[] = [
  {
    slug: "red-rocks-amphitheatre",
    name: "Red Rocks Amphitheatre",
    city: "Morrison",
    state: "CO",
    seatgeekSlug: "red-rocks-amphitheatre",
  },
  {
    slug: "mission-ballroom",
    name: "Mission Ballroom",
    city: "Denver",
    state: "CO",
    seatgeekSlug: "mission-ballroom",
  },
  {
    slug: "bluebird-theater",
    name: "Bluebird Theater",
    city: "Denver",
    state: "CO",
    // IMPORTANT: your discovered correct SeatGeek slug:
    seatgeekSlug: "bluebird-theater-denver",
  },
  {
    slug: "fiddlers-green-amphitheatre",
    name: "Fiddler's Green Amphitheatre",
    city: "Greenwood Village",
    state: "CO",
    // IMPORTANT: your discovered correct SeatGeek slug:
    seatgeekSlug: "fiddler-s-green-amphitheatre",
  },
  // Add more…
];

export function getCanonicalVenueBySiteSlug(siteSlug: string) {
  return VENUE_REGISTRY.find(v => v.slug === siteSlug) ?? null;
}
