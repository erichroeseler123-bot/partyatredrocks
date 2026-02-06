const fs = require("fs");
const path = require("path");

const KEYS = {
  seatgeek: process.env.SEATGEEK_CLIENT_ID,
  gemini: process.env.GEMINI_API_KEY,
};

// Paths
const ROOT = process.cwd();
const CACHE_FILE = path.join(ROOT, "ai-intelligence-cache.json");
const OUTPUT_FILE = path.join(ROOT, "shows-2026.js");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------- Fallback ---------------- */

function fallbackIntel(artist) {
  return {
    bio: `${artist} performing live at Red Rocks.`,
    fans: "Mixed concert crowd.",
    logistics: {
      avgGroupSize: 3,
      vehicleBias: "suburban",
      arrivalWave: "spread",
      alcoholLikelihood: "high",
      parkingAvoidance: "high",
    },
    trslNode: {
      demandLevel: "medium",
      weatherSensitivity: "none",
    },
  };
}

/* ---------------- Cache ---------------- */

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/* ---------------- Gemini ---------------- */

async function getOperationalIntel(artist) {
  const cache = loadCache();

  if (cache[artist]?.logistics) return cache[artist];

  if (!KEYS.gemini) {
    console.warn("⚠️ No GEMINI key — using fallback");
    return fallbackIntel(artist);
  }

  console.log(`🧠 Classifying: ${artist}`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEYS.gemini}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Analyze "${artist}" for a Red Rocks show.
Return valid JSON with:
{
  "bio": "",
  "fans": "",
  "logistics": {
    "avgGroupSize": number,
    "vehicleBias": "suburban"|"van"|"bus",
    "arrivalWave": "early"|"spread"|"compressed",
    "alcoholLikelihood": "low"|"high",
    "parkingAvoidance": "low"|"medium"|"high"
  },
  "trslNode": {
    "demandLevel": "low"|"medium"|"high",
    "weatherSensitivity": "rain"|"snow"|"none"
  }
}`,
          },
        ],
      },
    ],
  };

  try {
    await sleep(2000);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error?.message);

    const text = data.candidates[0].content.parts[0].text;

    const intel = JSON.parse(text.replace(/```json|```/g, "").trim());

    cache[artist] = intel;
    saveCache(cache);

    return intel;
  } catch (e) {
    console.warn(`⚠️ Gemini failed for ${artist}: ${e.message}`);
    return fallbackIntel(artist);
  }
}

/* ---------------- Main ---------------- */

async function run() {
  console.log("📡 Fetching 2026 events…");

  const url = `https://api.seatgeek.com/2/events?venue.id=196&datetime_utc.gte=2026-01-01&per_page=100&client_id=${KEYS.seatgeek}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const events = data.events || [];

    console.log(`🔎 Found ${events.length} events`);

    const db = [];

    for (const e of events) {
      const performer = e.performers?.[0];

      if (!performer) continue;

      const intel = await getOperationalIntel(performer.name);

      db.push({
        slug: e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        artist: performer.name,
        date: e.datetime_local,
        img: performer.image,
        operational: intel,
        venue: "Red Rocks Amphitheatre",
        isGhostEvent: false,
      });

      console.log(`✅ Saved: ${performer.name}`);
    }

    fs.writeFileSync(
      OUTPUT_FILE,
      `window.RED_ROCKS_2026 = ${JSON.stringify(db, null, 2)};`
    );

    console.log(`\n🏁 DONE: ${db.length} shows saved`);
  } catch (e) {
    console.error("💥 Sync failed:", e.message);
    process.exit(1);
  }
}

run();
