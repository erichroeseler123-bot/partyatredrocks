const fs = require('fs');
const path = require('path');

const KEYS = {
  seatgeek: process.env.SEATGEEK_CLIENT_ID,
  gemini: process.env.GEMINI_API_KEY
};

// Paths
const ROOT = process.cwd();
const CACHE_FILE = path.resolve(ROOT, 'ai-intelligence-cache.json');
const OUTPUT_FILE = path.resolve(ROOT, 'shows-2026.js');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------------------------------------------
   SAFE FALLBACK (ALWAYS USED IF AI FAILS)
--------------------------------------------------- */
function fallbackIntel(artist) {
  return {
    bio: `${artist} live at Red Rocks Amphitheatre.`,
    fans: "Mixed crowd, average group size 2–4 people.",
    logistics: {
      avgGroupSize: 3,
      vehicleBias: "suburban",
      arrivalWave: "spread",
      alcoholLikelihood: "high",
      parkingAvoidance: "medium"
    },
    trslNode: {
      demandLevel: "medium",
      weatherSensitivity: "none"
    },
    _source: "fallback"
  };
}

/* ---------------------------------------------------
   LOAD CACHE SAFELY
--------------------------------------------------- */
function loadCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      fs.writeFileSync(CACHE_FILE, '{}');
      return {};
    }

    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (e) {
    console.warn("⚠️ Cache unreadable, starting fresh");
    return {};
  }
}

/* ---------------------------------------------------
   SAVE CACHE
--------------------------------------------------- */
function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (e) {
    console.warn("⚠️ Could not save cache:", e.message);
  }
}

/* ---------------------------------------------------
   AI ANALYST (OPTIONAL)
--------------------------------------------------- */
async function getOperationalIntel(artistName, cache) {

  // Cached?
  if (cache[artistName]?.logistics) {
    return cache[artistName];
  }

  // No API key? Skip AI.
  if (!KEYS.gemini) {
    console.log(`⚠️ No Gemini key — using fallback for ${artistName}`);
    return fallbackIntel(artistName);
  }

  console.log(`🧠 Classifying: ${artistName}`);

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEYS.gemini}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Analyze "${artistName}" for a Red Rocks show.
Return valid JSON:

{
  "bio": "summary",
  "fans": "crowd description",
  "logistics": {
    "avgGroupSize": number,
    "vehicleBias": "suburban" | "van" | "bus",
    "arrivalWave": "early" | "spread" | "compressed",
    "alcoholLikelihood": "low" | "high",
    "parkingAvoidance": "low" | "medium" | "high"
  },
  "trslNode": {
    "demandLevel": "low" | "medium" | "high",
    "weatherSensitivity": "rain" | "snow" | "none"
  }
}`
      }]
    }]
  };

  try {
    await sleep(2000);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error?.message);

    let text = data.candidates[0].content.parts[0].text;

    const intel = JSON.parse(
      text.replace(/```json|```/g, '').trim()
    );

    cache[artistName] = intel;
    saveCache(cache);

    return intel;

  } catch (e) {
    console.warn(`⚠️ AI failed for ${artistName}: ${e.message}`);
    return fallbackIntel(artistName);
  }
}

/* ---------------------------------------------------
   MAIN SYNC
--------------------------------------------------- */
async function runSync() {

  console.log("📡 Fetching SeatGeek 2026 shows...");

  const seatgeekUrl =
    `https://api.seatgeek.com/2/events?venue.id=196&datetime_utc.gte=2026-01-01&per_page=100&client_id=${KEYS.seatgeek}`;

  try {

    const res = await fetch(seatgeekUrl);
    const data = await res.json();
    const events = data.events || [];

    console.log(`🔎 Found ${events.length} events`);

    const cache = loadCache();
    const db = [];

    for (const e of events) {

      const performer = e.performers?.[0];
      if (!performer) continue;

      const intel = await getOperationalIntel(
        performer.name,
        cache
      );

      console.log(`✅ Saved: ${performer.name}`);

      db.push({
        slug: e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        artist: performer.name,
        date: e.datetime_local,
        img: performer.image,
        operational: intel,
        venue: "Red Rocks Amphitheatre",
        isGhostEvent: false
      });

      // Global throttle
      await sleep(1500);
    }

    fs.writeFileSync(
      OUTPUT_FILE,
      `window.RED_ROCKS_2026 = ${JSON.stringify(db, null, 2)};`
    );

    console.log(`\n🏁 DONE: ${db.length} shows saved`);

  } catch (e) {
    console.error("💥 Sync failed:", e.message);
  }
}

runSync();
