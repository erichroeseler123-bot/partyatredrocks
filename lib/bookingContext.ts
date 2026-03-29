import "server-only";

import {
  getArtistsCatalog,
  getEnrichedArtistsCatalog,
  getEventsCatalog,
} from "@/lib/events/getCatalog";

export type BookingShowContext = {
  showId: string;
  showSlug: string;
  showTitle: string;
  artistName: string;
  artistSlug: string;
  venueSlug: string;
  venueName: string | null;
  dateKey: string;
  startLocal: string | null;
};

export type BookingArtistContext = {
  artistName: string;
  artistSlug: string;
  bio: string | null;
  genres: string[];
  topTracks: string[];
  image: string | null;
  spotifyId: string | null;
  officialLinks: string[];
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalize(input: string | null | undefined) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentences(text: string | null | undefined, maxSentences = 2) {
  const cleaned = String(text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!sentences.length) return cleaned.slice(0, 240);
  return sentences.slice(0, maxSentences).join(" ");
}

export async function resolveBookingShowContext(input: {
  venueSlug?: string | null;
  dateKey?: string | null;
  artistName?: string | null;
  event?: string | null;
}): Promise<BookingShowContext | null> {
  const venueSlug = String(input.venueSlug || "").trim() || "red-rocks-amphitheatre";
  const dateKey = String(input.dateKey || "").trim();
  const artistName = String(input.artistName || "").trim();
  const event = String(input.event || "").trim();
  const year = Number.parseInt((dateKey || "2026").slice(0, 4), 10) || 2026;
  const events = await getEventsCatalog(year, "all");
  const scoped = events.filter((row) => row.venueId === venueSlug);
  const eventNorm = normalize(event);
  const artistNorm = normalize(artistName);

  const exactById = event ? scoped.find((row) => row.id === event) : null;
  const exactBySlug = !exactById && event ? scoped.find((row) => row.slug === slugify(event)) : null;
  const exactByName = !exactById && !exactBySlug && eventNorm
    ? scoped.find((row) => normalize(row.name) === eventNorm)
    : null;

  const byDateAndArtist = !exactById && !exactBySlug && !exactByName && dateKey
    ? scoped.find((row) => {
        if (row.dateKey !== dateKey) return false;
        if (!artistNorm) return true;
        return row.artistNames.some((name) => normalize(name) === artistNorm);
      })
    : null;

  const byArtistOnly = !exactById && !exactBySlug && !exactByName && !byDateAndArtist && artistNorm
    ? scoped.find((row) => row.artistNames.some((name) => normalize(name) === artistNorm))
    : null;

  const match = exactById || exactBySlug || exactByName || byDateAndArtist || byArtistOnly;
  if (!match) return null;

  const primaryArtist = match.artistNames[0] || artistName || match.name;

  return {
    showId: match.id,
    showSlug: match.slug,
    showTitle: match.name,
    artistName: primaryArtist,
    artistSlug: slugify(primaryArtist),
    venueSlug: match.venueId,
    venueName: match.venueId === "red-rocks-amphitheatre" ? "Red Rocks Amphitheatre" : null,
    dateKey: match.dateKey,
    startLocal: match.startLocal ?? match.startAt ?? null,
  };
}

export async function resolveBookingArtistContext(input: {
  artistName?: string | null;
  artistSlug?: string | null;
  dateKey?: string | null;
}): Promise<BookingArtistContext | null> {
  const artistName = String(input.artistName || "").trim();
  const artistSlug = String(input.artistSlug || slugify(artistName)).trim();
  if (!artistName && !artistSlug) return null;

  const year = Number.parseInt((String(input.dateKey || "2026").trim() || "2026").slice(0, 4), 10) || 2026;
  const [artists, enriched] = await Promise.all([
    getArtistsCatalog(year, "all"),
    getEnrichedArtistsCatalog(year, "all"),
  ]);

  const artist = artists.find((row) => slugify(row.name) === artistSlug || normalize(row.name) === normalize(artistName)) ?? null;
  const enrichedRow = enriched.find((row) => slugify(row.name) === artistSlug || normalize(row.name) === normalize(artistName)) ?? null;
  const resolvedName = enrichedRow?.name || artist?.name || artistName;
  if (!resolvedName) return null;

  return {
    artistName: resolvedName,
    artistSlug: slugify(resolvedName),
    bio: firstSentences(enrichedRow?.lastfmBio, 2),
    genres: Array.from(new Set([...(enrichedRow?.genres ?? []), ...(artist?.genreHints ?? [])])).slice(0, 4),
    topTracks: (enrichedRow?.topTracks ?? []).filter(Boolean).slice(0, 5),
    image: enrichedRow?.spotifyImage || artist?.image || null,
    spotifyId: enrichedRow?.spotifyId || artist?.spotifyId || null,
    officialLinks: (enrichedRow?.officialLinks ?? []).filter(Boolean).slice(0, 3),
  };
}
