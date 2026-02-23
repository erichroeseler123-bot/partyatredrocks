import "dotenv/config";
import fs from "fs";

const SEATGEEK = "https://api.seatgeek.com/2";
const key = process.env.SEATGEEK_CLIENT_ID;
if (!key) {
  console.error("Missing SEATGEEK_CLIENT_ID in env");
  process.exit(1);
}

const path = "data/venues.json";
const j = JSON.parse(fs.readFileSync(path, "utf8"));

function norm(s="") { return String(s).trim().toLowerCase(); }
function toNum(x) {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string" && x.trim()) {
    const n = Number(x);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function score(candidate, targetName, targetSlugHint) {
  let score = 0;
  const cName = norm(candidate?.name);
  const cSlug = norm(candidate?.slug);
  const tName = norm(targetName);
  const tSlug = norm(targetSlugHint);

  if (norm(candidate?.state) === "co") score += 50;
  if (norm(candidate?.city) === "denver") score += 20;
  if (norm(candidate?.city) === "boulder") score += 15;
  if (norm(candidate?.city).includes("colorado springs")) score += 15;

  if (cName === tName) score += 80;
  else if (cName.includes(tName) || tName.includes(cName)) score += 35;

  if (tSlug && cSlug === tSlug) score += 120;
  else if (tSlug && (cSlug.includes(tSlug) || tSlug.includes(cSlug))) score += 45;

  if (candidate?.state && norm(candidate.state) !== "co") score -= 60;

  return score;
}

async function fetchVenuesByQuery(name) {
  const url = new URL(`${SEATGEEK}/venues`);
  url.searchParams.set("client_id", key);
  url.searchParams.set("q", name);
  url.searchParams.set("per_page", "25");
  url.searchParams.set("lat", "39.7392");
  url.searchParams.set("lon", "-104.9903");
  url.searchParams.set("range", "200mi");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`SeatGeek venues q failed: ${res.status}`);
  const data = await res.json();
  return data?.venues || [];
}

const featured = Object.entries(j).filter(([_,v]) => v?.featured);

let updated = 0;

for (const [slug, v] of featured) {
  const haveId = toNum(v?.seatgeekVenueId) ?? toNum(v?.seatgeekId) ?? toNum(v?.seatgeek_id);
  const haveSlug = v?.seatgeekSlug ?? v?.seatgeek_slug;

  if (haveId && haveSlug) continue;

  const name = v?.name ?? slug.replace(/-/g, " ");
  const candidates = await fetchVenuesByQuery(name);
  if (!candidates.length) continue;

  let best = null;
  let bestScore = -1e9;

  for (const c of candidates) {
    const s = score(c, name, haveSlug || slug);
    if (s > bestScore) { bestScore = s; best = c; }
  }

  if (!best || bestScore < 40) continue;

  v.seatgeekSlug = best.slug;
  v.seatgeekVenueId = best.id;

  delete v.seatgeekId;
  delete v.seatgeek_id;

  j[slug] = v;
  updated++;
  console.log(`✅ ${slug}: ${best.name} -> slug=${best.slug} id=${best.id} (score ${bestScore})`);

  // tiny throttle
  await new Promise(r => setTimeout(r, 120));
}

fs.writeFileSync(path, JSON.stringify(j, null, 2) + "\n");
console.log(`\nDone. Updated ${updated} featured venues.`);
