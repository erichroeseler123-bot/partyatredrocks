import "dotenv/config";
import fs from "fs";

const API_KEY = process.env.TICKETMASTER_API_KEY || process.env.TM_API_KEY;
if (!API_KEY) {
  console.error("Missing TICKETMASTER_API_KEY or TM_API_KEY");
  process.exit(1);
}

// Red Rocks lat/long
const LAT = 39.6654;
const LON = -105.2057;

let page = 0;
let all = [];

while (true) {
  const url =
    `https://app.ticketmaster.com/discovery/v2/events.json` +
    `?latlong=${LAT},${LON}` +
    `&radius=5` +
    `&unit=miles` +
    `&classificationName=music` +
    `&size=200` +
    `&page=${page}` +
    `&apikey=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();
  const events = data._embedded?.events || [];

  all.push(...events);

  if (!data.page || page >= data.page.totalPages - 1) break;
  page++;
}

const shows = all.map(ev => {
  const date = ev.dates.start.localDate;
  const time = ev.dates.start.localTime || "TBD";
  const artist = ev._embedded?.attractions?.[0]?.name || "TBA";
  const month = new Date(date).toLocaleString("en-US", { month: "long" });

  return {
    id: ev.id,
    date,
    time,
    month,
    artists: [artist],
    info: ev.info || ev.pleaseNote || "",
    tickets: ev.url,
    image: ev.images?.[0]?.url || null
  };
});

fs.writeFileSync(
  "shows-2026.js",
  `export const RED_ROCKS_2026 = ${JSON.stringify(shows, null, 2)};`
);

console.log(`Saved ${shows.length} REAL Red Rocks shows`);
