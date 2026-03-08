import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ArtistsSnapshot, NormalizedArtist } from "@/lib/events/schema";

const SNAPSHOT_DIR = path.join(process.cwd(), "data", "snapshots", "artists");

async function readSnapshot(year: number): Promise<NormalizedArtist[]> {
  const filePath = path.join(SNAPSHOT_DIR, `redrocks-${year}.json`);
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as ArtistsSnapshot | { artists: NormalizedArtist[] } | NormalizedArtist[];
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.artists)) return parsed.artists;
  return [];
}

export async function getRedRocksArtists(year = 2026): Promise<NormalizedArtist[]> {
  try {
    return await readSnapshot(year);
  } catch {
    return [];
  }
}

export async function getRedRocksArtistById(id: string, year = 2026): Promise<NormalizedArtist | null> {
  const artists = await getRedRocksArtists(year);
  return artists.find((a) => a.id === id) ?? null;
}
