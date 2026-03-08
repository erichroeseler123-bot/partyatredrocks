import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SHOWS_DIR = path.join(ROOT, "data", "shows");
const VENUE_REGISTRY_FILE = path.join(ROOT, "data", "venues.registry.json");
const EVENTS_DIR = path.join(ROOT, "data", "snapshots", "events");
const INDEXES_DIR = path.join(ROOT, "data", "snapshots", "indexes");
const ARTISTS_DIR = path.join(ROOT, "data", "snapshots", "artists");
const SEARCH_DIR = path.join(ROOT, "data", "snapshots", "search");
const ASSETS_DIR = path.join(ROOT, "data", "snapshots", "assets");
const PUBLIC_DIR = path.join(ROOT, "public");

const year = Number(process.argv[2] ?? "2026");

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function artistId(name) {
  return `artist-${slugify(name)}`;
}

function eventId(venueKey, dateKey, name) {
  const prefix = venueKey === "redrocks" ? "rr" : venueKey;
  return `${prefix}-${dateKey}-${slugify(name)}`;
}

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

function validateLedgerRows(rows, venueKey) {
  assert(Array.isArray(rows), `Ledger must be an array for ${venueKey}`);
  const seen = new Set();
  const allowedKeys = new Set(["dateKey", "title", "support"]);

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    assert(row && typeof row === "object", `Invalid row object for ${venueKey} at index ${i}`);
    const keys = Object.keys(row);
    for (const key of keys) {
      assert(allowedKeys.has(key), `Unexpected key "${key}" for ${venueKey} at index ${i}`);
    }
    assert(typeof row.dateKey === "string", `Missing dateKey for ${venueKey} at index ${i}`);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(row.dateKey), `Invalid dateKey "${row.dateKey}" for ${venueKey} at index ${i}`);
    assert(typeof row.title === "string" && row.title.trim().length > 0, `Missing title for ${venueKey} at index ${i}`);
    if (row.support != null) {
      assert(typeof row.support === "string", `support must be string for ${venueKey} at index ${i}`);
    }
    const key = `${row.dateKey}|||${String(row.title).toLowerCase().trim()}`;
    assert(!seen.has(key), `Duplicate show row for ${venueKey} at index ${i}: ${row.dateKey} ${row.title}`);
    seen.add(key);
  }
}

async function loadVenueLedgers(targetYear) {
  const registryRaw = await fs.readFile(VENUE_REGISTRY_FILE, "utf8");
  const registry = JSON.parse(registryRaw);
  assert(Array.isArray(registry), "Venue registry must be an array");
  const venueDefs = registry.map((row, i) => {
    assert(row && typeof row === "object", `Venue registry row must be object at index ${i}`);
    assert(typeof row.key === "string" && row.key.trim(), `Venue registry key missing at index ${i}`);
    assert(typeof row.slug === "string" && row.slug.trim(), `Venue registry slug missing at index ${i}`);
    assert(typeof row.name === "string" && row.name.trim(), `Venue registry name missing at index ${i}`);
    return {
      key: row.key.trim(),
      slug: row.slug.trim(),
      name: row.name.trim(),
    };
  });
  const seenKeys = new Set();
  const seenSlugs = new Set();
  for (const venue of venueDefs) {
    assert(!seenKeys.has(venue.key), `Duplicate venue registry key "${venue.key}"`);
    assert(!seenSlugs.has(venue.slug), `Duplicate venue registry slug "${venue.slug}"`);
    seenKeys.add(venue.key);
    seenSlugs.add(venue.slug);
  }
  const venueByKey = new Map(venueDefs.map((venue) => [venue.key, venue]));

  const dirs = await fs.readdir(SHOWS_DIR, { withFileTypes: true });
  for (const entry of dirs) {
    if (!entry.isDirectory()) continue;
    assert(venueByKey.has(entry.name), `Missing registry entry for ledger directory "${entry.name}"`);
  }

  const ledgers = [];

  for (const venue of venueDefs) {
    const venueKey = venue.key;
    const filePath = path.join(SHOWS_DIR, venueKey, `${targetYear}.json`);
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(raw);
      validateLedgerRows(parsed, venueKey);
      ledgers.push({
        venueKey,
        venueId: venue.slug,
        venueName: venue.name,
        shows: parsed.map((row) => ({
          date: row.dateKey,
          title: row.title,
          support: row.support || "",
        })),
      });
    } catch (err) {
      if (err && String(err).includes("ENOENT")) continue;
      throw err;
    }
  }

  if (ledgers.length === 0) {
    throw new Error(`No venue ledgers found for year ${targetYear} under ${SHOWS_DIR}`);
  }

  return ledgers.sort((a, b) => a.venueKey.localeCompare(b.venueKey));
}

function parseArtists(title, support) {
  const fromTitle = String(title)
    .split(/ with /i)
    .flatMap((chunk, idx) => (idx === 0 ? [chunk] : chunk.split(/,| and /i)))
    .map((x) => x.replace(/\bmore\b/gi, "").trim())
    .filter(Boolean);
  const fromSupport = String(support || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return [...new Set([...fromTitle, ...fromSupport])];
}

function buildEvents(venueKey, venueId, shows, eventYear) {
  return shows
    .filter((show) => String(show.date).startsWith(String(eventYear)))
    .map((show) => {
      const artistNames = parseArtists(show.title, show.support);
      const headliner = artistNames[0] || show.title;
      const startAt = `${show.date}T19:00:00`;
      return {
        id: eventId(venueKey, show.date, show.title),
        source: "snapshot",
        sourceId: null,
        name: show.title,
        startAt,
        startLocal: startAt,
        venueId,
        headliners: [artistId(headliner)],
        artists: artistNames.map(artistId),
        artistNames,
        image: null,
        ticketUrl: null,
        dateKey: show.date,
        slug: slugify(`${show.date}-${show.title}`),
      };
    })
    .sort((a, b) => String(a.startAt).localeCompare(String(b.startAt)));
}

function buildIndexes(events) {
  const eventsByDate = {};
  const eventsByMonth = {};
  const eventsByVenue = {};
  const artistToEvents = {};
  const artistIndex = {};

  for (const ev of events) {
    eventsByDate[ev.dateKey] = eventsByDate[ev.dateKey] || [];
    eventsByDate[ev.dateKey].push(ev.id);

    const monthKey = String(ev.dateKey).slice(0, 7);
    eventsByMonth[monthKey] = eventsByMonth[monthKey] || [];
    eventsByMonth[monthKey].push(ev.id);

    eventsByVenue[ev.venueId] = eventsByVenue[ev.venueId] || [];
    eventsByVenue[ev.venueId].push(ev.id);

    for (let i = 0; i < ev.artistNames.length; i += 1) {
      const name = ev.artistNames[i];
      const id = ev.artists[i] || artistId(name);
      const key = name.toLowerCase();
      artistIndex[key] = id;
      artistToEvents[id] = artistToEvents[id] || [];
      artistToEvents[id].push(ev.id);
    }
  }

  return { eventsByDate, eventsByMonth, eventsByVenue, artistToEvents, artistIndex };
}

function buildArtists(events) {
  const seen = new Map();
  for (const ev of events) {
    for (let i = 0; i < ev.artistNames.length; i += 1) {
      const name = ev.artistNames[i];
      const id = ev.artists[i] || artistId(name);
      if (!seen.has(id)) {
        seen.set(id, {
          id,
          name,
          image: ev.image || null,
          links: {},
          eventIds: [],
          venueIds: new Set(),
          dateKeys: new Set(),
          coArtists: new Set(),
        });
      }
      const row = seen.get(id);
      row.eventIds.push(ev.id);
      row.venueIds.add(ev.venueId);
      row.dateKeys.add(ev.dateKey);
      for (const coId of ev.artists) {
        if (coId !== id) row.coArtists.add(coId);
      }
    }
  }
  return Array.from(seen.values())
    .map((artist) => {
      const eventIds = [...new Set(artist.eventIds)];
      const dateKeys = [...artist.dateKeys].sort();
      const venueIds = [...artist.venueIds].sort();
      const coArtists = [...artist.coArtists].sort();
      return {
        id: artist.id,
        name: artist.name,
        image: artist.image,
        links: artist.links,
        eventIds,
        venueIds,
        dateKeys,
        showCount: eventIds.length,
        firstDate: dateKeys[0] || null,
        lastDate: dateKeys[dateKeys.length - 1] || null,
        coArtists,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function buildArtistProfileIndex(artists) {
  const byArtistId = {};
  for (const artist of artists) {
    byArtistId[artist.id] = {
      id: artist.id,
      name: artist.name,
      eventIds: artist.eventIds,
      venueIds: artist.venueIds,
      dateKeys: artist.dateKeys,
      showCount: artist.showCount,
      firstDate: artist.firstDate,
      lastDate: artist.lastDate,
      coArtists: artist.coArtists,
    };
  }
  return {
    byArtistId,
    artistIdsByShowCountDesc: artists
      .slice()
      .sort((a, b) => b.showCount - a.showCount || a.name.localeCompare(b.name))
      .map((artist) => artist.id),
  };
}

function buildSearch(events) {
  return events.map((ev) => ({
    eventKey: ev.id,
    title: ev.name,
    artistNames: ev.artistNames,
    venueId: ev.venueId,
    dateKey: ev.dateKey,
    tags: [ev.venueId, ...ev.artistNames].map((x) => String(x).toLowerCase()),
  }));
}

async function findLocalAsset(relNoExt) {
  const exts = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
  for (const ext of exts) {
    const rel = `${relNoExt}${ext}`;
    const full = path.join(PUBLIC_DIR, rel);
    try {
      await fs.access(full);
      return `/${rel.replace(/\\/g, "/")}`;
    } catch {}
  }
  return null;
}

async function buildAssets(events, artists) {
  const eventAssets = {};
  const artistAssets = {};

  await Promise.all(
    events.map(async (ev) => {
      const local = await findLocalAsset(path.join("media", "events", ev.id));
      eventAssets[ev.id] = {
        local,
        remote: ev.image || null,
      };
    })
  );

  await Promise.all(
    artists.map(async (artist) => {
      const local = await findLocalAsset(path.join("media", "artists", artist.id));
      artistAssets[artist.id] = {
        local,
        remote: artist.image || null,
      };
    })
  );

  return { events: eventAssets, artists: artistAssets };
}

async function ensureDirs() {
  await fs.mkdir(EVENTS_DIR, { recursive: true });
  await fs.mkdir(INDEXES_DIR, { recursive: true });
  await fs.mkdir(ARTISTS_DIR, { recursive: true });
  await fs.mkdir(SEARCH_DIR, { recursive: true });
  await fs.mkdir(ASSETS_DIR, { recursive: true });
}

async function writeBundle(stem, events, targetYear, generatedAt) {
  const indexes = buildIndexes(events);
  const artists = buildArtists(events);
  const artistProfiles = buildArtistProfileIndex(artists);
  const search = buildSearch(events);
  const assets = await buildAssets(events, artists);

  await Promise.all([
    fs.writeFile(
      path.join(EVENTS_DIR, `${stem}-${targetYear}.json`),
      JSON.stringify({ generatedAt, year: targetYear, events }, null, 2) + "\n",
      "utf8"
    ),
    fs.writeFile(
      path.join(INDEXES_DIR, `${stem}-${targetYear}.byDate.json`),
      JSON.stringify({ generatedAt, year: targetYear, eventsByDate: indexes.eventsByDate }, null, 2) + "\n",
      "utf8"
    ),
    fs.writeFile(
      path.join(INDEXES_DIR, `${stem}-${targetYear}.byMonth.json`),
      JSON.stringify({ generatedAt, year: targetYear, eventsByMonth: indexes.eventsByMonth }, null, 2) + "\n",
      "utf8"
    ),
    fs.writeFile(
      path.join(INDEXES_DIR, `${stem}-${targetYear}.byVenue.json`),
      JSON.stringify({ generatedAt, year: targetYear, eventsByVenue: indexes.eventsByVenue }, null, 2) + "\n",
      "utf8"
    ),
    fs.writeFile(
      path.join(INDEXES_DIR, `${stem}-${targetYear}.artists.json`),
      JSON.stringify(
        {
          generatedAt,
          year: targetYear,
          artistToEvents: indexes.artistToEvents,
          artistIndex: indexes.artistIndex,
        },
        null,
        2
      ) + "\n",
      "utf8"
    ),
    fs.writeFile(
      path.join(INDEXES_DIR, `${stem}-${targetYear}.artistProfiles.json`),
      JSON.stringify({ generatedAt, year: targetYear, ...artistProfiles }, null, 2) + "\n",
      "utf8"
    ),
    fs.writeFile(
      path.join(ARTISTS_DIR, `${stem}-${targetYear}.json`),
      JSON.stringify({ generatedAt, year: targetYear, artists }, null, 2) + "\n",
      "utf8"
    ),
    fs.writeFile(
      path.join(SEARCH_DIR, `${stem}-${targetYear}.search.json`),
      JSON.stringify({ generatedAt, year: targetYear, docs: search }, null, 2) + "\n",
      "utf8"
    ),
    fs.writeFile(
      path.join(ASSETS_DIR, `${stem}-${targetYear}.assets.json`),
      JSON.stringify({ generatedAt, year: targetYear, ...assets }, null, 2) + "\n",
      "utf8"
    ),
  ]);
}

async function main() {
  const ledgers = await loadVenueLedgers(year);
  const generatedAt = new Date().toISOString();
  await ensureDirs();

  const eventsByVenueKey = {};
  for (const ledger of ledgers) {
    eventsByVenueKey[ledger.venueKey] = buildEvents(ledger.venueKey, ledger.venueId, ledger.shows, year);
  }

  const allEvents = Object.values(eventsByVenueKey)
    .flat()
    .sort((a, b) => String(a.startAt).localeCompare(String(b.startAt)));

  await Promise.all([
    ...ledgers.map((ledger) => writeBundle(ledger.venueKey, eventsByVenueKey[ledger.venueKey], year, generatedAt)),
    writeBundle("all", allEvents, year, generatedAt),
  ]);

  console.log(`Built ${allEvents.length} events across ${ledgers.length} venue ledgers for ${year}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
