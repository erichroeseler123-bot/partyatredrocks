import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const OUT_DIR = path.resolve("public/hero-cache");
const INDEX_PATH = path.join(OUT_DIR, "index.json");

// CHANGE THIS if your shows file is elsewhere:
const SHOWS_MODULE_PATH = path.resolve("shows-2026.js"); // or "app/shows-2026.js"
const TM_API_KEY = process.env.TICKETMASTER_API_KEY || process.env.TM_API_KEY;

function slugify(s = "") {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function pickBestTicketmasterImage(images = []) {
  // Prefer wide images for hero
  const preferredRatios = new Set(["16_9", "3_2", "4_3"]);
  const filtered = images
    .filter((img) => img?.url && (preferredRatios.has(img.ratio) || img.width >= 1200))
    .sort((a, b) => (b.width || 0) - (a.width || 0));

  return filtered[0]?.url || images?.[0]?.url || null;
}

async function safeReadJSON(p, fallback) {
  try {
    return JSON.parse(await fs.readFile(p, "utf8"));
  } catch {
    return fallback;
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function downloadToFile(url, filePath) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(filePath, buf);
}

async function loadShows() {
  // Load your RED_ROCKS_2026 array from your existing file
  const mod = await import(`file://${SHOWS_MODULE_PATH}?v=${Date.now()}`);
  const arr = mod.RED_ROCKS_2026 || mod.default || [];
  if (!Array.isArray(arr)) throw new Error("RED_ROCKS_2026 is not an array in shows-2026.js");
  return arr;
}

async function fetchTicketmasterEvent(id) {
  const url = `https://app.ticketmaster.com/discovery/v2/events/${encodeURIComponent(id)}.json?apikey=${encodeURIComponent(TM_API_KEY)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function main() {
  if (!TM_API_KEY) {
    console.error("❌ Missing TICKETMASTER_API_KEY or TM_API_KEY in .env.local");
    process.exit(1);
  }

  await ensureDir(OUT_DIR);

  const shows = await loadShows();
  const index = await safeReadJSON(INDEX_PATH, {});

  let ok = 0;
  let missing = 0;
  let skipped = 0;

  for (const ev of shows) {
    const id = ev?.id || ev?.ticketmaster_id || ev?.tm_id;
    if (!id) {
      skipped++;
      continue;
    }

    // already have cached local file?
    if (index[id]?.local && index[id]?.local.startsWith("/hero-cache/")) {
      continue;
    }

    const data = await fetchTicketmasterEvent(id);
    if (!data?.images?.length) {
      console.log(`⚠️  No Ticketmaster images for ${id}`);
      missing++;
      continue;
    }

    const bestUrl = pickBestTicketmasterImage(data.images);
    if (!bestUrl) {
      console.log(`⚠️  No usable image URL for ${id}`);
      missing++;
      continue;
    }

    const title = ev?.title || ev?.name || data?.name || "event";
    const date = ev?.date || ev?.datetime || data?.dates?.start?.localDate || "date";
    const base = `${date}-${slugify(title)}-${id}`;
    const ext = path.extname(new URL(bestUrl).pathname) || ".jpg";
    const filename = `${base}${ext}`.replace(/[^a-zA-Z0-9._-]/g, "");
    const filepath = path.join(OUT_DIR, filename);

    try {
      await downloadToFile(bestUrl, filepath);
      index[id] = {
        id,
        title,
        date,
        remote: bestUrl,
        local: `/hero-cache/${filename}`,
        updatedAt: new Date().toISOString(),
      };
      console.log(`✅ ${id} -> ${index[id].local}`);
      ok++;
    } catch (e) {
      console.log(`⚠️  Download failed ${id}: ${e.message}`);
      missing++;
    }

    // be nice to the API
    await new Promise((r) => setTimeout(r, 150));
  }

  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2));
  console.log(`\nDONE: ok=${ok}, missing=${missing}, skipped=${skipped}`);
  console.log(`Wrote: ${INDEX_PATH}`);
}

main().catch((e) => {
  console.error("❌ Fatal:", e);
  process.exit(1);
});
