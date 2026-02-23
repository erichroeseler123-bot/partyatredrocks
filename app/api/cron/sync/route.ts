// app/api/cron/sync/route.ts
import { NextResponse } from "next/server";
import { ALL_VENUES, FEATURED_VENUES } from "@/lib/venues/registry";
import { resolveSeatGeekVenue, seatgeekEventsByVenueId } from "@/lib/seatgeek";
import { blobWriteJson } from "@/lib/blobJson";
import { SCENES } from "@/data/scenes";

export const runtime = "nodejs";

function norm(s?: string) {
  return (s ?? "").toLowerCase().trim();
}

function safeDateFromEvent(e: any): Date | null {
  const raw = e?.datetime_local || e?.datetime_utc || e?.datetime;
  if (!raw) return null;
  const dt = new Date(raw);
  return Number.isFinite(dt.getTime()) ? dt : null;
}

/**
 * Keep ONLY concert/music events.
 * - SeatGeek usually sets event.type = "concert"
 * - Some events are "music_festival" etc
 * - Taxonomies often include { name: "concert" }
 */
function isMusicEvent(ev: any): boolean {
  const t = norm(ev?.type);
  if (t === "concert") return true;
  if (t.includes("music")) return true; // covers music_festival-ish values

  const tax = Array.isArray(ev?.taxonomies) ? ev.taxonomies : [];
  if (tax.some((x: any) => norm(x?.name) === "concert")) return true;

  return false;
}

function performersText(ev: any) {
  const performers = Array.isArray(ev?.performers) ? ev.performers : [];
  return performers.map((p: any) => norm(p?.name)).filter(Boolean).join(" ");
}

function titleText(ev: any) {
  return norm(ev?.title || ev?.short_title || "");
}

/**
 * Match seeds safely:
 * - short/generic seeds only match performer names
 * - longer/multiword seeds can match title OR performer names
 */
function matchSeed(ev: any, seeds: string[]): string | null {
  const names = performersText(ev);
  const title = titleText(ev);

  for (const rawSeed of seeds) {
    const seed = norm(rawSeed);
    if (!seed) continue;

    const allowTitle = seed.includes(" ") || seed.length >= 6;
    if (names.includes(seed)) return rawSeed;
    if (allowTitle && title.includes(seed)) return rawSeed;
  }
  return null;
}

function mapEvent(ev: any, canonicalVenue: any) {
  return {
    id: Number(ev?.id),
    title: ev?.title || ev?.short_title || "Event",
    datetime_local: ev?.datetime_local || ev?.datetime_utc || ev?.datetime,
    url: ev?.url,
    performers: Array.isArray(ev?.performers)
      ? ev.performers.slice(0, 3).map((p: any) => ({ name: p?.name, image: p?.image }))
      : [],
    venue: {
      siteSlug: canonicalVenue.slug,
      siteName: canonicalVenue.name,
    },
  };
}

function dedupeSort(events: any[]) {
  const seen = new Set<number>();
  const out = events.filter((e) => {
    const id = Number(e?.id);
    if (!Number.isFinite(id)) return false;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  out.sort((a, b) => new Date(a.datetime_local).getTime() - new Date(b.datetime_local).getTime());
  return out;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  let i = 0;

  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.allSettled(workers);
  return out;
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const dry = u.searchParams.get("dry") === "1";
  const debug = u.searchParams.get("debug") === "1";
  const onlyVenue = u.searchParams.get("venue"); // e.g. "mission-ballroom"

  // Optional protection
  const secret = u.searchParams.get("secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const venues = onlyVenue
    ? ALL_VENUES.filter((v) => v.slug === onlyVenue)
    : FEATURED_VENUES;

  const sceneBuckets: Record<string, any[]> = Object.fromEntries(SCENES.map((s) => [s.slug, []]));
  const sceneDebug: Record<string, any[]> = Object.fromEntries(SCENES.map((s) => [s.slug, []]));

  const venueResults: any[] = [];

  await mapLimit(venues, 5, async (canonicalVenue) => {
    const row: any = {
      siteSlug: canonicalVenue.slug,
      seatgeekSlug: canonicalVenue.seatgeekSlug ?? null,
      seatgeekId: canonicalVenue.seatgeekId ?? null,
      resolvedVenueId: null as number | null,
      eventsFetched: 0,
      eventsMusic: 0,
      eventsKept: 0,
      wrote: false,
      error: null as string | null,
    };

    try {
      let resolvedId: number | null =
        typeof canonicalVenue.seatgeekId === "number" && Number.isFinite(canonicalVenue.seatgeekId)
          ? canonicalVenue.seatgeekId
          : null;

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
        venueResults.push(row);
        return;
      }

      const raw = await seatgeekEventsByVenueId(resolvedId);
      row.eventsFetched = Array.isArray(raw) ? raw.length : 0;

      const musicOnly = (Array.isArray(raw) ? raw : []).filter(isMusicEvent);
      row.eventsMusic = musicOnly.length;

      const upcoming = musicOnly
        .map((e: any) => ({ e, dt: safeDateFromEvent(e) }))
        .filter(({ dt }) => dt && dt >= now)
        .map(({ e }) => mapEvent(e, canonicalVenue))
        .filter((e: any) => e?.id && e?.datetime_local);

      row.eventsKept = upcoming.length;

      // bucket scenes (using the original SeatGeek event for matching)
      for (const ev of musicOnly) {
        const dt = safeDateFromEvent(ev);
        if (!dt || dt < now) continue;

        for (const scene of SCENES) {
          const hit = matchSeed(ev, scene.seeds);
          if (!hit) continue;

          const mapped = mapEvent(ev, canonicalVenue);
          sceneBuckets[scene.slug].push(mapped);

          if (debug && sceneDebug[scene.slug].length < 8) {
            sceneDebug[scene.slug].push({ id: mapped.id, title: mapped.title, hit });
          }
        }
      }

      // write venue cache
      if (!dry) {
        await blobWriteJson(`cache/venues/${canonicalVenue.slug}.json`, {
          generatedAt: new Date().toISOString(),
          venue: {
            siteSlug: canonicalVenue.slug,
            siteName: canonicalVenue.name,
            seatgeekVenueId: resolvedId,
          },
          events: upcoming.slice(0, 50),
        });
        row.wrote = true;
      }

      venueResults.push(row);
    } catch (e: any) {
      row.error = e?.message || String(e);
      venueResults.push(row);
    }
  });

  const sceneCounts: Record<string, number> = {};

  if (!dry) {
    for (const scene of SCENES) {
      const events = dedupeSort(sceneBuckets[scene.slug]).slice(0, 80);
      sceneCounts[scene.slug] = events.length;

      await blobWriteJson(`cache/scene/${scene.slug}.json`, {
        generatedAt: new Date().toISOString(),
        events,
      });
    }
  } else {
    for (const scene of SCENES) {
      sceneCounts[scene.slug] = dedupeSort(sceneBuckets[scene.slug]).length;
    }
  }

  const payload: any = {
    ok: true,
    dry,
    venuesProcessed: venueResults.length,
    venuesWrote: venueResults.filter((r) => r.wrote).length,
    scenes: sceneCounts,
    sampleVenue: venueResults[0] ?? null,
  };

  if (debug) {
    payload.debug = {
      sceneHits: sceneDebug,
      venues: venueResults,
    };
  }

  return NextResponse.json(payload);
}
