import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

export type MediaIndex = {
  generatedAt: string;
  year: number;
  artistsById: Record<
    string,
    {
      id: string;
      name: string;
      slug: string;
      image: { primary: string; candidates: string[] };
      sources: {
        blobImage?: string | null;
        spotifyImage: string | null;
        ticketmasterImage: string | null;
        seatgeekImage: string | null;
        localAsset: string | null;
        fallback: string | null;
      };
      alt: string;
      caption: string;
    }
  >;
  eventsById: Record<
    string,
    {
      id: string;
      slug: string;
      title: string;
      dateKey: string;
      venueId: string;
      image: { primary: string; candidates: string[] };
      sources: {
        blobImage?: string | null;
        spotifyImage: string | null;
        ticketmasterImage: string | null;
        seatgeekImage: string | null;
        localAsset: string | null;
        fallback: string | null;
      };
      artistIds: string[];
      alt: string;
      caption: string;
    }
  >;
  venuesById: Record<
    string,
    {
      id: string;
      key: string;
      name: string;
      image: { primary: string; candidates: string[] };
      sources: {
        blobImage?: string | null;
        spotifyImage: string | null;
        ticketmasterImage: string | null;
        seatgeekImage: string | null;
        localAsset: string | null;
        fallback: string | null;
      };
      alt: string;
      caption: string;
    }
  >;
  mapPoints: Array<{ id: string; label: string; dateKey: string; image: string }>;
};

const SNAPSHOT_DIR = path.join(process.cwd(), "data", "snapshots", "media");

export async function getMediaIndex(year = 2026): Promise<MediaIndex | null> {
  try {
    const raw = await readFile(path.join(SNAPSHOT_DIR, `all-${year}.media.json`), "utf8");
    const parsed = JSON.parse(raw) as MediaIndex;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getMultiYearMediaIndex(years: number[] = [2026, 2027]): Promise<MediaIndex | null> {
  const snapshots = (await Promise.all(years.map((year) => getMediaIndex(year)))).filter(
    (entry): entry is MediaIndex => entry !== null
  );
  if (!snapshots.length) return null;

  const merged: MediaIndex = {
    generatedAt: snapshots[0].generatedAt,
    year: snapshots[0].year,
    artistsById: {},
    eventsById: {},
    venuesById: {},
    mapPoints: [],
  };

  for (const snap of snapshots) {
    Object.assign(merged.artistsById, snap.artistsById);
    Object.assign(merged.eventsById, snap.eventsById);
    Object.assign(merged.venuesById, snap.venuesById);
    for (const point of snap.mapPoints ?? []) {
      if (merged.mapPoints.length < 12) merged.mapPoints.push(point);
    }
  }

  return merged;
}
