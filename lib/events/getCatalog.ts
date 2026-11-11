import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ArtistsSnapshot, EventsSnapshot, NormalizedArtist, NormalizedEvent } from "@/lib/events/schema";
import {
  dedupeAndSortEvents,
  getDenverDateKey,
  resolveUpcomingYears,
  selectUpcomingEvents,
} from "@/lib/events/upcomingSelector";
import {
  VENUE_LEDGER_BY_KEY,
  VENUE_LEDGER_REGISTRY,
  type VenueLedgerKey,
} from "@/lib/venues/ledgerRegistry";

export { getDenverDateKey, resolveUpcomingYears, selectUpcomingEvents };

const EVENTS_DIR = path.join(process.cwd(), "data", "snapshots", "events");
const ARTISTS_DIR = path.join(process.cwd(), "data", "snapshots", "artists");
const INDEXES_DIR = path.join(process.cwd(), "data", "snapshots", "indexes");
const SHOWS_DIR = path.join(process.cwd(), "data", "shows");

export type EnrichedArtistSnapshotRow = {
  id: string;
  name: string;
  showCount: number;
  venueIds: string[];
  eventIds: string[];
  firstDate: string | null;
  lastDate: string | null;
  nextDate: string | null;
  coArtists: string[];
  spotifyId: string | null;
  spotifyImage: string | null;
  genres: string[];
  lastfmBio: string | null;
  topTracks: string[];
  officialLinks: string[];
  providerErrors?: Record<string, string | null>;
};

type RawLedgerShowRow = {
  dateKey?: unknown;
  title?: unknown;
  support?: unknown;
  startLocal?: unknown;
  ticketUrl?: unknown;
  sourceUrl?: unknown;
  sourceId?: unknown;
  verifiedAt?: unknown;
};

function slugify(input = ""): string {
  return String(input)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitSupportNames(raw: unknown): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .replace(/^with\s+/i, "")
    .split(/,|\/|;|\+|\band\b/gi)
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeLedgerRows(
  rows: RawLedgerShowRow[],
  venueKey: string,
  venueSlug: string,
  year: number
): NormalizedEvent[] {
  const idCounts = new Map<string, number>();
  const prefix = venueKey === "redrocks" ? "rr" : venueKey;
  const normalized: NormalizedEvent[] = [];

  for (const row of rows) {
    const dateKey = typeof row?.dateKey === "string" ? row.dateKey.trim() : "";
    const title = typeof row?.title === "string" ? row.title.trim() : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !dateKey.startsWith(`${year}-`) || !title) {
      continue;
    }

    const baseSlug = slugify(title) || "event";
    const baseId = `${prefix}-${dateKey}-${baseSlug}`;
    const nextCount = (idCounts.get(baseId) ?? 0) + 1;
    idCounts.set(baseId, nextCount);
    const id = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;
    const slug = nextCount === 1 ? `${dateKey}-${baseSlug}` : `${dateKey}-${baseSlug}-${nextCount}`;

    const supportNames = splitSupportNames(row.support);
    const artistNames = [title, ...supportNames];
    const artistIds = artistNames.map((name) => `artist-${slugify(name) || "unknown"}`);
    const startLocal =
      typeof row.startLocal === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(row.startLocal.trim())
        ? row.startLocal.trim()
        : `${dateKey}T19:00:00`;

    normalized.push({
      id,
      source: "snapshot",
      sourceId: typeof row.sourceId === "string" && row.sourceId.trim() ? row.sourceId.trim() : id,
      name: title,
      startAt: startLocal,
      startLocal,
      venueId: venueSlug,
      headliners: artistIds[0] ? [artistIds[0]] : [],
      artists: artistIds,
      artistNames,
      image: null,
      ticketUrl: typeof row.ticketUrl === "string" && row.ticketUrl.trim() ? row.ticketUrl.trim() : null,
      sourceUrl: typeof row.sourceUrl === "string" && row.sourceUrl.trim() ? row.sourceUrl.trim() : null,
      verifiedAt: typeof row.verifiedAt === "string" && row.verifiedAt.trim() ? row.verifiedAt.trim() : null,
      dateKey,
      slug,
    });
  }

  return dedupeAndSortEvents(normalized);
}

async function readLedgerFallbackEvents(scope: string, year: number): Promise<NormalizedEvent[] | null> {
  if (scope === "all") {
    const chunks = await Promise.all(
      VENUE_LEDGER_REGISTRY.map((entry) => readLedgerFallbackEvents(entry.key, year))
    );
    const present = chunks.filter((rows): rows is NormalizedEvent[] => rows !== null);
    if (!present.length) return null;
    return dedupeAndSortEvents(present.flat());
  }

  const venue = VENUE_LEDGER_BY_KEY.get(scope);
  if (!venue) return null;

  try {
    const raw = await readFile(path.join(SHOWS_DIR, venue.key, `${year}.json`), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return normalizeLedgerRows(parsed as RawLedgerShowRow[], venue.key, venue.slug, year);
  } catch {
    return null;
  }
}

function buildArtistsFromEvents(events: NormalizedEvent[]): NormalizedArtist[] {
  const byId = new Map<string, NormalizedArtist>();
  for (const event of events) {
    event.artistNames.forEach((name, idx) => {
      const id = event.artists[idx] ?? `artist-${slugify(name) || "unknown"}`;
      if (!byId.has(id)) {
        byId.set(id, {
          id,
          name,
          image: null,
        });
      }
    });
  }
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
}

async function readEvents(scope: string, year: number): Promise<NormalizedEvent[] | null> {
  try {
    const raw = await readFile(path.join(EVENTS_DIR, `${scope}-${year}.json`), "utf8");
    const parsed = JSON.parse(raw) as EventsSnapshot | NormalizedEvent[];
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.events)) return parsed.events;
  } catch {
    // Fall back to git-tracked data/shows/<venue>/<year>.json if snapshot file is absent.
  }
  return readLedgerFallbackEvents(scope, year);
}

async function readArtists(scope: string, year: number): Promise<NormalizedArtist[] | null> {
  try {
    const raw = await readFile(path.join(ARTISTS_DIR, `${scope}-${year}.json`), "utf8");
    const parsed = JSON.parse(raw) as ArtistsSnapshot | NormalizedArtist[];
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.artists)) return parsed.artists;
  } catch {
    // Fall back to deriving artist list from events catalog when artist snapshot is absent.
  }
  const events = await readEvents(scope, year);
  if (!events) return null;
  return buildArtistsFromEvents(events);
}

export async function getEventsCatalog(
  year = 2026,
  scope: "all" | VenueLedgerKey = "all"
): Promise<NormalizedEvent[]> {
  const primary = await readEvents(scope, year);
  if (primary !== null) return primary;
  if (scope === "all" || scope === "redrocks") {
    const fallback = await readEvents("redrocks", year);
    return fallback ?? [];
  }
  return [];
}

export type MultiYearCatalogOptions = {
  scope?: "all" | VenueLedgerKey;
  scopes?: Array<"all" | VenueLedgerKey>;
  years?: number[];
  catalogLoader?: (year: number, scope: "all" | VenueLedgerKey) => Promise<NormalizedEvent[]>;
};

export async function getMultiYearEventsCatalog(
  opts?: MultiYearCatalogOptions
): Promise<NormalizedEvent[]> {
  const years = resolveUpcomingYears(undefined, opts?.years);
  const scopes: Array<"all" | VenueLedgerKey> = opts?.scopes?.length
    ? Array.from(new Set(opts.scopes))
    : [opts?.scope ?? "all"];
  const loader = opts?.catalogLoader ?? getEventsCatalog;

  const batches = await Promise.all(
    years.flatMap((year) => scopes.map((scope) => loader(year, scope)))
  );
  return dedupeAndSortEvents(batches.flat());
}

export type UpcomingEventsCatalogOptions = MultiYearCatalogOptions & {
  fromDateKey?: string;
  venueId?: string;
  limit?: number;
};

export async function getUpcomingEventsCatalog(
  opts?: UpcomingEventsCatalogOptions
): Promise<NormalizedEvent[]> {
  const fromDateKey =
    opts?.fromDateKey && /^\d{4}-\d{2}-\d{2}$/.test(opts.fromDateKey)
      ? opts.fromDateKey
      : getDenverDateKey();
  const years = resolveUpcomingYears(fromDateKey, opts?.years);
  const allEvents = await getMultiYearEventsCatalog({
    scope: opts?.scope,
    scopes: opts?.scopes,
    years,
    catalogLoader: opts?.catalogLoader,
  });

  return selectUpcomingEvents(allEvents, {
    fromDateKey,
    venueId: opts?.venueId,
    limit: opts?.limit,
  });
}

export async function getArtistsCatalog(
  year = 2026,
  scope: "all" | VenueLedgerKey = "all"
): Promise<NormalizedArtist[]> {
  const primary = await readArtists(scope, year);
  if (primary !== null) return primary;
  if (scope === "all" || scope === "redrocks") {
    const fallback = await readArtists("redrocks", year);
    return fallback ?? [];
  }
  return [];
}

export async function getMultiYearArtistsCatalog(opts?: {
  scope?: "all" | VenueLedgerKey;
  years?: number[];
}): Promise<NormalizedArtist[]> {
  const years = resolveUpcomingYears(undefined, opts?.years);
  const scope = opts?.scope ?? "all";
  const batches = await Promise.all(years.map((year) => getArtistsCatalog(year, scope)));
  const byId = new Map<string, NormalizedArtist>();
  for (const artist of batches.flat()) {
    if (!artist?.id) continue;
    const prev = byId.get(artist.id);
    if (!prev) {
      byId.set(artist.id, artist);
    } else {
      byId.set(artist.id, {
        ...prev,
        ...artist,
        image: prev.image ?? artist.image ?? null,
        genreHints: prev.genreHints?.length ? prev.genreHints : artist.genreHints,
        links: prev.links ?? artist.links,
      });
    }
  }
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getArtistById(id: string, year = 2026): Promise<NormalizedArtist | null> {
  const artists = await getMultiYearArtistsCatalog({ scope: "all", years: [year, year + 1] });
  return artists.find((artist) => artist.id === id) ?? null;
}

export async function getEnrichedArtistsCatalog(
  year = 2026,
  scope: "all" | VenueLedgerKey = "all"
): Promise<EnrichedArtistSnapshotRow[]> {
  try {
    const raw = await readFile(path.join(ARTISTS_DIR, `${scope}-${year}.enriched.json`), "utf8");
    const parsed = JSON.parse(raw) as { artists?: EnrichedArtistSnapshotRow[] } | EnrichedArtistSnapshotRow[];
    if (Array.isArray(parsed)) return parsed;
    return Array.isArray(parsed.artists) ? parsed.artists : [];
  } catch {
    return [];
  }
}

export async function getEnrichedArtistById(
  id: string,
  year = 2026,
  scope: "all" | VenueLedgerKey = "all"
): Promise<EnrichedArtistSnapshotRow | null> {
  const rows = await getEnrichedArtistsCatalog(year, scope);
  return rows.find((row) => row.id === id) ?? null;
}

export async function readByDateIndex(
  year = 2026,
  scope: "all" | VenueLedgerKey = "all"
): Promise<Record<string, string[]>> {
  try {
    const raw = await readFile(path.join(INDEXES_DIR, `${scope}-${year}.byDate.json`), "utf8");
    const parsed = JSON.parse(raw) as { eventsByDate?: Record<string, string[]> };
    if (parsed.eventsByDate) return parsed.eventsByDate;
  } catch {
    // Fall back to computing date index from catalog events.
  }
  const events = await getEventsCatalog(year, scope);
  const index: Record<string, string[]> = {};
  for (const event of events) {
    index[event.dateKey] ||= [];
    index[event.dateKey].push(event.id);
  }
  return index;
}

export async function readByMonthIndex(
  year = 2026,
  scope: "all" | VenueLedgerKey = "all"
): Promise<Record<string, string[]>> {
  try {
    const raw = await readFile(path.join(INDEXES_DIR, `${scope}-${year}.byMonth.json`), "utf8");
    const parsed = JSON.parse(raw) as { eventsByMonth?: Record<string, string[]> };
    if (parsed.eventsByMonth) return parsed.eventsByMonth;
  } catch {
    // Fall back to computing month index from catalog events.
  }
  const events = await getEventsCatalog(year, scope);
  const index: Record<string, string[]> = {};
  for (const event of events) {
    const month = event.dateKey.slice(0, 7);
    index[month] ||= [];
    index[month].push(event.id);
  }
  return index;
}

export async function readMultiYearByDateIndex(
  years?: number[],
  scope: "all" | VenueLedgerKey = "all"
): Promise<Record<string, string[]>> {
  const resolvedYears = resolveUpcomingYears(undefined, years);
  const maps = await Promise.all(resolvedYears.map((year) => readByDateIndex(year, scope)));
  const merged: Record<string, string[]> = {};
  for (const map of maps) {
    for (const [dateKey, ids] of Object.entries(map)) {
      merged[dateKey] = Array.from(new Set([...(merged[dateKey] ?? []), ...ids]));
    }
  }
  return merged;
}

export async function readMultiYearByMonthIndex(
  years?: number[],
  scope: "all" | VenueLedgerKey = "all"
): Promise<Record<string, string[]>> {
  const resolvedYears = resolveUpcomingYears(undefined, years);
  const maps = await Promise.all(resolvedYears.map((year) => readByMonthIndex(year, scope)));
  const merged: Record<string, string[]> = {};
  for (const map of maps) {
    for (const [monthKey, ids] of Object.entries(map)) {
      merged[monthKey] = Array.from(new Set([...(merged[monthKey] ?? []), ...ids]));
    }
  }
  return merged;
}
