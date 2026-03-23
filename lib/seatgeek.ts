// lib/seatgeek.ts
type SeatGeekVenue = {
  id: number;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  address?: string;
  extended_address?: string;
  url?: string;
};

type SeatGeekEvent = {
  id: number;
  title: string;
  datetime_local: string;
  datetime_utc?: string;
  datetime?: string;
  url?: string;
  performers?: Array<{
    name?: string;
    image?: string;
    images?: {
      huge?: string;
      banner?: string;
      block?: string;
      crisp?: string;
    };
  }>;
  venue?: SeatGeekVenue;
};

const SEATGEEK_BASE = "https://api.seatgeek.com/2";

function requireSeatGeekKey() {
  const key = process.env.SEATGEEK_CLIENT_ID || process.env.NEXT_PUBLIC_SEATGEEK_CLIENT_ID;
  if (!key) {
    throw new Error(
      "Missing SeatGeek key. Set SEATGEEK_CLIENT_ID (recommended) or NEXT_PUBLIC_SEATGEEK_CLIENT_ID."
    );
  }
  return key;
}

function norm(s?: string) {
  return (s ?? "").trim().toLowerCase();
}

function scoreVenueCandidate(opts: {
  candidate: SeatGeekVenue;
  targetName: string;
  targetSlug?: string;
}) {
  const c = opts.candidate;
  const targetName = norm(opts.targetName);
  const targetSlug = norm(opts.targetSlug);

  let score = 0;

  // Strong location bias to CO/Denver to avoid NYC theater junk
  if (norm(c.state) === "co") score += 50;
  if (norm(c.city) === "denver") score += 20;

  // Name similarity
  const candName = norm(c.name);
  if (candName === targetName) score += 80;
  else if (candName.includes(targetName) || targetName.includes(candName)) score += 35;

  // Slug similarity (if we have a hint)
  const candSlug = norm(c.slug);
  if (targetSlug && candSlug === targetSlug) score += 120;
  else if (targetSlug && (candSlug.includes(targetSlug) || targetSlug.includes(candSlug)))
    score += 45;

  // Penalize non-CO hard
  if (c.state && norm(c.state) !== "co") score -= 60;

  return score;
}

async function sgFetch<T>(path: string, params: Record<string, string>, init?: RequestInit): Promise<T> {
  const key = requireSeatGeekKey();
  const url = new URL(`${SEATGEEK_BASE}${path}`);
  url.searchParams.set("client_id", key);

  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    ...init,
    next: { revalidate: 1800 }, // 30 min cache for server fetches
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`SeatGeek error ${res.status} on ${path}: ${text.slice(0, 500)}`);
  }

  return (await res.json()) as T;
}

/** Exact venue lookup by SeatGeek slug */
export async function seatgeekVenueBySlug(seatgeekSlug: string): Promise<SeatGeekVenue | null> {
  const data = await sgFetch<{ venues: SeatGeekVenue[] }>(
    "/venues",
    { slug: seatgeekSlug }
  );
  return data.venues?.[0] ?? null;
}

/** Smart fallback: search by name, bias to Denver/CO and score best match */
export async function seatgeekVenueByQuerySmart(targetName: string, targetSlugHint?: string) {
  const data = await sgFetch<{ venues: SeatGeekVenue[] }>(
    "/venues",
    {
      q: targetName,
      per_page: "25",

      // Geo bias around Denver (helps prevent NY/LA wrong matches)
      lat: "39.7392",
      lon: "-104.9903",
      range: "120mi",
    }
  );

  const venues = data.venues ?? [];
  if (!venues.length) return null;

  let best: SeatGeekVenue | null = null;
  let bestScore = -99999;

  for (const v of venues) {
    const s = scoreVenueCandidate({
      candidate: v,
      targetName,
      targetSlug: targetSlugHint,
    });
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }

  // Guardrail to avoid garbage matches
  if (!best || bestScore < 40) return null;
  return best;
}

/**
 * Resolve SeatGeek venue:
 * 1) If seatgeekSlug is known, try /venues?slug=
 * 2) Else fallback /venues?q= with Denver/CO scoring
 */
export async function resolveSeatGeekVenue(opts: {
  targetName: string;
  seatgeekSlug?: string;
  siteSlug?: string;
}): Promise<SeatGeekVenue | null> {
  if (opts.seatgeekSlug) {
    const v = await seatgeekVenueBySlug(opts.seatgeekSlug);
    if (v) return v;
  }

  return await seatgeekVenueByQuerySmart(opts.targetName, opts.siteSlug ?? opts.seatgeekSlug);
}

/**
 * Fetch events by venue numeric id.
 * IMPORTANT: SeatGeek expects "venue.id" (not venue_id) for /events filtering in many implementations.
 */
export async function seatgeekEventsByVenueId(venueId: number): Promise<SeatGeekEvent[]> {
  if (!Number.isFinite(venueId)) {
    throw new Error(`Invalid venueId passed to seatgeekEventsByVenueId: ${String(venueId)}`);
  }

  const data = await sgFetch<{ events: SeatGeekEvent[] }>(
    "/events",
    {
      "venue.id": String(venueId),
      per_page: "50",
      sort: "datetime_local.asc",
    }
  );

  return data.events ?? [];
}
