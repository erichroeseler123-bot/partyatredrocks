import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ArtistsSnapshot, EventsSnapshot, NormalizedArtist, NormalizedEvent } from "@/lib/events/schema";
import type { VenueLedgerKey } from "@/lib/venues/ledgerRegistry";

const EVENTS_DIR = path.join(process.cwd(), "data", "snapshots", "events");
const ARTISTS_DIR = path.join(process.cwd(), "data", "snapshots", "artists");
const INDEXES_DIR = path.join(process.cwd(), "data", "snapshots", "indexes");

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

async function readEvents(scope: string, year: number): Promise<NormalizedEvent[] | null> {
  try {
    const raw = await readFile(path.join(EVENTS_DIR, `${scope}-${year}.json`), "utf8");
    const parsed = JSON.parse(raw) as EventsSnapshot | NormalizedEvent[];
    if (Array.isArray(parsed)) return parsed;
    return Array.isArray(parsed.events) ? parsed.events : null;
  } catch {
    return null;
  }
}

async function readArtists(scope: string, year: number): Promise<NormalizedArtist[] | null> {
  try {
    const raw = await readFile(path.join(ARTISTS_DIR, `${scope}-${year}.json`), "utf8");
    const parsed = JSON.parse(raw) as ArtistsSnapshot | NormalizedArtist[];
    if (Array.isArray(parsed)) return parsed;
    return Array.isArray(parsed.artists) ? parsed.artists : null;
  } catch {
    return null;
  }
}

export async function getEventsCatalog(year = 2026, scope: "all" | VenueLedgerKey = "all"): Promise<NormalizedEvent[]> {
  const primary = await readEvents(scope, year);
  if (primary?.length) return primary;
  const fallback = await readEvents("redrocks", year);
  return fallback ?? [];
}

export async function getArtistsCatalog(year = 2026, scope: "all" | VenueLedgerKey = "all"): Promise<NormalizedArtist[]> {
  const primary = await readArtists(scope, year);
  if (primary?.length) return primary;
  const fallback = await readArtists("redrocks", year);
  return fallback ?? [];
}

export async function getArtistById(id: string, year = 2026): Promise<NormalizedArtist | null> {
  const artists = await getArtistsCatalog(year, "all");
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
    return parsed.eventsByDate ?? {};
  } catch {
    return {};
  }
}

export async function readByMonthIndex(
  year = 2026,
  scope: "all" | VenueLedgerKey = "all"
): Promise<Record<string, string[]>> {
  try {
    const raw = await readFile(path.join(INDEXES_DIR, `${scope}-${year}.byMonth.json`), "utf8");
    const parsed = JSON.parse(raw) as { eventsByMonth?: Record<string, string[]> };
    return parsed.eventsByMonth ?? {};
  } catch {
    return {};
  }
}
