import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";
import { GET as getRobotsTxt } from "../app/robots.txt/route";
import { GET as getSitemapXml } from "../app/sitemap.xml/route";
import { GET as getAgentJson } from "../app/agent.json/route";
import { GET as getLlmsTxt } from "../app/llms.txt/route";
import {
  COLLAPSED_SINGLE_HOP_REDIRECTS,
  HISTORICAL_404_SUCCESSOR_REDIRECTS,
} from "../lib/legacyRedirects";
import { SUBURBAN_2027_USD, VAN_2027_USD } from "../lib/pricing";

const ROOT = process.cwd();

function readText(relPath: string): string {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

function walkJsonFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJsonFiles(full));
    else if (entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

test("Phase 2 Decision #1: collapsed single-hop 308 redirects & /find query/attribution preservation", () => {
  assert.deepEqual(COLLAPSED_SINGLE_HOP_REDIRECTS, {
    "/party-bus-to-red-rocks": { pathname: "/red-rocks/group-transportation" },
    "/sprinter": { pathname: "/book/red-rocks-amphitheatre/private", hash: "van-upgrade" },
  });

  const partyBusRes = middleware(new NextRequest("https://www.partyatredrocks.com/party-bus-to-red-rocks"));
  assert.equal(partyBusRes.status, 308);
  assert.equal(
    partyBusRes.headers.get("location"),
    "https://www.partyatredrocks.com/red-rocks/group-transportation"
  );

  const sprinterRes = middleware(new NextRequest("https://www.partyatredrocks.com/sprinter"));
  assert.equal(sprinterRes.status, 308);
  assert.equal(
    sprinterRes.headers.get("location"),
    "https://www.partyatredrocks.com/book/red-rocks-amphitheatre/private#van-upgrade"
  );

  const findPlainRes = middleware(new NextRequest("https://www.partyatredrocks.com/find"));
  assert.equal(findPlainRes.status, 308);
  assert.equal(
    findPlainRes.headers.get("location"),
    "https://www.partyatredrocks.com/book/red-rocks-amphitheatre/private"
  );

  const findAttributedRes = middleware(
    new NextRequest(
      "https://www.partyatredrocks.com/find?venue=red-rocks-amphitheatre&date=2027-05-12&artist=Queens+of+the+Stone+Age&utm_source=dcc&utm_campaign=rr2027&dcc_handoff_id=ho_777&ref=aff_01"
    )
  );
  assert.equal(findAttributedRes.status, 308);
  const loc = new URL(findAttributedRes.headers.get("location")!);
  assert.equal(loc.pathname, "/book/red-rocks-amphitheatre/private");
  assert.equal(loc.searchParams.get("date"), "2027-05-12");
  assert.equal(loc.searchParams.get("artist"), "Queens of the Stone Age");
  assert.equal(loc.searchParams.get("utm_source"), "dcc");
  assert.equal(loc.searchParams.get("utm_campaign"), "rr2027");
  assert.equal(loc.searchParams.get("dcc_handoff_id"), "ho_777");
  assert.equal(loc.searchParams.get("ref"), "aff_01");

  // Visible #van-upgrade and #suv-booking anchors exist on /book/[venue]/private
  const privatePage = readText("app/book/[venue]/private/page.tsx");
  assert.match(privatePage, /id="suv-booking"/);
  assert.match(privatePage, /id="van-upgrade"/);
  assert.match(privatePage, /VAN_ALL_IN_TOTAL_LABEL/);
});

test("Phase 2 Decision #2: all 11 historical 404 routes 308-redirect in 1 hop to exact topical successors (zero homepage catch-alls)", () => {
  const expected: Record<string, string> = {
    "/red-rocks-schedule": "/red-rocks/concerts",
    "/transportation-services": "/red-rocks/shuttle",
    "/red-rocks-shuttle": "/red-rocks/shuttle",
    "/shared-shuttle": "/red-rocks/shuttle",
    "/private-shuttle": "/book/red-rocks-amphitheatre/private",
    "/denver-marriott-west": "/guide/local/denver-pickups",
    "/guide/local/denver-pickup-locations": "/guide/local/denver-pickups",
    "/guide/tailgate": "/guide/tailgating",
    "/rain": "/red-rocks/weather",
    "/venues/fiddlers-green": "/venues/fiddlers-green-amphitheatre",
    "/venues/mishawaka": "/venues/mishawaka-amphitheatre",
  };

  assert.equal(Object.keys(HISTORICAL_404_SUCCESSOR_REDIRECTS).length, 11);

  for (const [oldPath, targetPath] of Object.entries(expected)) {
    assert.notEqual(targetPath, "/", `${oldPath} must never catch-all redirect to homepage`);
    const res = middleware(new NextRequest(`https://www.partyatredrocks.com${oldPath}`));
    assert.equal(res.status, 308, `Expected 308 for ${oldPath}`);
    assert.equal(
      res.headers.get("location"),
      `https://www.partyatredrocks.com${targetPath}`,
      `Unexpected destination for ${oldPath}`
    );
    // Confirm destination itself does not re-trigger middleware redirect (1-hop guarantee)
    const destRes = middleware(new NextRequest(`https://www.partyatredrocks.com${targetPath}`));
    assert.equal(destRes.status, 200, `Destination ${targetPath} must not chain into another middleware redirect`);
  }
});

test("Phase 2 Decision #3 & Canonical Hygiene: indexable hubs, protected noindex tools, root layout canonical fix, and www canonicals", async () => {
  // Root layout must NOT leak alternates: { canonical: "/" }
  const rootLayout = readText("app/layout.tsx");
  assert.doesNotMatch(rootLayout, /canonical:\s*["']\/["']/);

  // Newly indexable hubs
  for (const hubFile of [
    "app/red-rocks/page.tsx",
    "app/guide/page.tsx",
    "app/venues/page.tsx",
    "app/red-rocks/concerts/page.tsx",
  ]) {
    const src = readText(hubFile);
    assert.match(src, /index:\s*true/, `${hubFile} must be index: true`);
    assert.match(src, /follow:\s*true/, `${hubFile} must be follow: true`);
    assert.match(src, /canonical:/, `${hubFile} must define explicit self-canonical`);
  }

  // Stale 2026 promo removed from /red-rocks and /guide
  assert.doesNotMatch(readText("app/red-rocks/page.tsx"), /Phish at Folsom Field 2026/);
  assert.doesNotMatch(readText("app/guide/page.tsx"), /2026-season-preview/);
  assert.doesNotMatch(readText("app/guide/page.tsx"), /custom\/shared/);

  // Homepage & primary nav point to /red-rocks/concerts, never /schedule or /week/red-rocks
  const homeSections = readText("components/home/HomeSections.tsx");
  assert.match(homeSections, /\/red-rocks\/concerts/);
  assert.doesNotMatch(homeSections, /href="\/schedule"/);
  assert.doesNotMatch(homeSections, /href="\/week\/red-rocks"/);

  // Protected noindex utility pages stay live on disk and index: false
  for (const noindexFile of [
    "app/schedule/page.tsx",
    "app/week/red-rocks/page.tsx",
    "app/bands/page.tsx",
    "app/scenes/page.tsx",
    "app/other-venues/page.tsx",
    "app/red-rocks-live/page.tsx",
  ]) {
    const src = readText(noindexFile);
    assert.match(src, /index:\s*false/, `${noindexFile} must remain noindex`);
  }

  // Dynamic shows and scenes use https://www.partyatredrocks.com
  assert.doesNotMatch(readText("app/shows/[id]/page.tsx"), /"https:\/\/partyatredrocks\.com"/);
  assert.doesNotMatch(readText("app/scene/[scene]/page.tsx"), /"https:\/\/partyatredrocks\.com"/);

  // Sitemap includes newly indexable hubs & 2027 shows, and excludes noindex pages & redirects
  const sitemapRes = await getSitemapXml();
  const sitemapXml = await sitemapRes.text();
  for (const mustInclude of [
    "https://www.partyatredrocks.com/",
    "https://www.partyatredrocks.com/red-rocks",
    "https://www.partyatredrocks.com/guide",
    "https://www.partyatredrocks.com/venues",
    "https://www.partyatredrocks.com/red-rocks/concerts",
    "https://www.partyatredrocks.com/book/red-rocks-amphitheatre/private",
    "https://www.partyatredrocks.com/book/red-rocks-amphitheatre/private/suv",
    "https://www.partyatredrocks.com/book/red-rocks-amphitheatre/private/van",
    "https://www.partyatredrocks.com/red-rocks/what-to-wear",
    "https://www.partyatredrocks.com/shows/rr-2027-03-25-porter-robinson-b2b-ninajirachi",
  ]) {
    assert.ok(sitemapXml.includes(`<loc>${mustInclude}</loc>`), `Sitemap missing ${mustInclude}`);
  }
  for (const mustExclude of [
    "<loc>https://www.partyatredrocks.com/schedule</loc>",
    "<loc>https://www.partyatredrocks.com/week/red-rocks</loc>",
    "<loc>https://www.partyatredrocks.com/bands</loc>",
    "<loc>https://www.partyatredrocks.com/scenes</loc>",
    "<loc>https://www.partyatredrocks.com/other-venues</loc>",
    "<loc>https://www.partyatredrocks.com/red-rocks-live</loc>",
    "<loc>https://www.partyatredrocks.com/book/red-rocks-amphitheatre</loc>",
    "<loc>https://www.partyatredrocks.com/find</loc>",
  ]) {
    assert.equal(sitemapXml.includes(mustExclude), false, `Sitemap must exclude ${mustExclude}`);
  }
});

test("Phase 2 Preview Non-Indexability: VERCEL_ENV=preview enforces X-Robots-Tag and Disallow: /", async () => {
  const prevEnv = process.env.VERCEL_ENV;
  try {
    process.env.VERCEL_ENV = "preview";
    const mwRes = middleware(new NextRequest("https://preview.partyatredrocks.vercel.app/"));
    assert.equal(mwRes.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");

    const robotsRes = await getRobotsTxt();
    const robotsBody = await robotsRes.text();
    assert.match(robotsBody, /Disallow:\s*\/\s*$/m);
    assert.equal(robotsRes.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");

    process.env.VERCEL_ENV = "production";
    const prodRobotsRes = await getRobotsTxt();
    const prodRobotsBody = await prodRobotsRes.text();
    assert.match(prodRobotsBody, /Allow:\s*\//);
    assert.equal(prodRobotsRes.headers.get("x-robots-tag"), null);
  } finally {
    if (prevEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = prevEnv;
  }
});

test("Phase 2 Decision #4 & #5: full-site $499/$699 pricing consistency, FAQ/manifest/email sync, Rezdy IDs & 2026 preservation", async () => {
  assert.equal(SUBURBAN_2027_USD, 499);
  assert.equal(VAN_2027_USD, 699);

  // Check all FAQ JSON files contain zero $399, $599, or $59 shared shuttle rates
  for (const faqFile of walkJsonFiles(path.join(ROOT, "data/faqs"))) {
    const raw = fs.readFileSync(faqFile, "utf8");
    const rel = path.relative(ROOT, faqFile).replace(/\\/g, "/");
    assert.doesNotMatch(raw, /\$(399|599|59(?!9))\b/, `Stale price in ${rel}`);
  }

  // Check machine manifests (/agent.json, /llms.txt, public-route-inventory.v1.json, _authority_spec.json)
  const agentBody = await (await getAgentJson()).json();
  assert.equal(agentBody.public_claims.suburban_usd, 518.96);
  assert.equal(agentBody.public_claims.suburban_base_usd, 499);
  assert.equal(agentBody.public_claims.suburban_booking_fee_usd, 19.96);
  assert.equal(agentBody.public_claims.van_usd, 726.96);
  assert.equal(agentBody.public_claims.van_base_usd, 699);
  assert.equal(agentBody.public_claims.van_booking_fee_usd, 27.96);
  assert.equal(agentBody.public_claims.shared_seat_service, false);

  const llmsText = await (await getLlmsTxt()).text();
  assert.match(llmsText, /\$518\.96 total \(\$499\.00 base \+ \$19\.96 Booking fee \(4%\)\)/);
  assert.match(llmsText, /\$726\.96 total \(\$699\.00 base \+ \$27\.96 Booking fee \(4%\)\)/);

  const routeInv = JSON.parse(readText("data/governance/public-route-inventory.v1.json"));
  assert.equal(routeInv.serviceAndVehicleCatalog.privateRideOptions[0].priceUsd, 518.96);
  assert.equal(routeInv.serviceAndVehicleCatalog.privateRideOptions[0].basePriceUsd, 499);
  assert.equal(routeInv.serviceAndVehicleCatalog.privateRideOptions[0].bookingFeeUsd, 19.96);
  assert.equal(routeInv.serviceAndVehicleCatalog.privateRideOptions[1].priceUsd, 726.96);
  assert.equal(routeInv.serviceAndVehicleCatalog.privateRideOptions[1].basePriceUsd, 699);
  assert.equal(routeInv.serviceAndVehicleCatalog.privateRideOptions[1].bookingFeeUsd, 27.96);
  assert.equal(routeInv.bookingActions[0].publicPriceUsd, 518.96);
  assert.equal(routeInv.bookingActions[1].publicPriceUsd, 726.96);

  const authSpec = readText("_authority_spec.json");
  assert.doesNotMatch(authSpec, /59\/pp/);
  assert.match(authSpec, /\$518\.96 Suburban \/ \$726\.96 Van Total/);

  const emailConfirm = readText("lib/sharedConfirmation.ts");
  assert.doesNotMatch(emailConfirm, /2026 Red Rocks bag/);

  // All 5 historical 2026 routes exist and export explicit self-canonicals + 2026 archive context
  for (const page2026 of [
    "app/red-rocks/transportation/shuttle-vs-uber-2026/page.tsx",
    "app/2026/red-rocks-concerts/page.tsx",
    "app/guide/events/2026-season-preview/page.tsx",
    "app/guide/logistics/prohibited-items-2026/page.tsx",
    "app/guide/logistics/shuttle-vs-westracks-2026/page.tsx",
  ]) {
    const src = readText(page2026);
    assert.match(src, /canonical:/, `${page2026} must export self-canonical`);
    assert.match(src, /2026/, `${page2026} must preserve 2026 historical labeling`);
  }

  // All 3 Rezdy product IDs preserved (596193, 630812, 541037)
  const optionPage = readText("app/book/[venue]/private/[option]/page.tsx");
  assert.match(optionPage, /596193/);
  assert.match(optionPage, /630812/);
  const bookingPage = readText("app/booking/page.tsx");
  assert.match(bookingPage, /BookingOrderLookup/);
  assert.match(bookingPage, /\/book\/red-rocks-amphitheatre\/private\/suv/);
  assert.match(bookingPage, /\/book\/red-rocks-amphitheatre\/private\/van/);
  assert.doesNotMatch(bookingPage, /catalog\/541037/);
});

test("Phase 2.1 #5: Next.js configuration authority — next.config.js is authoritative and next.config.ts delegates identically", async () => {
  // Verify Next.js internal CONFIG_FILES precedence resolves next.config.js first
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { CONFIG_FILES } = require("next/dist/shared/lib/constants");
  assert.equal(CONFIG_FILES[0], "next.config.js");

  // Confirm next.config.js on disk directly exports ./lib/nextConfigShared.js
  assert.match(readText("next.config.js"), /module\.exports\s*=\s*require\(["']\.\/lib\/nextConfigShared\.js["']\)/);
  assert.match(readText("next.config.ts"), /require\(["']\.\/lib\/nextConfigShared\.js["']\)/);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sharedConfig = require("../lib/nextConfigShared.js");
  const configTsMod = (await import("../next.config")) as { default?: { default?: unknown } & Record<string, unknown> };
  const configTs = configTsMod.default?.redirects ? configTsMod.default : configTsMod.default?.default;

  // Both entrypoints reference the exact same authoritative configuration object
  assert.equal(configTs, sharedConfig, "next.config.ts must delegate to the exact same sharedConfig as next.config.js");

  // Verify metadata/bot streaming behavior (htmlLimitedBots) & inlineCss come from authoritative config
  assert.ok(sharedConfig.htmlLimitedBots instanceof RegExp, "htmlLimitedBots must be configured as a RegExp");
  assert.equal(sharedConfig.htmlLimitedBots.test("Mozilla/5.0 HeadlessChrome/131.0"), true);
  assert.equal(sharedConfig.htmlLimitedBots.test("Mozilla/5.0 (compatible; Googlebot/2.1)"), true);
  assert.equal(sharedConfig.experimental?.inlineCss, true);
  assert.deepEqual(sharedConfig.transpilePackages, ["react-map-gl", "mapbox-gl"]);

  // Verify redirects come from authoritative config
  const redirects = await sharedConfig.redirects();
  const redirectMap = new Map(redirects.map((r: { source: string; destination: string }) => [r.source, r.destination]));
  assert.equal(redirectMap.get("/party-bus-to-red-rocks"), "/red-rocks/group-transportation");
  for (const [oldPath, target] of Object.entries(HISTORICAL_404_SUCCESSOR_REDIRECTS)) {
    assert.equal(redirectMap.get(oldPath), target.pathname, `authoritative config missing redirect for ${oldPath}`);
  }
});

test("Phase 2.1 #4 & #6: representative vehicle disclosure and /artists/zeds-dead 404 + branded not-found links", async () => {
  // Representative vehicle disclosure present across all vehicle photo surfaces
  for (const vehicleSurface of [
    "components/home/HomeSections.tsx",
    "app/book/[venue]/private/page.tsx",
    "app/book/[venue]/private/[option]/page.tsx",
    "app/guide/compare/page.tsx",
    "app/red-rocks/shuttle/page.tsx",
    "app/guide/parking/page.tsx",
    "app/guide/tailgating/page.tsx",
  ]) {
    const src = readText(vehicleSurface);
    assert.match(
      src,
      /Representative vehicle; exact vehicle may vary\./,
      `${vehicleSurface} must include discreet representative vehicle disclosure`
    );
  }
  assert.match(readText("components/booking/BookingVisualHero.tsx"), /imageNote/);

  // /artists/zeds-dead must NOT redirect in middleware or next.config.js (must stay 404 until official 2027 date exists)
  const zedsMwRes = middleware(new NextRequest("https://www.partyatredrocks.com/artists/zeds-dead"));
  assert.equal(zedsMwRes.status, 200, "middleware must pass /artists/zeds-dead through to route handler (404), never redirect");
  assert.equal(zedsMwRes.headers.get("location"), null);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sharedConfig = require("../lib/nextConfigShared.js");
  const redirects = await sharedConfig.redirects();
  assert.equal(
    redirects.some((r: { source: string }) => r.source.includes("zeds-dead")),
    false,
    "next.config.js must not redirect /artists/zeds-dead"
  );

  // Branded 404 offers links to /red-rocks/concerts and /search
  const notFoundSrc = readText("app/not-found.tsx");
  assert.match(notFoundSrc, /href="\/red-rocks\/concerts"/);
  assert.match(notFoundSrc, /href="\/search"/);
  assert.match(notFoundSrc, /index:\s*false/);
});
