import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

export type RedRocksAssetEntry = {
  local: string | null;
  remote: string | null;
};

export type RedRocksAssetsSnapshot = {
  generatedAt: string;
  year: number;
  events: Record<string, RedRocksAssetEntry>;
  artists: Record<string, RedRocksAssetEntry>;
};

const SNAPSHOT_DIR = path.join(process.cwd(), "data", "snapshots", "assets");

export async function getRedRocksAssets(year = 2026): Promise<RedRocksAssetsSnapshot | null> {
  try {
    const filePath = path.join(SNAPSHOT_DIR, `redrocks-${year}.assets.json`);
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as RedRocksAssetsSnapshot;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}
