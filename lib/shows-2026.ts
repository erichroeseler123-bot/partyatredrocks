// lib/shows-2026.ts

import fs from "fs";
import path from "path";

export type Show2026 = {
  slug: string;
  artist: string;
  date: string;
  venue: string;
  img?: string;

  operational?: {
    bio?: string;
  };

  isGhostEvent?: boolean;
};

const filePath = path.join(
  process.cwd(),
  "public/data/shows-2026.json"
);

let cache: Show2026[] | null = null;

export function loadShows2026(): Show2026[] {
  if (cache) return cache;

  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("shows-2026.json is not an array");
  }

  cache = data;

  return data;
}

export const shows2026 = loadShows2026();
