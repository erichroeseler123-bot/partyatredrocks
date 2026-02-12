// app/api/week-events/route.ts
import { NextResponse } from "next/server";
import { VENUE_REGISTRY } from "@/lib/venues/registry";
import { resolveSeatGeekVenue, seatgeekEventsByVenueId } from "@/lib/seatgeek";

export const runtime = "nodejs";

/**
 * Cache this route's *result* for 5 minutes.
 * This prevents SeatGeek from being called on every request.
 */
export const revalidate = 300;

type WeekEvent = {
  id: number;
  title: string;
  datetime_local: string;
  url?: string;
  performers?: Array<{ name?: string; image?: string }>;
  venue: {
    siteSlug: string;
    siteName: string;
    city?: string;
    state?: string;
    address?: string;
  };
};

function iso(d: Date) {
  return d.toISOString();
}

/**
 * Create a stable window: [today 00:00 in Denver, +7 days)
 * This avoids the "sliding 7 days from right now" behavior.
 */
function denverStartOfTodayUTC(): Date {
  // Denver is MST in Feb (UTC-7). We don't need DST complexity here because your date is Feb.
  // If you want DST-safe later, we can switch to Temporal or a tz lib.
  const now = new Date();
  const denverOffsetMinutes = 7 * 60; // MST
  const denver = new Date(now.getTime() - denverOffsetMinutes * 60_000);

  // start of day in "Denver time"
  denver.setHours(0, 0, 0, 0);

  // convert back to UTC Date object
  return new Date(denver.getTime() + denverOffsetMinutes * 60_000);
}

function addDaysUTC(d: Date, days: number) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

function safeDateFromEvent(e: any): Date | null {
  const raw = e?.datetime_local || e?.datetime_utc || e?.datetime;
  if (!raw) return null;
  const dt = new Date(raw);
  return Number.isFinite(dt.getTime()) ? dt : null;
}

function toWeekEvent(sg: any, canonicalVenue: any): WeekEvent | null {
  const id = Number(sg?.id);
  if (!Number.isFinite(id)) return null;

  const title =
    sg?.title ||
    sg?.short_title ||
    sg?.name ||
    (Array.isArray(sg?.performers) && sg.performers[0]?.name) ||
    "Event";

  const datetime_local = sg?.datetime_local || sg?.datetime_utc || sg?.datetime || null;
  if (!datetime_local) return null;

  const performers = Array.isArray(sg?.performers)
    ? sg.performers
        .slice(0, 3)
        .map((p: any) => ({ name: p?.name, image: p?.image }))
        .filter((p: any) => p?.name || p?.image)
    : undefined;

  return {
    id,
    title,
    datetime_local,
    url: sg?.url,
    performers,
    venue: {
      siteSlug: canonicalVenue.slug,
      siteName: canonicalVenue.name,
      city: canonicalVenue.city,
      state: canonicalVenue.state,
      address: canonicalVenue.address,
    },
  };
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const debug = u.searchParams.get("debug") === "1";

  // Stable window
  const start = denverStartOfTodayUTC();
  const end = addDaysUTC(start, 7);

  // If debug=1, do NOT cache (otherwise you risk caching the debug payload)
  const headers = debug
    ? {
        "Cache-Control": "no-store",
      }
    : {
        // 5 min edge cache + allow stale while revalidating
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      };

  const venues = VENUE_REGISTRY.filter((v) => v?.seatgeekSlug || v?.seatgeekId);

  const debugRows: any[] = [];
  const all: WeekEvent[] = [];

  await Promise.allSettled(
    venues.map(async (canonicalVenue) => {
      const row: any = {
        siteSlug: canonicalVenue.slug,
        seatgeekSlug: canonicalVenue.seatgeekSlug ?? null,
        seatgeekId: canonicalVenue.seatgeekId ?? null,
        resolvedVenueId: null as number | null,
        eventsReturned: 0,
        eventsInRange: 0,
        error: null as string | null,
      };

      try {
        // If you already know SeatGeek venue id, skip resolving.
        const venueId =
          typeof canonicalVenue.seatgeekId === "number" && Number.isFinite(canonicalVenue.seatgeekId)
            ? canonicalVenue.seatgeekId
            : null;

        let resolvedId: number | null = venueId;

        if (!resolvedId) {
          const sgVenue = await resolveSeatGeekVenue({
            targetName: canonicalVenue.name,
            seatgeekSlug: canonicalVenue.seatgeekSlug,
            siteSlug: canonicalVenue.slug,
          });
          resolvedId = (sgVenue as any)?.id ?? null;
        }

        row.resolvedVenueId = resolvedId;

        if (!resolvedId) {
          debugRows.push(row);
          return;
        }

        const events = await seatgeekEventsByVenueId(resolvedId);
        row.eventsReturned = Array.isArray(events) ? events.length : 0;

        const filtered = (Array.isArray(events) ? events : [])
          .map((e: any) => ({ e, dt: safeDateFromEvent(e) }))
          .filter(({ dt }) => dt && dt >= start && dt < end)
          .map(({ e }) => toWeekEvent(e, canonicalVenue))
          .filter(Boolean) as WeekEvent[];

        row.eventsInRange = filtered.length;
        all.push(...filtered);
        debugRows.push(row);
      } catch (e: any) {
        row.error = e?.message || String(e);
        debugRows.push(row);
      }
    })
  );

  // Dedup by event id
  const seen = new Set<number>();
  const deduped = all.filter((ev) => {
    if (seen.has(ev.id)) return false;
    seen.add(ev.id);
    return true;
  });

  deduped.sort((a, b) => new Date(a.datetime_local).getTime() - new Date(b.datetime_local).getTime());

  const payload: any = {
    range: { start: iso(start), end: iso(end) },
    events: deduped,
  };
  if (debug) payload.debug = debugRows;

  return NextResponse.json(payload, { status: 200, headers });
}
