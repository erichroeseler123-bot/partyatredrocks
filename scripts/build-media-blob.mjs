import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const explicitYear = process.argv[2] ? Number(process.argv[2]) : null;
const MEDIA_DIR = path.join(ROOT, "data", "snapshots", "media");
const LEGACY_MEDIA_PATH = path.join(ROOT, "data", "media-index.json");

function isHttpUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function pickExternalSource(sources = {}) {
  return sources.spotifyImage || sources.ticketmasterImage || sources.seatgeekImage || null;
}

function withTimeout(promise, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return {
    controller,
    wrapped: promise(controller.signal).finally(() => clearTimeout(timer)),
  };
}

function extFromContentType(contentType) {
  if (!contentType) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("avif")) return "avif";
  return "jpg";
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function uploadToBlob(url, year, put) {
  const hash = crypto.createHash("sha1").update(url).digest("hex");
  const { wrapped } = withTimeout(
    (signal) => fetch(url, { signal, redirect: "follow" }),
    15000
  );
  const res = await wrapped;
  if (!res.ok) throw new Error(`fetch failed (${res.status})`);

  const contentType = res.headers.get("content-type") || "image/jpeg";
  if (!contentType.startsWith("image/")) {
    throw new Error(`non-image content-type: ${contentType}`);
  }

  const ext = extFromContentType(contentType);
  const body = Buffer.from(await res.arrayBuffer());
  const pathname = `media-cache/${year}/${hash}.${ext}`;

  const blob = await put(pathname, body, {
    access: "public",
    addRandomSuffix: false,
    contentType,
  });

  return blob.url;
}

async function discoverYears() {
  if (Number.isInteger(explicitYear) && explicitYear >= 2000 && explicitYear <= 2100) {
    return [explicitYear];
  }
  try {
    const entries = await fs.readdir(MEDIA_DIR);
    const years = entries
      .map((name) => {
        const match = /^all-(\d{4})\.media\.json$/.exec(name);
        return match ? Number(match[1]) : null;
      })
      .filter((value) => Number.isInteger(value))
      .sort((a, b) => a - b);
    return years.length ? years : [2026];
  } catch {
    return [2026];
  }
}

async function patchMediaSnapshot(media, year, put, cache) {
  const externalUrls = unique([
    ...Object.values(media.artistsById ?? {}).map((row) => pickExternalSource(row?.sources)),
    ...Object.values(media.eventsById ?? {}).map((row) => pickExternalSource(row?.sources)),
    ...Object.values(media.venuesById ?? {}).map((row) => pickExternalSource(row?.sources)),
  ]).filter(isHttpUrl);

  let uploaded = 0;

  for (const url of externalUrls) {
    if (cache.has(url)) continue;
    try {
      const blobUrl = await uploadToBlob(url, year, put);
      cache.set(url, blobUrl);
      uploaded += 1;
    } catch (error) {
      console.warn(`blob cache skip for ${url}: ${error?.message || error}`);
    }
  }

  const patchRow = (row) => {
    if (!row || !row.sources) return row;
    const source = pickExternalSource(row.sources);
    const blobImage = source && cache.get(source) ? cache.get(source) : null;
    row.sources.blobImage = blobImage;

    if (blobImage) {
      row.image.primary = blobImage;
      row.image.candidates = unique([blobImage, ...(row.image.candidates || [])]);
    }

    return row;
  };

  for (const key of Object.keys(media.artistsById ?? {})) {
    media.artistsById[key] = patchRow(media.artistsById[key]);
  }
  for (const key of Object.keys(media.eventsById ?? {})) {
    media.eventsById[key] = patchRow(media.eventsById[key]);
  }
  for (const key of Object.keys(media.venuesById ?? {})) {
    media.venuesById[key] = patchRow(media.venuesById[key]);
  }

  media.mapPoints = (media.mapPoints || []).map((point) => {
    const event = media.eventsById?.[point.id];
    return event?.image?.primary ? { ...point, image: event.image.primary } : point;
  });

  return { media, uploaded, totalExternal: externalUrls.length };
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log("Skipping blob media caching: BLOB_READ_WRITE_TOKEN not set.");
    return;
  }

  const { put } = await import("@vercel/blob");
  const years = await discoverYears();
  const cache = new Map();

  for (const year of years) {
    const mediaPath = path.join(MEDIA_DIR, `all-${year}.media.json`);
    const raw = await fs.readFile(mediaPath, "utf8");
    const parsed = JSON.parse(raw);
    const { media, uploaded, totalExternal } = await patchMediaSnapshot(parsed, year, put, cache);
    await fs.writeFile(mediaPath, JSON.stringify(media, null, 2) + "\n", "utf8");
    console.log(`Blob media caching (${year}): ${uploaded}/${totalExternal} external images cached.`);
  }

  try {
    const legacyRaw = await fs.readFile(LEGACY_MEDIA_PATH, "utf8");
    const legacyParsed = JSON.parse(legacyRaw);
    const { media } = await patchMediaSnapshot(legacyParsed, years[0] ?? 2026, put, cache);
    await fs.writeFile(LEGACY_MEDIA_PATH, JSON.stringify(media, null, 2) + "\n", "utf8");
  } catch {
    // Legacy media index optional
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
