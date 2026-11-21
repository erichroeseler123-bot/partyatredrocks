import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  buildCanonicalRedRocksBookingCatalog,
  buildPreviewQaMultiDateFixture,
  resolveInitialRedRocksShow,
  resolveRedRocksDateSelection,
  searchRedRocksShows,
} from "../lib/shows/redRocksBookingCatalog";
import { GET as getSitemapXml } from "../app/sitemap.xml/route";

const TODAY = "2026-11-18";

test("1. Date -> Show and Artist -> Date resolve to the exact same canonical show record", () => {
  const catalog = buildCanonicalRedRocksBookingCatalog(TODAY);
  assert.ok(catalog.length >= 100, `Expected 101+ verified Red Rocks shows, got ${catalog.length}`);

  const byDate = resolveRedRocksDateSelection("2027-03-25", catalog, TODAY);
  assert.equal(byDate.kind, "single_future_show");
  if (byDate.kind !== "single_future_show") throw new Error("Expected single_future_show");

  const byHeadliner = searchRedRocksShows("Porter Robinson", catalog, 5);
  assert.ok(byHeadliner.length >= 1);
  assert.deepEqual(byHeadliner[0], byDate.show);
  assert.equal(byHeadliner[0].id, "rr-2027-03-25-porter-robinson-b2b-ninajirachi");
  assert.equal(byHeadliner[0].dateKey, "2027-03-25");
  assert.equal(byHeadliner[0].showHref, "/shows/rr-2027-03-25-porter-robinson-b2b-ninajirachi");

  // Support artist search also resolves to the same canonical show record
  const bySupport = searchRedRocksShows("Frost Children", catalog, 5);
  assert.equal(bySupport[0]?.id, byDate.show.id);
});

test("2. Multiple shows on one date returns multiple_shows for traveler disambiguation", () => {
  const catalog = buildCanonicalRedRocksBookingCatalog(
    TODAY,
    buildPreviewQaMultiDateFixture(TODAY)
  );
  const res = resolveRedRocksDateSelection("2027-03-27", catalog, TODAY);
  assert.equal(res.kind, "multiple_shows");
  if (res.kind !== "multiple_shows") throw new Error("Expected multiple_shows");
  assert.equal(res.shows.length, 2);
  assert.equal(res.shows[0].id, "rr-2027-03-27-daytime-session-qa");
  assert.equal(res.shows[1].id, "rr-2027-03-27-sidepiece-x-ship-wrek");

  // Initial URL resolution with both date and artist resolves the matching event
  const preselected = resolveInitialRedRocksShow(
    { dateKey: "2027-03-27", artist: "SIDEPIECE X Ship Wrek" },
    catalog,
    TODAY
  );
  assert.equal(preselected.kind, "single_future_show");
  if (preselected.kind === "single_future_show") {
    assert.equal(preselected.show.id, "rr-2027-03-27-sidepiece-x-ship-wrek");
  }
});

test("3. Past shows lead to historical-show state (past_show / past_unlisted_date), never serviceable availability", () => {
  const catalog = buildCanonicalRedRocksBookingCatalog(TODAY);

  // Known 2026 show via date
  const pastByDate = resolveRedRocksDateSelection("2026-07-03", catalog, TODAY);
  assert.equal(pastByDate.kind, "past_show");
  if (pastByDate.kind === "past_show") {
    assert.equal(pastByDate.show.id, "rr-2026-07-03-deadrocks-xii-zeds-dead");
    assert.equal(pastByDate.show.isPastShow, true);
    assert.equal(pastByDate.show.showHref, "/shows/rr-2026-07-03-deadrocks-xii-zeds-dead");
  }

  // Known 2026 show via artist search
  const zedsResults = searchRedRocksShows("Deadrocks XII", catalog, 5);
  assert.ok(zedsResults.length >= 2);
  assert.ok(zedsResults.every((r) => r.isPastShow));
  assert.ok(zedsResults.some((r) => r.id === "rr-2026-07-03-deadrocks-xii-zeds-dead"));

  // Unlisted past date
  const unlistedPast = resolveRedRocksDateSelection("2026-01-15", catalog, TODAY);
  assert.equal(unlistedPast.kind, "past_unlisted_date");
});

test("4. Unknown / unannounced artist or future date returns honest empty / unannounced_date result", () => {
  const catalog = buildCanonicalRedRocksBookingCatalog(TODAY);

  const noMatchSearch = searchRedRocksShows("Daft Punk Unannounced 2029", catalog, 5);
  assert.equal(noMatchSearch.length, 0);

  const unannouncedDate = resolveRedRocksDateSelection("2027-10-19", catalog, TODAY);
  assert.equal(unannouncedDate.kind, "unannounced_date");
});

test("5. Selector component enforces exact labels, accessible combobox, Change show, and zero new indexable search URLs", async () => {
  const selectorSrc = fs.readFileSync(
    path.join(process.cwd(), "components/booking/ParrShowBookingSelector.tsx"),
    "utf8"
  );
  assert.match(selectorSrc, /What date is your show\?/);
  assert.match(selectorSrc, /Search artist or show/);
  assert.match(selectorSrc, /Change show/);
  assert.match(selectorSrc, /role="combobox"/);
  assert.match(selectorSrc, /role="listbox"/);
  assert.match(selectorSrc, /role="option"/);
  assert.match(selectorSrc, /\/red-rocks\/concerts/);
  assert.doesNotMatch(selectorSrc, /\/search\?/);

  const sitemapRes = await getSitemapXml();
  const xml = await sitemapRes.text();
  assert.doesNotMatch(xml, /\?q=|\?search=|\?artist=|\?date=/, "Sitemap must not contain search or filter query URLs");
});
