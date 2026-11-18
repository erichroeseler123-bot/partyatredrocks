import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  MANUAL_REVIEW_PROTECTED_URLS,
  evaluateArtistPageDisposition,
  evaluateArtistVenuePageDisposition,
  evaluateFirstBankCenterPath,
  evaluateFutureRedRocksShowGate,
  evaluateParserArtifactSlug,
  evaluateShowPageDisposition,
  evaluateVenuePageDisposition,
} from "../lib/seo/indexationGate";
import { getServedVenues } from "../lib/servedVenues";

const ROOT = process.cwd();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

test("1. Manual-review protection list never auto-redirects, canonicalizes elsewhere, or auto-noindexes", () => {
  for (const protectedPath of Object.keys(MANUAL_REVIEW_PROTECTED_URLS)) {
    if (protectedPath.startsWith("/artists/") && protectedPath.split("/").filter(Boolean).length === 2) {
      const slug = protectedPath.split("/")[2];
      const res = evaluateArtistPageDisposition({
        artistSlug: slug,
        upcomingRedRocksCount: 0,
        historicalRedRocksCount: 0,
        upcomingServedSecondaryCount: 0,
      });
      assert.equal(res.action, "render_200", `Protected artist ${protectedPath} must render 200`);
      assert.equal(res.index, true, `Protected artist ${protectedPath} must not be auto-noindexed`);
      assert.equal(res.canonicalPath, protectedPath, `Protected artist ${protectedPath} must keep self-canonical`);
      assert.equal(res.disposition, "manual_review_protected");
    }

    if (protectedPath.startsWith("/artists/") && protectedPath.split("/").filter(Boolean).length === 3) {
      const [, , artistSlug, venueSlug] = protectedPath.split("/");
      const res = evaluateArtistVenuePageDisposition({
        artistSlug,
        venueSlug,
        distinctVenueCountForArtist: 1,
        artistHasRedRocksShow: true,
        upcomingAtVenueCount: 0,
      });
      assert.equal(res.action, "render_200", `Protected artist×venue ${protectedPath} must not auto-redirect`);
      assert.equal(res.index, true, `Protected artist×venue ${protectedPath} must remain indexable`);
      assert.equal(res.canonicalPath, protectedPath);
      assert.equal(res.disposition, "manual_review_protected");
    }

    if (protectedPath.startsWith("/shows/")) {
      const showId = protectedPath.slice("/shows/".length);
      const res = evaluateShowPageDisposition({
        id: showId,
        title: "Protected Historical Show",
        venueSlug: "red-rocks-amphitheatre",
        dateKey: "2026-07-03",
        todayDenverKey: "2026-11-18",
        performers: ["Zeds Dead"],
        officialSourceUrl: null,
        ticketUrl: null,
        hasExplicitStartTime: false,
        hasExplicitDoorTime: false,
        bookingHref: null,
        hasOperatorLogisticsSection: false,
        hasHonestTimeLabel: true,
      });
      assert.equal(res.action, "render_200");
      assert.equal(res.index, true);
      assert.equal(res.canonicalPath, protectedPath);
    }
  }
});

test("2. Future Red Rocks show gate enforces all 7 criteria and rejects start-time-only without official source", () => {
  const ev2027Raw = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data/snapshots/events/all-2027.json"), "utf8")
  );
  const events2027 = Array.isArray(ev2027Raw.events) ? ev2027Raw.events : ev2027Raw;
  assert.equal(events2027.length, 43);

  for (const ev of events2027) {
    const res = evaluateFutureRedRocksShowGate({
      id: ev.id,
      title: ev.name,
      venueSlug: ev.venueId,
      dateKey: ev.dateKey,
      todayDenverKey: "2026-11-18",
      performers: ev.artistNames,
      officialSourceUrl: ev.sourceUrl,
      ticketUrl: ev.ticketUrl,
      hasExplicitStartTime: Boolean(ev.startLocal && /T\d{2}:\d{2}/.test(ev.startLocal)),
      hasExplicitDoorTime: Boolean(ev.doorsAt),
      bookingHref: `/book/red-rocks-amphitheatre/private?date=${ev.dateKey}&event=${ev.id}`,
      hasOperatorLogisticsSection: true,
      hasHonestTimeLabel: true,
    });
    assert.equal(res.passesAll, true, `2027 Red Rocks show ${ev.id} failed gate: ${res.failedReasons.join("; ")}`);
  }

  // A start time alone MUST NOT substitute for an official primary source URL
  const missingSourceRes = evaluateShowPageDisposition({
    id: "rr-2027-08-99-unverified-rumor",
    title: "Unverified Show With Start Time Only",
    venueSlug: "red-rocks-amphitheatre",
    dateKey: "2027-08-15",
    todayDenverKey: "2026-11-18",
    performers: ["Example Artist"],
    officialSourceUrl: null,
    ticketUrl: "https://unverified-reseller-blog.example.com/tickets",
    hasExplicitStartTime: true,
    hasExplicitDoorTime: false,
    bookingHref: "/book/red-rocks-amphitheatre/private?date=2027-08-15",
    hasOperatorLogisticsSection: true,
    hasHonestTimeLabel: true,
  });
  assert.equal(missingSourceRes.index, false, "Show without official source URL must be noindex even with start time");
  assert.equal(missingSourceRes.disposition, "incomplete_future_show_noindex");
});

test("3. All 773 /bands/[id] entries map deterministically with zero collisions and zero circular /bands/ links remain", () => {
  const a26 = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/artists/all-2026.json"), "utf8"));
  const a27 = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/artists/all-2027.json"), "utf8"));
  const e26 = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/events/all-2026.json"), "utf8"));
  const e27 = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/events/all-2027.json"), "utf8"));

  const artistsMap = new Map<string, { id: string; name: string }>();
  for (const a of [...(a26.artists || a26), ...(a27.artists || a27)]) {
    if (a?.id && !artistsMap.has(a.id)) artistsMap.set(a.id, a);
  }
  const activeSlugs = new Set<string>();
  for (const e of [...(e26.events || e26), ...(e27.events || e27)]) {
    for (const n of e.artistNames || []) activeSlugs.add(slugify(n));
  }

  const seenSlugOwners = new Map<string, string>();
  let realConsolidatedCount = 0;
  for (const artist of Array.from(artistsMap.values())) {
    const slug = slugify(artist.name);
    assert.equal(seenSlugOwners.has(slug), false, `Collision detected on artist slug ${slug}`);
    seenSlugOwners.set(slug, artist.id);

    const artifact = evaluateParserArtifactSlug(slug);
    if (artifact.isArtifact) {
      if (artifact.action === "redirect_308") {
        assert.ok(artifact.destination.startsWith("/artists/") || artifact.destination.startsWith("/shows/"));
      }
      continue;
    }

    assert.equal(activeSlugs.has(slug), true, `Band ${artist.id} -> /artists/${slug} must resolve to active artist`);
    realConsolidatedCount += 1;
  }
  assert.equal(realConsolidatedCount, 769);

  // Verify zero circular /bands/${...} links remain in app/ or components/
  const checkDirs = [path.join(ROOT, "app"), path.join(ROOT, "components")];
  const circularLinks: string[] = [];
  const walk = (dir: string) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(ent.name)) {
        const src = fs.readFileSync(full, "utf8");
        if (/href=\{`\/bands\/|href="\/bands\//.test(src)) {
          circularLinks.push(path.relative(ROOT, full));
        }
      }
    }
  };
  for (const d of checkDirs) walk(d);
  assert.deepEqual(circularLinks, [], `Circular /bands/[id] links must be removed: ${circularLinks.join(", ")}`);
});

test("4. 1stBank Center preserves truthful closure hub at 200, serves 410 on empty subpages, and is removed from active served venues", () => {
  const hub = evaluateFirstBankCenterPath("/venues/1stbank-center");
  assert.equal(hub.matched, true);
  if (hub.matched) {
    assert.equal(hub.status, 200);
    assert.equal(hub.disposition, "historical_venue_closure_200");
  }

  for (const gonePath of [
    "/venues/1stbank-center/concerts",
    "/venues/1stbank-center/concerts/july",
    "/venues/1stbank-center/parking",
    "/venues/1stbank-center/map",
    "/venues/1stbank-center/transportation",
    "/venues/1stbank-center/best-time-to-arrive",
    "/book/1stbank-center",
  ]) {
    const sub = evaluateFirstBankCenterPath(gonePath);
    assert.equal(sub.matched, true, `${gonePath} must match 1stBank disposition`);
    if (sub.matched) {
      assert.equal(sub.status, 410, `${gonePath} must return 410 Gone`);
    }
  }

  const servedSlugs = getServedVenues().map((v) => v.slug);
  assert.equal(servedSlugs.includes("1stbank-center"), false, "Demolished 1stBank Center must not appear in served venues");
});

test("5. ShowPage source enforces completed past-show lifecycle (no EventCompleted, no past EventScheduled, Service Offer separated from MusicEvent)", () => {
  const showSrc = fs.readFileSync(path.join(ROOT, "app/shows/[id]/page.tsx"), "utf8");
  assert.equal(showSrc.includes("schema.org/EventCompleted"), false, "Must never invent non-existent Schema.org EventCompleted");
  assert.equal(showSrc.includes('"@type": "WebPage"'), true, "Past shows must emit factual WebPage schema");
  assert.equal(showSrc.includes('"@type": "Service"'), true, "Future Red Rocks shows must emit standalone Service + Offer schema");
  assert.equal(showSrc.includes("Book Private Ride for Another 2027 Date"), true, "Past show booking link must clearly indicate another/current 2027 date");
});

test("6. Secondary unserved venues get noindex while served & protected venues remain indexable", () => {
  const blackSheep = evaluateVenuePageDisposition("black-sheep");
  assert.equal(blackSheep.index, false);
  assert.equal(blackSheep.disposition, "thin_unserved_venue_noindex");

  const mission = evaluateVenuePageDisposition("mission-ballroom");
  assert.equal(mission.index, true);
  assert.equal(mission.disposition, "served_venue_preserved");

  const ogdenApril = evaluateVenuePageDisposition("ogden-theatre", "concerts/april");
  assert.equal(ogdenApril.index, true);
  assert.equal(ogdenApril.disposition, "manual_review_protected");
});
