import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  getEventsCatalog,
  getUpcomingEventsCatalog,
  resolveUpcomingYears,
  selectUpcomingEvents,
} from "@/lib/events/getCatalog";
import type { NormalizedEvent } from "@/lib/events/schema";

const ROOT = process.cwd();

test("resolveUpcomingYears bridges currentYear -> currentYear + 1 by default", () => {
  assert.deepEqual(resolveUpcomingYears("2026-11-11"), [2026, 2027]);
  assert.deepEqual(resolveUpcomingYears("2026-11-16"), [2026, 2027]);
  assert.deepEqual(resolveUpcomingYears("2027-01-05"), [2027, 2028]);
  assert.deepEqual(resolveUpcomingYears("2026-11-11", [2027, 2026, 2027]), [2026, 2027]);
});

test("getUpcomingEventsCatalog bridges late-2026 shows into verified 2027 Red Rocks events", async () => {
  // Pre-Nov-15 2026: final 2026 weekend shows come first, followed chronologically by 2027 shows
  const fromNov11 = await getUpcomingEventsCatalog({
    scopes: ["redrocks"],
    fromDateKey: "2026-11-11",
    years: [2026, 2027],
    venueId: "red-rocks-amphitheatre",
  });

  assert.ok(fromNov11.length > 43, "expected remaining Nov 2026 shows plus 43 verified 2027 shows");
  assert.equal(fromNov11[0]?.dateKey, "2026-11-14");
  const has2026 = fromNov11.some((event) => event.dateKey.startsWith("2026-"));
  const has2027 = fromNov11.some((event) => event.dateKey.startsWith("2027-"));
  assert.equal(has2026, true);
  assert.equal(has2027, true);

  for (let idx = 1; idx < fromNov11.length; idx += 1) {
    assert.ok(
      fromNov11[idx - 1].dateKey <= fromNov11[idx].dateKey,
      `events out of chronological order: ${fromNov11[idx - 1].dateKey} > ${fromNov11[idx].dateKey}`
    );
  }

  // Post-Nov-16 2026 rollover: seamlessly selects first official 2027 concert (2027-03-25 Porter Robinson B2B Ninajirachi)
  const fromNov16 = await getUpcomingEventsCatalog({
    scopes: ["redrocks"],
    fromDateKey: "2026-11-16",
    years: [2026, 2027],
    venueId: "red-rocks-amphitheatre",
  });

  assert.equal(fromNov16.length, 43);
  assert.equal(fromNov16[0]?.dateKey, "2027-03-25");
  assert.equal(fromNov16[0]?.name, "Porter Robinson B2B Ninajirachi");
  assert.equal(
    fromNov16[0]?.sourceUrl,
    "https://www.redrocksonline.com/events/porter-robinson-b2b-ninajirachi-1644262/"
  );
  assert.equal(fromNov16.at(-1)?.dateKey, "2027-10-13");
  assert.equal(fromNov16.at(-1)?.name, "Fontaines D.C.");
});

test("getUpcomingEventsCatalog handles empty future windows and unannounced venue years without cross-venue or fabricated shows", async () => {
  // Post-last-verified-2027 show returns empty array cleanly so UI shows truthful custom-date / presale experience
  const afterOct2027 = await getUpcomingEventsCatalog({
    scopes: ["redrocks"],
    fromDateKey: "2027-11-01",
    years: [2027, 2028],
    venueId: "red-rocks-amphitheatre",
  });
  assert.deepEqual(afterOct2027, []);

  // Custom empty loader test (simulating zero announced 2027 concerts)
  const emptyRollover = await getUpcomingEventsCatalog({
    scopes: ["redrocks"],
    fromDateKey: "2026-11-16",
    years: [2026, 2027],
    venueId: "red-rocks-amphitheatre",
    catalogLoader: async () => [] as NormalizedEvent[],
  });
  assert.deepEqual(emptyRollover, []);

  // Querying another venue scope for 2027 must NOT leak Red Rocks 2027 concerts
  const mission2027 = await getEventsCatalog(2027, "mission-ballroom");
  assert.deepEqual(mission2027, []);

  // Deduplication and venue filtering check
  const sample: NormalizedEvent[] = [
    {
      id: "rr-2027-03-25-porter-robinson-b2b-ninajirachi",
      source: "snapshot",
      sourceId: "1644262",
      name: "Porter Robinson B2B Ninajirachi",
      startAt: "2027-03-25T18:00:00",
      startLocal: "2027-03-25T18:00:00",
      venueId: "red-rocks-amphitheatre",
      headliners: ["artist-porter-robinson-b2b-ninajirachi"],
      artists: ["artist-porter-robinson-b2b-ninajirachi"],
      artistNames: ["Porter Robinson B2B Ninajirachi"],
      image: null,
      ticketUrl: null,
      sourceUrl: "https://www.redrocksonline.com/events/porter-robinson-b2b-ninajirachi-1644262/",
      verifiedAt: "2026-11-11",
      dateKey: "2027-03-25",
      slug: "2027-03-25-porter-robinson-b2b-ninajirachi",
    },
  ];
  assert.equal(selectUpcomingEvents([...sample, ...sample], { fromDateKey: "2027-01-01" }).length, 1);
});

test("all 2027 Red Rocks ledger and snapshot entries are source-verified against redrocksonline.com with zero placeholders", () => {
  const ledgerRaw = JSON.parse(
    readFileSync(path.join(ROOT, "data", "shows", "redrocks", "2027.json"), "utf8")
  ) as Array<Record<string, unknown>>;
  const snapshotRaw = JSON.parse(
    readFileSync(path.join(ROOT, "data", "snapshots", "events", "redrocks-2027.json"), "utf8")
  ) as { verifiedAt?: string; year?: number; events?: NormalizedEvent[] };

  assert.equal(ledgerRaw.length, 43);
  assert.equal(snapshotRaw.year, 2027);
  assert.equal(snapshotRaw.verifiedAt, "2026-11-11");
  assert.equal(snapshotRaw.events?.length, 43);

  for (const event of snapshotRaw.events ?? []) {
    assert.equal(event.venueId, "red-rocks-amphitheatre");
    assert.match(event.dateKey, /^2027-\d{2}-\d{2}$/);
    assert.equal(event.verifiedAt, "2026-11-11");
    assert.match(
      String(event.sourceUrl || ""),
      /^https:\/\/www\.redrocksonline\.com\/events\/[a-z0-9-]+-\d+\/$/
    );
    assert.doesNotMatch(event.name, /tba|tbd|placeholder|unannounced|rumor/i);
  }

  // Homepage must use multi-year upcoming selector rather than hardcoded getEventsCatalog(2026, "redrocks")
  const homePageSource = readFileSync(path.join(ROOT, "app", "page.tsx"), "utf8");
  assert.doesNotMatch(homePageSource, /getEventsCatalog\(\s*2026/);
  assert.match(homePageSource, /getUpcomingEventsCatalog/);
});
