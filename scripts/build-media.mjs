import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const year = Number(process.argv[2] ?? "2026");

const EVENTS_PATH = path.join(ROOT, "data", "snapshots", "events", `all-${year}.json`);
const ASSETS_PATH = path.join(ROOT, "data", "snapshots", "assets", `all-${year}.assets.json`);
const ARTISTS_PATH = path.join(ROOT, "data", "snapshots", "artists", `all-${year}.json`);
const ARTISTS_ENRICHED_PATH = path.join(ROOT, "data", "snapshots", "artists", `all-${year}.enriched.json`);
const VENUES_REGISTRY_PATH = path.join(ROOT, "data", "venues.registry.json");
const OUTPUT_DIR = path.join(ROOT, "data", "snapshots", "media");
const OUTPUT_PATH = path.join(OUTPUT_DIR, `all-${year}.media.json`);
const LEGACY_OUTPUT_PATH = path.join(ROOT, "data", "media-index.json");

function slugify(input = "") {
  return String(input)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function asArray(parsed, key) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object" && Array.isArray(parsed[key])) return parsed[key];
  return [];
}

function compact(values) {
  return [...new Set(values.filter(Boolean))];
}

async function main() {
  const [eventsRaw, assetsRaw, artistsRaw, artistsEnrichedRaw, venuesRegistryRaw] = await Promise.all([
    readJson(EVENTS_PATH, { events: [] }),
    readJson(ASSETS_PATH, { events: {}, artists: {} }),
    readJson(ARTISTS_PATH, { artists: [] }),
    readJson(ARTISTS_ENRICHED_PATH, { artists: [] }),
    readJson(VENUES_REGISTRY_PATH, []),
  ]);

  const events = asArray(eventsRaw, "events");
  const artists = asArray(artistsRaw, "artists");
  const artistsEnriched = asArray(artistsEnrichedRaw, "artists");
  const venuesRegistry = Array.isArray(venuesRegistryRaw) ? venuesRegistryRaw : [];

  const assetsByEvent = assetsRaw?.events && typeof assetsRaw.events === "object" ? assetsRaw.events : {};
  const assetsByArtist = assetsRaw?.artists && typeof assetsRaw.artists === "object" ? assetsRaw.artists : {};

  const enrichedById = new Map(
    artistsEnriched
      .filter((row) => row && typeof row.id === "string")
      .map((row) => [row.id, row])
  );

  const artistBySlug = new Map(
    artists
      .filter((row) => row && typeof row.id === "string" && typeof row.name === "string")
      .map((row) => [slugify(row.name), row])
  );

  const artistMediaById = {};
  for (const artist of artists) {
    const enriched = enrichedById.get(artist.id);
    const asset = assetsByArtist?.[artist.id] ?? null;
    const spotifyImage = enriched?.spotifyImage ?? null;
    const ticketmasterImage = null;
    const seatgeekImage = artist?.image ?? null;
    const localAsset = asset?.local ?? null;
    const fallback = "/images/shows/fallback.jpg";
    const candidates = compact([spotifyImage, ticketmasterImage, seatgeekImage, localAsset, fallback]);
    const primary = candidates[0] ?? "/images/shows/fallback.jpg";
    artistMediaById[artist.id] = {
      id: artist.id,
      name: artist.name,
      slug: slugify(artist.name),
      image: {
        primary,
        candidates,
      },
      sources: {
        spotifyImage,
        ticketmasterImage,
        seatgeekImage,
        localAsset,
        fallback,
      },
      alt: `${artist.name} artist photo`,
      caption: `${artist.name} profile image for show and artist pages.`,
    };
  }

  const eventMediaById = {};
  for (const event of events) {
    const asset = assetsByEvent?.[event.id] ?? null;
    const localAsset = asset?.local ?? null;
    const ticketmasterImage =
      event?.source === "ticketmaster"
        ? asset?.remote ?? event?.image ?? null
        : null;
    const seatgeekImage =
      event?.source === "seatgeek"
        ? asset?.remote ?? event?.image ?? null
        : asset?.remote ?? event?.image ?? null;
    const spotifyImage = null;
    const fallback = "/images/shows/fallback.jpg";
    const candidates = compact([spotifyImage, ticketmasterImage, seatgeekImage, localAsset, fallback]);
    const primary = candidates[0] ?? "/images/shows/fallback.jpg";

    const artistRefs = compact(
      (event.artistNames ?? [])
        .map((name) => artistBySlug.get(slugify(name))?.id)
    );

    eventMediaById[event.id] = {
      id: event.id,
      slug: event.slug,
      title: event.name,
      dateKey: event.dateKey,
      venueId: event.venueId,
      image: {
        primary,
        candidates,
      },
      sources: {
        spotifyImage,
        ticketmasterImage,
        seatgeekImage,
        localAsset,
        fallback,
      },
      artistIds: artistRefs,
      alt: `${event.name} at ${event.venueId}`,
      caption: `${event.name} event image for ${event.dateKey}.`,
    };
  }

  const venueMediaById = {};
  for (const venue of venuesRegistry) {
    if (!venue?.slug || !venue?.name) continue;
    const local = `/images/venues/${venue.slug}.jpg`;
    venueMediaById[venue.slug] = {
      id: venue.slug,
      key: venue.key,
      name: venue.name,
      image: {
        primary: local,
        candidates: [local, "/images/venues/fallback.jpg"],
      },
      sources: {
        spotifyImage: null,
        ticketmasterImage: null,
        seatgeekImage: null,
        localAsset: local,
        fallback: "/images/venues/fallback.jpg",
      },
      alt: `${venue.name} venue photo`,
      caption: `${venue.name} venue image.`,
    };
  }

  const mapPoints = Object.values(eventMediaById)
    .filter((row) => row.venueId === "red-rocks-amphitheatre")
    .slice(0, 12)
    .map((row) => ({
      id: row.id,
      label: row.title,
      dateKey: row.dateKey,
      image: row.image.primary,
    }));

  const payload = {
    generatedAt: new Date().toISOString(),
    year,
    artistsById: artistMediaById,
    eventsById: eventMediaById,
    venuesById: venueMediaById,
    mapPoints,
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const serialized = JSON.stringify(payload, null, 2) + "\n";
  await fs.writeFile(OUTPUT_PATH, serialized, "utf8");
  await fs.writeFile(LEGACY_OUTPUT_PATH, serialized, "utf8");

  console.log(
    `Built media snapshot: ${Object.keys(artistMediaById).length} artists, ` +
      `${Object.keys(eventMediaById).length} events, ${Object.keys(venueMediaById).length} venues`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
