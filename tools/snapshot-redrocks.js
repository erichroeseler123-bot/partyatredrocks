/**
 * snapshot-redrocks.js
 *
 * One-time snapshot of official Red Rocks events.
 * Pulls embedded JSON-LD from redrocksonline.com/events
 * Filters to music/concerts
 * Outputs concerts.js (static, frozen)
 */

import fs from "fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const URL = "https://www.redrocksonline.com/events/";

(async () => {
  console.log("Fetching Red Rocks events…");

  const res = await fetch(URL, {
    headers: { "User-Agent": "PartyAtRedRocks/1.0" }
  });

  const html = await res.text();
  const dom = new JSDOM(html);
  const scripts = [...dom.window.document.querySelectorAll("script[type='application/ld+json']")];

  let events = [];

  for (const s of scripts) {
    try {
      const data = JSON.parse(s.textContent);
      if (data["@type"] === "MusicEvent") {
        events.push({
          title: data.name,
          start: data.startDate?.split("T")[0],
          url: data.url
        });
      }
    } catch {}
  }

  events = events
    .filter(e => e.title && e.start)
    .sort((a, b) => a.start.localeCompare(b.start));

  const output =
`// concerts.js
// Frozen snapshot of official Red Rocks concerts
// Generated ${new Date().toISOString()}

window.CONCERTS = ${JSON.stringify(events, null, 2)};
`;

  fs.writeFileSync("concerts.js", output);
  console.log("✓ concerts.js written with", events.length, "events");
})();
