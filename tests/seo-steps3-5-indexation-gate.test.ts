import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  MANUAL_REVIEW_PROTECTED_URLS,
  PARR_SERVED_SECONDARY_VENUES,
  evaluateArtistPageDisposition,
  evaluateArtistVenuePageDisposition,
  evaluateBandPageDisposition,
  evaluateFirstBankCenterPath,
  evaluateFutureRedRocksShowGate,
  evaluateHistoricalRedRocksShowQualification,
  evaluateParserArtifactSlug,
  evaluateShowPageDisposition,
  evaluateVenuePageDisposition,
} from "../lib/seo/indexationGate";
import { ACTIVE_PARR_VENUE_SLUGS, getServedVenues } from "../lib/servedVenues";
import { CROSS_SITE_VENUE_MAP } from "../lib/crossSiteMap";

const ROOT = process.cwd();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

test("1. Manual-review protection list (35 URLs) never auto-redirects, canonicalizes elsewhere, or auto-noindexes", () => {
  assert.equal(Object.keys(MANUAL_REVIEW_PROTECTED_URLS).length, 35);
  assert.ok(MANUAL_REVIEW_PROTECTED_URLS["/artists/cole-knight"]);
  assert.ok(MANUAL_REVIEW_PROTECTED_URLS["/shows/rr-2026-05-19-kevin-gates"]);

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
        hasDistinctHistoricalContent: false,
      });
      assert.equal(res.action, "render_200");
      assert.equal(res.index, true);
      assert.equal(res.canonicalPath, protectedPath);
    }
  }
});

test("2. Active-venue count (Gate 1) is reconciled to 15 exact registry venues across servedVenues, indexationGate, and sitemap", () => {
  const registryRaw = JSON.parse(fs.readFileSync(path.join(ROOT, "data/venues.registry.json"), "utf8"));
  const registryArr = Array.isArray(registryRaw) ? registryRaw : registryRaw.venues || Object.values(registryRaw);
  const registrySet = new Set(registryArr.map((v: any) => v.slug));

  assert.equal(ACTIVE_PARR_VENUE_SLUGS.length, 15, "Must have 15 reconciled active PARR venues");
  assert.equal(getServedVenues().length, 15, "getServedVenues() must resolve all 15 active venues in registry");
  assert.equal(PARR_SERVED_SECONDARY_VENUES.size, 14, "Must have 14 secondary served venues + 1 Red Rocks = 15");
  assert.equal(ACTIVE_PARR_VENUE_SLUGS.includes("folsom-field"), false, "Non-registry folsom-field slug must not be in venue list");
  assert.equal(ACTIVE_PARR_VENUE_SLUGS.includes("marquis-theater"), false, "Unserved marquis-theater must not be in active venue list");
  for (const slug of ACTIVE_PARR_VENUE_SLUGS) {
    assert.equal(registrySet.has(slug), true, `Active venue ${slug} must exist in venues.registry.json`);
  }
});

test("3. Future Red Rocks show gate enforces all 7 criteria and Historical Red Rocks gate (Gate 3) requires distinct content", () => {
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

  // Thin single-artist historical stub must NOT be indexed without distinct content
  const thinStubQual = evaluateHistoricalRedRocksShowQualification({
    id: "rr-2026-05-23-fisher",
    title: "FISHER",
    performers: ["FISHER"],
    companionRunShowIds: [],
    verifiedFutureArtistShowIds: [],
    setlistSongCount: 0,
  });
  assert.equal(thinStubQual.qualifiesForIndex, false);
  const thinStubDec = evaluateShowPageDisposition({
    id: "rr-2026-05-23-fisher",
    title: "FISHER",
    venueSlug: "red-rocks-amphitheatre",
    dateKey: "2026-05-23",
    todayDenverKey: "2026-11-18",
    performers: ["FISHER"],
    hasExplicitStartTime: true,
    hasExplicitDoorTime: false,
    hasOperatorLogisticsSection: false,
    hasHonestTimeLabel: true,
    hasDistinctHistoricalContent: thinStubQual.qualifiesForIndex,
  });
  assert.equal(thinStubDec.index, false, "Thin historical Red Rocks stub must be held at noindex, follow");
  assert.equal(thinStubDec.disposition, "thin_historical_red_rocks_show_noindex");

  // Multi-artist / multi-night historical show DOES qualify
  const richQual = evaluateHistoricalRedRocksShowQualification({
    id: "rr-2026-04-17-sublime",
    title: "Sublime",
    performers: ["Sublime", "Common Kings", "Bumpin Uglies"],
    companionRunShowIds: ["rr-2026-04-18-sublime"],
    verifiedFutureArtistShowIds: ["rr-2027-04-17-sublime"],
  });
  assert.equal(richQual.qualifiesForIndex, true);
});

test("4. Gate 4: Zero 308 redirects terminate on noindex or non-200 pages, and zero circular /bands/ links remain", () => {
  const a26 = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/artists/all-2026.json"), "utf8"));
  const a27 = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/artists/all-2027.json"), "utf8"));
  const e26 = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/events/all-2026.json"), "utf8"));
  const e27 = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/events/all-2027.json"), "utf8"));
  const allEvents = [...(e26.events || e26), ...(e27.events || e27)];

  const artistsMap = new Map<string, { id: string; name: string }>();
  for (const a of [...(a26.artists || a26), ...(a27.artists || a27)]) {
    if (a?.id && !artistsMap.has(a.id)) artistsMap.set(a.id, a);
  }

  let band308Count = 0;
  let bandNoindex200Count = 0;
  for (const artist of Array.from(artistsMap.values())) {
    const slug = slugify(artist.name);
    const matches = allEvents.filter((ev: any) => (ev.artistNames || []).some((n: string) => slugify(n) === slug));
    const upcomingRR = matches.filter((ev: any) => ev.dateKey >= "2026-11-18" && ev.venueId === "red-rocks-amphitheatre").length;
    const pastRR = matches.filter((ev: any) => ev.dateKey < "2026-11-18" && ev.venueId === "red-rocks-amphitheatre").length;

    const bandDec = evaluateBandPageDisposition({
      bandId: artist.id,
      artistSlug: slug,
      upcomingRedRocksCount: upcomingRR,
      historicalRedRocksCount: pastRR,
      upcomingServedSecondaryCount: 0,
    });

    if (bandDec.action === "redirect_308") {
      band308Count += 1;
      const dest = bandDec.redirectDestination || "";
      if (dest.startsWith("/artists/")) {
        const destSlug = dest.slice("/artists/".length);
        const destMatches = allEvents.filter((ev: any) => (ev.artistNames || []).some((n: string) => slugify(n) === destSlug));
        const destUpRR = destMatches.filter((ev: any) => ev.dateKey >= "2026-11-18" && ev.venueId === "red-rocks-amphitheatre").length;
        const destPastRR = destMatches.filter((ev: any) => ev.dateKey < "2026-11-18" && ev.venueId === "red-rocks-amphitheatre").length;
        const destArtistDec = evaluateArtistPageDisposition({
          artistSlug: destSlug,
          upcomingRedRocksCount: destUpRR,
          historicalRedRocksCount: destPastRR,
          upcomingServedSecondaryCount: 0,
        });
        assert.equal(destArtistDec.action, "render_200", `Redirect target ${dest} must be HTTP 200`);
        assert.equal(destArtistDec.index, true, `Redirect target ${dest} must NOT be noindex`);
      }
    } else if (bandDec.action === "render_200") {
      assert.equal(bandDec.index, false);
      bandNoindex200Count += 1;
    }
  }
  assert.ok(band308Count > 200);
  assert.ok(bandNoindex200Count > 500);
});

test("5. Gate 5: 1stBank Center 410 URLs are absent from active venues, crossSiteMap, and internal navigation", () => {
  const hub = evaluateFirstBankCenterPath("/venues/1stbank-center");
  assert.equal(hub.matched, true);
  if (hub.matched) {
    assert.equal(hub.status, 200);
  }

  assert.equal("1stbank-center" in CROSS_SITE_VENUE_MAP, false, "1stbank-center must not be in CROSS_SITE_VENUE_MAP");
  const servedSlugs = getServedVenues().map((v) => v.slug);
  assert.equal(servedSlugs.includes("1stbank-center"), false, "Demolished 1stBank Center must not appear in served venues");

  const showSrc = fs.readFileSync(path.join(ROOT, "app/shows/[id]/page.tsx"), "utf8");
  assert.equal(showSrc.includes("schema.org/EventCompleted"), false);
  assert.equal(showSrc.includes('"@type": "WebPage"'), true);
  assert.equal(showSrc.includes('"@type": "Service"'), true);
  assert.equal(showSrc.includes('data-testid="historical-red-rocks-archive"'), true);
});
