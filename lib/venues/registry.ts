import venuesJson from "@/data/venues.json";

export type CanonicalVenue = {
  slug: string;
  name: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  capacity?: number;
  kind?: string;
  region?: string;
  featured?: boolean;
  seatgeekSlug?: string;
  seatgeekId?: number; // numeric SeatGeek venue id
};

function toNum(x: any): number | undefined {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string" && x.trim()) {
    const n = Number(x);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

const RAW = venuesJson as Record<string, any>;

export const ALL_VENUES: CanonicalVenue[] = Object.entries(RAW)
  .map(([slug, v]) => {
    const seatgeekSlug = v?.seatgeekSlug ?? v?.seatgeek_slug;
    const seatgeekId =
      toNum(v?.seatgeekVenueId) ??
      toNum(v?.seatgeekId) ??
      toNum(v?.seatgeek_id);

    return {
      slug,
      name: v?.name ?? slug.replace(/-/g, " "),
      city: v?.city,
      state: v?.state,
      neighborhood: v?.neighborhood ?? v?.loc,
      capacity: toNum(v?.capacity),
      kind: v?.kind,
      region: v?.region,
      featured: !!v?.featured,
      seatgeekSlug,
      seatgeekId,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export const FEATURED_VENUES: CanonicalVenue[] = ALL_VENUES.filter((v) => v.featured);

// Back-compat for existing imports (week-events, older code)
export const VENUE_REGISTRY = FEATURED_VENUES;
