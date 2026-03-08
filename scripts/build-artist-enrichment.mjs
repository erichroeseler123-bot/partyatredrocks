import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config();

const ROOT = process.cwd();
const ARTISTS_DIR = path.join(ROOT, "data", "snapshots", "artists");
const INDEXES_DIR = path.join(ROOT, "data", "snapshots", "indexes");

const year = Number(process.argv[2] ?? "2026");
const scope = process.argv[3] ?? "all";
const limit = Number(process.env.ENRICH_LIMIT ?? "150");
const concurrency = Math.max(1, Number(process.env.ENRICH_CONCURRENCY ?? "4"));

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const lastfmApiKey = process.env.LASTFM_API_KEY;
const setlistApiKey = process.env.SETLIST_FM_API_KEY || process.env.SETLIST_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
const musicbrainzUserAgent =
  process.env.MUSICBRAINZ_USER_AGENT || "PartyAtRedRocks/1.0 (contact@partyatredrocks.com)";

function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)),
  ]);
}

function cleanText(text) {
  if (!text) return null;
  return String(text).replace(/<[^>]*>/g, "").trim() || null;
}

async function getSpotifyToken() {
  if (!spotifyClientId || !spotifyClientSecret) return null;
  try {
    const res = await withTimeout(
      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      }),
      10000
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.access_token || null;
  } catch {
    return null;
  }
}

async function fetchSpotify(artistName, token) {
  if (!token) return { data: null, error: "spotify token unavailable" };
  try {
    const res = await withTimeout(
      fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      10000
    );
    if (!res.ok) return { data: null, error: `spotify ${res.status}` };
    const json = await res.json();
    const row = json?.artists?.items?.[0];
    if (!row) return { data: null, error: null };
    return {
      data: {
        id: row.id || null,
        url: row?.external_urls?.spotify || null,
        image: row?.images?.[0]?.url || null,
        genres: Array.isArray(row?.genres) ? row.genres.slice(0, 8) : [],
        followers: row?.followers?.total ?? null,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: String(err?.message || err) };
  }
}

async function fetchLastfm(artistName) {
  if (!lastfmApiKey) return { data: null, error: "lastfm api key unavailable" };
  try {
    const res = await withTimeout(
      fetch(
        `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${lastfmApiKey}&format=json`
      ),
      10000
    );
    if (!res.ok) return { data: null, error: `lastfm ${res.status}` };
    const json = await res.json();
    return {
      data: {
        bio: cleanText(json?.artist?.bio?.summary),
        image:
          json?.artist?.image?.find?.((img) => img?.size === "extralarge")?.["#text"] ||
          json?.artist?.image?.[0]?.["#text"] ||
          null,
        tags: Array.isArray(json?.artist?.tags?.tag)
          ? json.artist.tags.tag.map((t) => t?.name).filter(Boolean).slice(0, 8)
          : [],
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: String(err?.message || err) };
  }
}

async function fetchSetlistFm(artistName) {
  if (!setlistApiKey) return { data: null, error: "setlist api key unavailable" };
  try {
    const res = await withTimeout(
      fetch(`https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodeURIComponent(artistName)}&p=1`, {
        headers: {
          "x-api-key": setlistApiKey,
          Accept: "application/json",
        },
      }),
      10000
    );
    if (!res.ok) return { data: null, error: `setlist ${res.status}` };
    const json = await res.json();
    const first = Array.isArray(json?.setlist) ? json.setlist[0] : null;
    return {
      data: {
        total: Number.isFinite(Number(json?.total)) ? Number(json.total) : null,
        latestEventDate: first?.eventDate || null,
        latestVenue: first?.venue?.name || null,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: String(err?.message || err) };
  }
}

async function fetchLastfmTopTracks(artistName) {
  if (!lastfmApiKey) return { data: [], error: "lastfm api key unavailable" };
  try {
    const res = await withTimeout(
      fetch(
        `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${lastfmApiKey}&format=json&limit=8`
      ),
      10000
    );
    if (!res.ok) return { data: [], error: `lastfm-top ${res.status}` };
    const json = await res.json();
    const tracks = Array.isArray(json?.toptracks?.track)
      ? json.toptracks.track.map((t) => t?.name).filter(Boolean).slice(0, 8)
      : [];
    return { data: tracks, error: null };
  } catch (err) {
    return { data: [], error: String(err?.message || err) };
  }
}

async function fetchMusicBrainz(artistName) {
  try {
    const qRes = await withTimeout(
      fetch(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artistName)}&fmt=json&limit=1`, {
        headers: { "User-Agent": musicbrainzUserAgent },
      }),
      10000
    );
    if (!qRes.ok) return { data: null, error: `musicbrainz ${qRes.status}` };
    const qJson = await qRes.json();
    const row = qJson?.artists?.[0];
    if (!row?.id) return { data: null, error: null };
    return {
      data: {
        id: row.id,
        name: row.name || null,
        country: row.country || null,
        disambiguation: row.disambiguation || null,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: String(err?.message || err) };
  }
}

async function fetchGeminiSummary(artistName, signals) {
  if (!geminiApiKey) return { data: null, error: "gemini api key unavailable" };
  try {
    const prompt = [
      `Write one concise sentence about musical style for artist: ${artistName}.`,
      "Use only provided signals, no speculation.",
      `Signals: ${JSON.stringify(signals)}`,
    ].join("\n");
    const res = await withTimeout(
      fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 80 },
          }),
        }
      ),
      12000
    );
    if (!res.ok) return { data: null, error: `gemini ${res.status}` };
    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    return { data: text ? cleanText(text) : null, error: null };
  } catch (err) {
    return { data: null, error: String(err?.message || err) };
  }
}

async function loadArtists() {
  const raw = await fs.readFile(path.join(ARTISTS_DIR, `${scope}-${year}.json`), "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed?.artists) ? parsed.artists : Array.isArray(parsed) ? parsed : [];
}

function computeNextDate(dateKeys) {
  const today = new Date().toISOString().slice(0, 10);
  const sorted = [...new Set((dateKeys || []).filter(Boolean))].sort();
  return sorted.find((dk) => dk >= today) || null;
}

async function runPool(items, worker, size) {
  const out = new Array(items.length);
  let idx = 0;
  async function runner() {
    while (idx < items.length) {
      const i = idx++;
      out[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: size }, () => runner()));
  return out;
}

async function main() {
  const artists = await loadArtists();
  const target = artists.slice(0, limit > 0 ? limit : 0);
  const generatedAt = new Date().toISOString();
  const spotifyToken = await getSpotifyToken();

  const enriched = await runPool(
    target,
    async (artist) => {
      const [topTracksRes, spotify, lastfm, musicbrainz, setlist] = await Promise.all([
        fetchLastfmTopTracks(artist.name),
        fetchSpotify(artist.name, spotifyToken),
        fetchLastfm(artist.name),
        fetchMusicBrainz(artist.name),
        fetchSetlistFm(artist.name),
      ]);

      const signalLite = {
        spotifyGenres: spotify.data?.genres || [],
        lastfmTags: lastfm.data?.tags || [],
      };
      const gemini = await fetchGeminiSummary(artist.name, signalLite);
      const genres = [...new Set([...(spotify.data?.genres || []), ...(lastfm.data?.tags || [])])].slice(0, 10);
      const officialLinks = [
        spotify.data?.url || null,
        musicbrainz.data?.id ? `https://musicbrainz.org/artist/${musicbrainz.data.id}` : null,
      ].filter(Boolean);

      const dateKeys = Array.isArray(artist.dateKeys) ? artist.dateKeys : [];
      const eventIds = Array.isArray(artist.eventIds) ? artist.eventIds : [];
      const venueIds = Array.isArray(artist.venueIds) ? artist.venueIds : [];
      const coArtists = Array.isArray(artist.coArtists) ? artist.coArtists : [];

      return {
        id: artist.id,
        name: artist.name,
        showCount: Number.isFinite(Number(artist.showCount)) ? Number(artist.showCount) : eventIds.length,
        venueIds,
        eventIds,
        firstDate: artist.firstDate || (dateKeys.length ? [...dateKeys].sort()[0] : null),
        lastDate: artist.lastDate || (dateKeys.length ? [...dateKeys].sort().slice(-1)[0] : null),
        nextDate: computeNextDate(dateKeys),
        coArtists,
        spotifyId: spotify.data?.id || null,
        spotifyImage: spotify.data?.image || artist.image || null,
        genres,
        lastfmBio: lastfm.data?.bio || gemini.data || null,
        topTracks: Array.isArray(topTracksRes.data) ? topTracksRes.data : [],
        officialLinks,
        providerErrors: {
          topTracks: topTracksRes.error,
          spotify: spotify.error,
          lastfm: lastfm.error,
          musicbrainz: musicbrainz.error,
          setlistFm: setlist.error,
          gemini: gemini.error,
        },
      };
    },
    concurrency
  );

  const byArtistId = {};
  for (const row of enriched) byArtistId[row.id] = row;

  await fs.writeFile(
    path.join(ARTISTS_DIR, `${scope}-${year}.enriched.json`),
    JSON.stringify(
      {
        generatedAt,
        year,
        scope,
        source: "snapshot-enrichment",
        artists: enriched,
      },
      null,
      2
    ) + "\n"
  );

  await fs.writeFile(
    path.join(INDEXES_DIR, `${scope}-${year}.artistEnrichment.json`),
    JSON.stringify(
      {
        generatedAt,
        year,
        scope,
        byArtistId,
      },
      null,
      2
    ) + "\n"
  );

  console.log(
    `Enriched ${enriched.length}/${artists.length} artists for ${scope}-${year}. (limit=${limit}, concurrency=${concurrency})`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
