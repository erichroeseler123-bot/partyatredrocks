import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import Module from "node:module";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";

// Under Node 24 + tsx CJS loader, libphonenumber-js require('../metadata.min.json')
// receives { default: { countries, ... } } instead of plain JSON as in Next.js bundler.
const origModuleLoad = (Module as unknown as { _load: (...args: unknown[]) => unknown })._load;
(Module as unknown as { _load: (...args: unknown[]) => unknown })._load = function patchedJsonLoad(
  request: unknown,
  parent: unknown,
  isMain: unknown,
) {
  const loaded = origModuleLoad.call(this, request, parent, isMain) as Record<string, unknown>;
  if (
    typeof request === "string" &&
    request.endsWith("metadata.min.json") &&
    loaded &&
    typeof loaded === "object" &&
    !("countries" in loaded) &&
    loaded.default &&
    typeof loaded.default === "object"
  ) {
    return loaded.default;
  }
  return loaded;
};

import {
  PRIVATE_RIDE_OPTIONS,
  PUBLIC_PRIVATE_RIDE_OPTIONS,
  getPrivateRideOption,
  isPublicPrivateRideSlug,
} from "@/lib/rideCatalog";
import { SHUTTLE_PRICING } from "@/lib/pricing";
import { PARR_PUBLIC_FACTS, getParrPickupFacts } from "@/lib/publicOperatorFacts";
import { assignPrivateInventory } from "@/lib/parr/fleet";
import {
  getEventsCatalog,
  getUpcomingEventsCatalog,
  selectUpcomingEvents,
} from "@/lib/events/getCatalog";
import { resolveBookingShowContext } from "@/lib/bookingContext";
import { buildBookingHref } from "@/lib/parrHandoff";
import { getDccReturnHref, postDccSatelliteEvent } from "@/lib/dccSatellite";
import { GET as getHandoffReturnRoute } from "@/app/handoff/return/route";
import {
  getInternalOrderByAnyReference,
  getInternalOrderById,
  saveInternalOrder,
} from "@/lib/orders";
import { getWeather, getRedRocks7DayForecast } from "@/lib/weather";
import { getRedRocksIntelligence } from "@/lib/red-rocks-intelligence";
import { GET as getDccSiteManifest } from "@/app/.well-known/dcc-site/route";
import { GET as getHealthRoute } from "@/app/api/health/route";
import { GET as getRedRocksEventsRoute } from "@/app/api/red-rocks-events/route";
import { GET as getRedRocksIntelligenceRoute } from "@/app/api/red-rocks-intelligence/route";
import { GET as getSharedInventoryRoute } from "@/app/api/shared/inventory/route";
import {
  PATCH as patchBookingNotesRoute,
  POST as postBookingNotesRoute,
} from "@/app/api/booking/[token]/notes/route";
import { lookupVerifiedBooking } from "@/lib/bookingLookup";
import { middleware } from "@/middleware";

const REPO_ROOT = process.cwd();
const INVENTORY_PATH = path.join(
  REPO_ROOT,
  "data",
  "governance",
  "public-route-inventory.v1.json",
);

type RouteEntry = {
  routePattern: string;
  filePath: string;
  category?: string;
  dynamic?: boolean;
  methods?: string[];
};

type PublicRouteInventory = {
  schema: string;
  version: string;
  siteId: string;
  canonicalOrigin: string;
  summary: {
    totalAppRouteAndPageFiles: number;
    publicPagesCount: number;
    publicPagesByCategory: Record<string, number>;
    machineAndHandoffRoutesCount: number;
    bookingAndCheckoutApiRoutesCount: number;
    publicDataAndSupportApiRoutesCount: number;
    excludedInternalAndAdminRoutesCount: number;
    bookingActionsCount: number;
    registeredVenuesCount: number;
    vehicleClassesDefinedCount: number;
    vehicleClassesPublicSelfServeCount: number;
    vercelEdgeRedirectsCount: number;
  };
  configuredRedirects: {
    vercelJson: Array<{ source: string; destination: string; permanent?: boolean }>;
    nextConfigTs: Array<{ source: string; destination: string; permanent?: boolean }>;
    nextConfigJs: Array<{ source: string; destination: string; permanent?: boolean }>;
  };
  bookingActions: Array<{
    actionId: string;
    surface: string;
    filePath: string;
    status: string;
  }>;
  publicPages: RouteEntry[];
  machineAndHandoffRoutes: RouteEntry[];
  bookingAndCheckoutApiRoutes: RouteEntry[];
  publicDataAndSupportApiRoutes: RouteEntry[];
  excludedInternalAndAdminRoutes: RouteEntry[];
};

function walkAppRoutes(dir: string): string[] {
  const found: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...walkAppRoutes(full));
    } else if (entry.name === "page.tsx" || entry.name === "route.ts") {
      found.push(path.relative(REPO_ROOT, full).replace(/\\/g, "/"));
    }
  }
  return found.sort();
}

function matchesRoutePattern(pathname: string, routePattern: string): boolean {
  if (pathname === routePattern) return true;
  const patternParts = routePattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);

  for (let i = 0; i < patternParts.length; i += 1) {
    const seg = patternParts[i];
    if (seg.startsWith("[[...") && seg.endsWith("]]")) {
      return true;
    }
    if (seg.startsWith("[...") && seg.endsWith("]")) {
      return pathParts.length > i;
    }
    if (seg.startsWith("[") && seg.endsWith("]")) {
      if (!pathParts[i]) return false;
      continue;
    }
    if (pathParts[i] !== seg) return false;
  }

  return patternParts.length === pathParts.length;
}

test("1. No-Deletion & URL Preservation: every baselined public page, venue/service/event/guide route, customer order route, and booking API exists with zero destructive redirects", async () => {
  assert.equal(
    fs.existsSync(INVENTORY_PATH),
    true,
    "data/governance/public-route-inventory.v1.json must exist",
  );

  const inventory = JSON.parse(
    fs.readFileSync(INVENTORY_PATH, "utf8"),
  ) as PublicRouteInventory;

  assert.equal(inventory.schema, "parr.public-route-inventory.v1");
  assert.equal(inventory.siteId, "partyatredrocks");
  assert.equal(inventory.canonicalOrigin, "https://www.partyatredrocks.com");

  const allInventoriedFiles = [
    ...inventory.publicPages.map((r) => r.filePath),
    ...inventory.machineAndHandoffRoutes.map((r) => r.filePath),
    ...inventory.bookingAndCheckoutApiRoutes.map((r) => r.filePath),
    ...inventory.publicDataAndSupportApiRoutes.map((r) => r.filePath),
    ...inventory.excludedInternalAndAdminRoutes.map((r) => r.filePath),
  ].sort();

  const liveAppFiles = walkAppRoutes(path.join(REPO_ROOT, "app"));
  assert.deepEqual(
    allInventoriedFiles,
    liveAppFiles,
    "Inventory must match 100% of live app/**/page.tsx and app/**/route.ts files with zero missing public routes",
  );

  assert.equal(inventory.publicPages.length, inventory.summary.publicPagesCount);
  assert.ok(inventory.publicPages.length >= 190, "Public page baseline must remain intact");

  for (const entry of [
    ...inventory.publicPages,
    ...inventory.machineAndHandoffRoutes,
    ...inventory.bookingAndCheckoutApiRoutes,
    ...inventory.publicDataAndSupportApiRoutes,
  ]) {
    const abs = path.join(REPO_ROOT, entry.filePath);
    assert.equal(
      fs.existsSync(abs),
      true,
      `Baselined route file missing on disk: ${entry.filePath} (${entry.routePattern})`,
    );
  }

  for (const action of inventory.bookingActions) {
    const abs = path.join(REPO_ROOT, action.filePath);
    assert.equal(
      fs.existsSync(abs),
      true,
      `Booking action file missing on disk: ${action.actionId} -> ${action.filePath}`,
    );
  }

  // Verify core standalone PARR public URLs are present in publicPages
  const publicPatterns = new Set(inventory.publicPages.map((p) => p.routePattern));
  const mandatoryPublicRoutes = [
    "/",
    "/red-rocks/shuttle",
    "/red-rocks/transportation",
    "/shuttles",
    "/private-suburban",
    "/private-van",
    "/party-bus",
    "/mishawaka",
    "/other-venues",
    "/venues",
    "/venues/red-rocks-amphitheatre",
    "/venues/[slug]",
    "/schedule",
    "/red-rocks/concerts",
    "/shows/[id]",
    "/guide",
    "/gallery",
    "/book",
    "/book/[venue]",
    "/book/[venue]/private",
    "/book/[venue]/private/[option]",
    "/book-all-venue",
    "/booking",
    "/booking/[token]",
    "/pay-balance/[token]",
    "/contact",
  ];
  for (const requiredRoute of mandatoryPublicRoutes) {
    assert.equal(
      publicPatterns.has(requiredRoute),
      true,
      `Mandatory public PARR route missing from inventory: ${requiredRoute}`,
    );
  }

  // Inspect vercel.json, next.config.ts, and next.config.js for zero destructive/external redirects
  const vercelRaw = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, "vercel.json"), "utf8"),
  ) as { redirects?: Array<{ source: string; destination: string }> };

  // Load next.config.js and next.config.ts redirects directly
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nextConfigJs = require(path.join(REPO_ROOT, "next.config.js"));
  const nextConfigTsMod = await import("../next.config");
  const nextConfigTs = nextConfigTsMod.default;

  const jsRedirects: Array<{ source: string; destination: string }> =
    typeof nextConfigJs.redirects === "function" ? await nextConfigJs.redirects() : [];
  const tsRedirects: Array<{ source: string; destination: string }> =
    typeof nextConfigTs.redirects === "function" ? await nextConfigTs.redirects() : [];
  const vercelRedirects = vercelRaw.redirects ?? [];

  const allPublicPatterns = Array.from(publicPatterns);
  for (const redirectRule of [...vercelRedirects, ...jsRedirects, ...tsRedirects]) {
    assert.equal(
      redirectRule.destination.startsWith("/"),
      true,
      `Redirect destination must remain on PARR internal routes, never external: ${redirectRule.source} -> ${redirectRule.destination}`,
    );
    assert.equal(
      redirectRule.destination.includes("destinationcommandcenter.com") ||
        redirectRule.destination.includes("cruisepromenade.com"),
      false,
      `PARR public URLs must never redirect away to DCC or Cruise Promenade: ${redirectRule.destination}`,
    );
    const resolvesToPage = allPublicPatterns.some((pattern) =>
      matchesRoutePattern(redirectRule.destination, pattern),
    );
    assert.equal(
      resolvesToPage,
      true,
      `Redirect destination ${redirectRule.destination} (from ${redirectRule.source}) must resolve to a real public PARR page`,
    );
  }
});

test("2. Continuous Standalone Bookability & Truthful Unannounced-Season Framing: services, vehicle classes, pricing, customer order lookup, and 2027 framing pass", async (t) => {
  // Vehicle classes & pricing catalog
  assert.equal(PRIVATE_RIDE_OPTIONS.length, 4);
  assert.deepEqual(
    PRIVATE_RIDE_OPTIONS.map((o) => ({
      slug: o.slug,
      priceLabel: o.priceLabel,
      eyebrow: o.eyebrow,
      dccProduct: o.dccProduct,
    })),
    [
      { slug: "suv", priceLabel: "$399", eyebrow: "$399 • Up to 6 guests", dccProduct: "parr-suburban" },
      { slug: "van", priceLabel: "$599", eyebrow: "$599 • Up to 10 Guests", dccProduct: "parr-van-10" },
      { slug: "sprinter", priceLabel: "$799", eyebrow: "$799 • Up to 14 Guests", dccProduct: "parr-sprinter-14" },
      { slug: "party-bus", priceLabel: "$1199", eyebrow: "$1199 • Up to 24 Guests", dccProduct: "parr-party-bus-24" },
    ],
  );

  assert.deepEqual(
    PUBLIC_PRIVATE_RIDE_OPTIONS.map((o) => o.slug),
    ["suv", "van"],
  );
  assert.equal(PUBLIC_PRIVATE_RIDE_OPTIONS.length, 2);
  assert.equal(isPublicPrivateRideSlug("suv"), true);
  assert.equal(isPublicPrivateRideSlug("van"), true);
  assert.equal(getPrivateRideOption("sprinter")?.priceLabel, "$799");

  assert.equal(SHUTTLE_PRICING.redRocks.suburban, "$399 round-trip");
  assert.equal(SHUTTLE_PRICING.redRocks.van10, "$599 round-trip");
  assert.equal(SHUTTLE_PRICING.mishawaka.privateSuburban, "$599 round-trip");
  assert.match(SHUTTLE_PRICING.denverBoulderOtherVenues.suburban, /\$250/);

  // Operator support & pickup hub facts
  assert.equal(PARR_PUBLIC_FACTS.support.phoneE164, "+17203696292");
  assert.equal(getParrPickupFacts("denver").shortLabel, "Sheraton Denver Downtown");
  assert.equal(getParrPickupFacts("golden").shortLabel, "Trailhead Taphouse");
  assert.equal(getParrPickupFacts("Denver Marriott West").cityLabel, "Marriott West");

  // Fleet inventory resolution
  const suvAssignment = assignPrivateInventory([], {
    serviceDate: "2027-06-12",
    productCode: "parr-suburban",
  });
  assert.equal(suvAssignment.owner, "parr");
  assert.equal(suvAssignment.overflow, false);
  assert.ok((suvAssignment.capacity ?? 0) >= 1);

  // Customer order persistence & multi-reference lookup in isolated temp directory
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "parr-ns-order-test-"));
  const prevOrderDb = process.env.ORDER_DB_PATH;
  const prevOrderLog = process.env.ORDER_LOG_PATH;
  const prevLedger = process.env.BOOKING_LEDGER_PATH;
  const prevVercel = process.env.VERCEL;
  const prevBlobToken = process.env.BLOB_READ_WRITE_TOKEN;

  process.env.ORDER_DB_PATH = path.join(tempDir, "orders.sqlite");
  process.env.ORDER_LOG_PATH = path.join(tempDir, "orders.ndjson");
  process.env.BOOKING_LEDGER_PATH = path.join(tempDir, "booking-ledger.csv");
  delete process.env.VERCEL;
  delete process.env.BLOB_READ_WRITE_TOKEN;

  t.after(() => {
    if (prevOrderDb === undefined) delete process.env.ORDER_DB_PATH;
    else process.env.ORDER_DB_PATH = prevOrderDb;
    if (prevOrderLog === undefined) delete process.env.ORDER_LOG_PATH;
    else process.env.ORDER_LOG_PATH = prevOrderLog;
    if (prevLedger === undefined) delete process.env.BOOKING_LEDGER_PATH;
    else process.env.BOOKING_LEDGER_PATH = prevLedger;
    if (prevVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = prevVercel;
    if (prevBlobToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = prevBlobToken;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  const savedOrder = await saveInternalOrder({
    rezdyBookingReference: "RZD-STANDALONE-2027",
    productCode: "parr-suburban",
    sessionKey: null,
    customer: {
      firstName: "Taylor",
      lastName: "Morrison",
      email: "taylor@example.com",
      phone: "+17205550199",
    },
    booking: {
      status: "confirmed",
      venueSlug: "red-rocks-amphitheatre",
      rideType: "private",
      productSlug: "suv",
      productTitle: "Private Suburban",
      date: "2027-04-15",
      artist: "Zingara",
      quantity: 1,
      guestCount: 5,
    },
    rezdyBookingPayload: {
      venueSlug: "red-rocks-amphitheatre",
      option: "suv",
      date: "2027-04-15",
      qty: 1,
    },
    payment: {
      status: "paid",
      totalDue: 399,
      totalPaid: 399,
      squareOrderId: "SQ-ORDER-STANDALONE-1",
    },
    pickup: {
      address: "1550 Court Pl, Denver, CO 80202",
    },
  });

  assert.ok(savedOrder.internalOrderId);
  assert.ok(savedOrder.bookingToken);

  const byId = await getInternalOrderById(savedOrder.internalOrderId);
  assert.equal(byId?.internalOrderId, savedOrder.internalOrderId);

  const byToken = await getInternalOrderByAnyReference(savedOrder.bookingToken!);
  assert.equal(byToken?.internalOrderId, savedOrder.internalOrderId);

  const byRezdyRef = await getInternalOrderByAnyReference("RZD-STANDALONE-2027");
  assert.equal(byRezdyRef?.internalOrderId, savedOrder.internalOrderId);

  const bySquareOrder = await getInternalOrderByAnyReference("SQ-ORDER-STANDALONE-1");
  assert.equal(bySquareOrder?.internalOrderId, savedOrder.internalOrderId);

  // 2027 announced vs unannounced season truthfulness
  const upcomingFromLate2026 = await getUpcomingEventsCatalog({
    fromDateKey: "2026-11-11",
    scope: "redrocks",
    venueId: "red-rocks-amphitheatre",
  });
  assert.ok(
    upcomingFromLate2026.length > 0,
    "Verified upcoming Red Rocks events across 2026-2027 must be available locally",
  );
  assert.equal(
    upcomingFromLate2026.some((ev) => ev.dateKey.startsWith("2027-")),
    true,
    "Upcoming catalog must seamlessly include verified 2027 Red Rocks events",
  );
  for (const ev of upcomingFromLate2026) {
    assert.match(ev.dateKey, /^202[67]-\d{2}-\d{2}$/);
    assert.ok(ev.name && ev.name.trim().length > 0);
    assert.equal(
      /\b(fake|placeholder|unannounced headliner|mystery tba)\b/i.test(ev.name),
      false,
      `Catalog must never invent fake performers: ${ev.name}`,
    );
  }

  // Post-season / unannounced future window returns empty array cleanly rather than fabricating shows
  const catalog2027 = await getEventsCatalog(2027, "redrocks");
  const afterKnownSeason = selectUpcomingEvents(catalog2027, {
    fromDateKey: "2028-02-01",
  });
  assert.deepEqual(
    afterKnownSeason,
    [],
    "When no verified future events exist after cutoff, selector must return [] instead of inventing dates",
  );

  // Unannounced custom 2027 date returns null show match (zero fabricated headliner) while remaining bookable by date
  const unannouncedContext = await resolveBookingShowContext({
    venueSlug: "red-rocks-amphitheatre",
    dateKey: "2027-09-23",
    artistName: "",
  });
  assert.equal(
    unannouncedContext,
    null,
    "Unannounced future date must return null show match rather than fabricating an artist name",
  );

  // Verify homepage & HomeSections expose truthful 2027 custom transportation / presale inquiry framing
  const homePageSrc = fs.readFileSync(path.join(REPO_ROOT, "app", "page.tsx"), "utf8");
  const homeSectionsSrc = fs.readFileSync(
    path.join(REPO_ROOT, "components", "home", "HomeSections.tsx"),
    "utf8",
  );
  assert.match(homeSectionsSrc, /Planning a 2027 Red Rocks concert night\?/);
  assert.match(homeSectionsSrc, /never guessed or unconfirmed tour dates/);
  assert.match(homeSectionsSrc, /Custom 2027 Show-Date Booking/);
  assert.match(homeSectionsSrc, /Ask Dispatch About 2027/);
  assert.match(homePageSrc, /getUpcomingEventsCatalog/);
});

test("3. Fallback-Isolation Proof: when DCC, Cruise Promenade, weather/event feeds, and telemetry fail with HTTP 503 / timeout, PARR standalone catalog, pricing, and checkout continue 100%", async (t) => {
  const handoffsDir = path.join(REPO_ROOT, "data", "handoffs");
  const handoffsExistedBefore = fs.existsSync(handoffsDir);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "parr-ns-fallback-test-"));
  const prevEnv = {
    ORDER_DB_PATH: process.env.ORDER_DB_PATH,
    ORDER_LOG_PATH: process.env.ORDER_LOG_PATH,
    BOOKING_LEDGER_PATH: process.env.BOOKING_LEDGER_PATH,
    VERCEL: process.env.VERCEL,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    SQUARE_ENVIRONMENT: process.env.SQUARE_ENVIRONMENT,
    SQUARE_ACCESS_TOKEN: process.env.SQUARE_ACCESS_TOKEN,
    SQUARE_LOCATION_ID: process.env.SQUARE_LOCATION_ID,
    DCC_ENABLE_LIVE_CALLBACKS: process.env.DCC_ENABLE_LIVE_CALLBACKS,
    DCC_CALLBACK_URL: process.env.DCC_CALLBACK_URL,
  };

  process.env.ORDER_DB_PATH = path.join(tempDir, "orders.sqlite");
  process.env.ORDER_LOG_PATH = path.join(tempDir, "orders.ndjson");
  process.env.BOOKING_LEDGER_PATH = path.join(tempDir, "booking-ledger.csv");
  delete process.env.VERCEL;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  process.env.SQUARE_ENVIRONMENT = "sandbox";
  process.env.SQUARE_ACCESS_TOKEN = "sandbox-isolated-test-token";
  process.env.SQUARE_LOCATION_ID = "L_ISOLATED_SANDBOX";
  process.env.DCC_ENABLE_LIVE_CALLBACKS = "true";
  process.env.DCC_CALLBACK_URL =
    "https://www.destinationcommandcenter.com/api/internal/satellite-handoffs/events";

  const originalFetch = globalThis.fetch;
  const interceptedOutageCalls: string[] = [];

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlStr =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    // Local in-memory Square Sandbox mock so zero external calls or charges ever occur
    if (urlStr.startsWith("https://connect.squareupsandbox.com/v2/orders")) {
      return new Response(
        JSON.stringify({
          order: {
            id: "sq_sandbox_isolated_order_503_proof",
            location_id: "L_ISOLATED_SANDBOX",
            state: "OPEN",
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Force HTTP 503 / timeout on DCC, Cruise Promenade, weather/event feeds, and telemetry
    interceptedOutageCalls.push(`${init?.method || "GET"} ${urlStr}`);

    if (urlStr.includes("api.open-meteo.com")) {
      const timeoutErr = new Error("Upstream feed timed out");
      timeoutErr.name = "AbortError";
      throw timeoutErr;
    }

    return new Response(
      JSON.stringify({
        error: "service_unavailable",
        message: "Simulated upstream outage (HTTP 503)",
      }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" },
      },
    );
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
    for (const [key, val] of Object.entries(prevEnv)) {
      if (val === undefined) delete process.env[key];
      else process.env[key] = val;
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
    if (!handoffsExistedBefore && fs.existsSync(handoffsDir)) {
      fs.rmSync(handoffsDir, { recursive: true, force: true });
    }
  });

  // 3A. Weather & Red Rocks Intelligence degrade cleanly without breaking PARR or halting transport
  const weatherSnap = await getWeather();
  assert.equal(weatherSnap, null, "Open-Meteo timeout must degrade to null without throwing");

  const sevenDayForecast = await getRedRocks7DayForecast();
  assert.deepEqual(
    sevenDayForecast,
    {},
    "7-day Open-Meteo outage must degrade to empty forecast map without throwing",
  );

  const intel = await getRedRocksIntelligence();
  assert.equal(intel.degraded, true);
  assert.equal(intel.forecast.available, false);
  assert.equal(
    intel.planning.transportationStatusChanged,
    false,
    "Upstream NWS 503 outage must never mark PARR transportation as disrupted",
  );

  const intelRouteRes = await getRedRocksIntelligenceRoute();
  assert.equal(intelRouteRes.status, 200);
  const intelRouteBody = await intelRouteRes.json();
  assert.equal(intelRouteBody.degraded, true);

  // 3B. Standalone Event Catalog, Show Context, Health & DCC Manifest operate 100% locally
  const eventsRes = await getRedRocksEventsRoute(
    new Request("https://www.partyatredrocks.com/api/red-rocks-events?year=2027"),
  );
  assert.equal(eventsRes.status, 200);
  const eventsBody = await eventsRes.json();
  assert.equal(eventsBody.year, 2027);
  assert.ok(Array.isArray(eventsBody.events) && eventsBody.events.length > 0);

  const announced2027Ctx = await resolveBookingShowContext({
    venueSlug: "red-rocks-amphitheatre",
    dateKey: "2027-04-17",
  });
  assert.equal(announced2027Ctx?.dateKey, "2027-04-17");
  assert.equal(
    announced2027Ctx?.artistName,
    "Sublime",
    "Local 2027 snapshot must resolve announced artist offline",
  );

  const healthRes = await getHealthRoute();
  assert.equal(healthRes.status, 200);
  const healthJson = await healthRes.json();
  assert.equal(healthJson.ok, true);
  assert.equal(healthJson.service, "partyatredrocks");

  const manifestRes = await getDccSiteManifest();
  assert.equal(manifestRes.status, 200);
  const manifestJson = await manifestRes.json();
  assert.equal(manifestJson.site_id, "partyatredrocks");
  assert.equal(manifestJson.booking_authority.autonomous_booking_enabled, false);
  assert.equal(
    manifestJson.booking_authority.decision_authorization_mode,
    "shadow_only_no_side_effects",
  );

  // 3C. Handoff URL builder, Cruise Promenade / rogue return URL rejection, and middleware ctx redemption
  assert.equal(
    getDccReturnHref({ dcc_return: "https://www.cruisepromenade.com/hijack" }),
    null,
    "Non-DCC return URLs (including Cruise Promenade or untrusted domains) must be rejected",
  );
  const rogueReturnRes = await getHandoffReturnRoute(
    new NextRequest(
      "https://www.partyatredrocks.com/handoff/return?dcc_return=https://www.cruisepromenade.com/hijack",
    ),
  );
  assert.equal(rogueReturnRes.status, 400);

  const standaloneHref = buildBookingHref({
    target: "private-option",
    venue: "red-rocks-amphitheatre",
    option: "suv",
    searchParams: {
      date: "2027-04-17",
    },
  });
  assert.equal(
    standaloneHref,
    "/book/red-rocks-amphitheatre/private/suv?date=2027-04-17",
  );

  const mwReq = new NextRequest(
    "https://www.partyatredrocks.com/book/red-rocks-amphitheatre/private/suv?ctx=dcc_ctx_outage99&email=secret@example.com&date=2027-04-15",
  );
  const mwRes = middleware(mwReq);
  assert.equal(mwRes.status, 302);
  const mwLocation = mwRes.headers.get("location") || "";
  assert.equal(mwLocation.includes("email="), false, "Middleware must strip PII query params");
  assert.equal(mwLocation.includes("ctx="), false, "Middleware must strip redeemed ctx param");
  assert.match(mwRes.headers.get("set-cookie") || "", /parr_trip_ctx=dcc_ctx_outage99/);

  // Direct DCC callback attempt during 503 outage must fail gracefully without throwing
  const dccOutageResult = await postDccSatelliteEvent({
    eventType: "handoff_viewed",
    searchParams: {
      dcc_handoff_id: "dcc_outage_test_handoff_503",
      source: "dcc",
      source_slug: "dcc-red-rocks-transportation",
    },
    sourcePath: "/book/red-rocks-amphitheatre/private/suv",
  });
  assert.equal(dccOutageResult.ok, false);
  assert.match(String(dccOutageResult.error || ""), /callback_503/);

  // 3D. Shared inventory + Private Checkout succeed 100% even while DCC callback endpoint returns 503
  const sharedInvRes = await getSharedInventoryRoute(
    new Request(
      "https://www.partyatredrocks.com/api/shared/inventory?venue=red-rocks-amphitheatre&date=2027-04-15&pickupHub=denver",
    ),
  );
  assert.equal(sharedInvRes.status, 200);
  const sharedInvBody = await sharedInvRes.json();
  assert.equal(sharedInvBody.venue, "red-rocks-amphitheatre");
  assert.equal(sharedInvBody.date, "2027-04-15");
  assert.ok(typeof sharedInvBody.available === "number");
  assert.ok(typeof sharedInvBody.capacity === "number");

  const checkoutReq = new Request("https://www.partyatredrocks.com/api/private/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      venue: "red-rocks-amphitheatre",
      option: "suv",
      qty: 1,
      date: "2027-04-15",
      artist: "Zingara",
      guestCount: 5,
      pickupAddress: "1550 Court Pl, Denver, CO 80202",
      notes: "Fallback isolation verification ride",
      sourcePath: "/book/red-rocks-amphitheatre/private/suv",
      searchParams: {
        dcc_handoff_id: "dcc_checkout_during_503_outage",
        source: "dcc",
        source_slug: "dcc-red-rocks-shuttle",
      },
      customer: {
        firstName: "Jordan",
        lastName: "Case",
        email: "jordan.case@example.com",
        phone: "720-555-0144",
        phoneCountry: "US",
      },
    }),
  });

  const { POST: postPrivateCheckoutRoute } = await import(
    "@/app/api/private/checkout/route"
  );
  const checkoutRes = await postPrivateCheckoutRoute(checkoutReq);
  assert.equal(
    checkoutRes.status,
    200,
    "PARR private checkout must succeed with HTTP 200 even when DCC callback endpoints return HTTP 503",
  );
  const checkoutBody = await checkoutRes.json();
  assert.ok(checkoutBody.internalOrderId);
  assert.ok(checkoutBody.bookingToken);
  assert.equal(checkoutBody.squareOrderId, "sq_sandbox_isolated_order_503_proof");
  assert.equal(checkoutBody.totalDue, 399);
  assert.equal(checkoutBody.inventoryOwner, "parr");

  // Confirm customer order lookup resolves the newly created order immediately
  const persisted = await getInternalOrderByAnyReference(checkoutBody.bookingToken);
  assert.equal(persisted?.internalOrderId, checkoutBody.internalOrderId);
  assert.equal(persisted?.payment?.squareOrderId, "sq_sandbox_isolated_order_503_proof");

  // Confirm our outage interceptor actually blocked DCC & weather endpoints during this test
  assert.equal(
    interceptedOutageCalls.some((entry) => entry.includes("destinationcommandcenter.com")),
    true,
    "Test must prove DCC callback attempts actually hit the 503 outage interceptor",
  );
  assert.equal(
    interceptedOutageCalls.some((entry) => entry.includes("api.weather.gov")),
    true,
    "Test must prove weather intelligence attempts actually hit the 503 outage interceptor",
  );
  assert.equal(
    interceptedOutageCalls.some((entry) => entry.includes("api.open-meteo.com")),
    true,
    "Test must prove Open-Meteo attempts actually hit the timeout interceptor",
  );
});

function walkCodeFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkCodeFiles(full));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

test("4. Authorized PARR Repairs: PATCH /api/booking/[token]/notes, verified 720-369-6292 phone + self-service order lookup on /booking, and multi-year /venues/[slug] catalog", async (t) => {
  // 4A. Zero placeholder 3030000000 phone numbers across app/ and components/, and /booking uses canonical 720-369-6292 + BookingOrderLookup
  const codeFiles = [
    ...walkCodeFiles(path.join(REPO_ROOT, "app")),
    ...walkCodeFiles(path.join(REPO_ROOT, "components")),
  ];
  for (const file of codeFiles) {
    const src = fs.readFileSync(file, "utf8");
    assert.equal(
      /3030000000|303-000-0000|\(303\)\s*000-0000/.test(src),
      false,
      `Placeholder phone number 3030000000 must not appear in ${path.relative(REPO_ROOT, file)}`,
    );
  }

  const bookingPageSrc = fs.readFileSync(
    path.join(REPO_ROOT, "app", "booking", "page.tsx"),
    "utf8",
  );
  assert.match(bookingPageSrc, /PARR_PUBLIC_FACTS\.support\.phoneE164/);
  assert.match(bookingPageSrc, /PARR_PUBLIC_FACTS\.support\.phoneDisplay/);
  assert.match(bookingPageSrc, /BookingOrderLookup/);
  assert.equal(PARR_PUBLIC_FACTS.support.phoneDisplay, "720-369-6292");
  assert.equal(PARR_PUBLIC_FACTS.support.phoneE164, "+17203696292");

  // 4B. Multi-year upcoming catalog on app/venues/[slug]/page.tsx (no hardcoded single-year getEventsCatalog(2026, "all"))
  const venueSlugPageSrc = fs.readFileSync(
    path.join(REPO_ROOT, "app", "venues", "[slug]", "page.tsx"),
    "utf8",
  );
  assert.match(venueSlugPageSrc, /getUpcomingEventsCatalog/);
  assert.equal(
    venueSlugPageSrc.includes("getEventsCatalog(2026"),
    false,
    "app/venues/[slug]/page.tsx must not hardcode single-year getEventsCatalog(2026, ...)",
  );

  const venueUpcomingAll = await getUpcomingEventsCatalog({
    scope: "all",
    venueId: "red-rocks-amphitheatre",
    fromDateKey: "2026-11-11",
    limit: 24,
  });
  assert.ok(venueUpcomingAll.length > 0);
  assert.equal(
    venueUpcomingAll.some((ev) => ev.dateKey.startsWith("2026-")),
    true,
    "Multi-year venue catalog must include remaining 2026 shows",
  );
  assert.equal(
    venueUpcomingAll.some((ev) => ev.dateKey.startsWith("2027-")),
    true,
    "Multi-year venue catalog must seamlessly include verified 2027 shows",
  );

  const unannouncedMission2027 = await getUpcomingEventsCatalog({
    scope: "all",
    venueId: "mission-ballroom",
    fromDateKey: "2027-01-01",
    years: [2027],
  });
  assert.deepEqual(
    unannouncedMission2027,
    [],
    "Unannounced 2027 venue schedules must remain empty and never fabricate events",
  );

  // Also verify resolveBookingShowContext resolves a 2027 show ID even when dateKey is omitted
  const by2027ShowIdOnly = await resolveBookingShowContext({
    venueSlug: "red-rocks-amphitheatre",
    event: "rr-2027-04-17-sublime",
  });
  assert.equal(by2027ShowIdOnly?.dateKey, "2027-04-17");
  assert.equal(by2027ShowIdOnly?.artistName, "Sublime");

  // 4C. Isolated booking store for PATCH /api/booking/[token]/notes + verified lookup during upstream 503 outage
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "parr-ns-repairs-test-"));
  const prevOrderDb = process.env.ORDER_DB_PATH;
  const prevOrderLog = process.env.ORDER_LOG_PATH;
  const prevLedger = process.env.BOOKING_LEDGER_PATH;
  const prevVercel = process.env.VERCEL;
  const prevBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const originalFetch = globalThis.fetch;

  process.env.ORDER_DB_PATH = path.join(tempDir, "orders.sqlite");
  process.env.ORDER_LOG_PATH = path.join(tempDir, "orders.ndjson");
  process.env.BOOKING_LEDGER_PATH = path.join(tempDir, "booking-ledger.csv");
  delete process.env.VERCEL;
  delete process.env.BLOB_READ_WRITE_TOKEN;

  // Simulate 503 outage on all external network calls to prove notes + lookup are 100% standalone
  globalThis.fetch = async (): Promise<Response> =>
    new Response(JSON.stringify({ error: "upstream_503" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });

  t.after(() => {
    globalThis.fetch = originalFetch;
    if (prevOrderDb === undefined) delete process.env.ORDER_DB_PATH;
    else process.env.ORDER_DB_PATH = prevOrderDb;
    if (prevOrderLog === undefined) delete process.env.ORDER_LOG_PATH;
    else process.env.ORDER_LOG_PATH = prevOrderLog;
    if (prevLedger === undefined) delete process.env.BOOKING_LEDGER_PATH;
    else process.env.BOOKING_LEDGER_PATH = prevLedger;
    if (prevVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = prevVercel;
    if (prevBlobToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = prevBlobToken;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  const seededOrder = await saveInternalOrder({
    rezdyBookingReference: "RZD-NOTES-2027",
    productCode: "parr-van-10",
    sessionKey: null,
    customer: {
      firstName: "Casey",
      lastName: "Rivera",
      email: "Casey.Rivera@example.com",
      phone: "+17205550177",
    },
    booking: {
      status: "confirmed",
      venueSlug: "red-rocks-amphitheatre",
      rideType: "private",
      productSlug: "van",
      productTitle: "Upgrade to Private Van",
      date: "2027-04-17",
      artist: "Sublime",
      quantity: 1,
      guestCount: 8,
    },
    rezdyBookingPayload: {
      venueSlug: "red-rocks-amphitheatre",
      option: "van",
      date: "2027-04-17",
      qty: 1,
    },
    payment: {
      status: "paid",
      totalDue: 599,
      totalPaid: 599,
      squareOrderId: "SQ-NOTES-ORDER-1",
    },
    pickup: {
      address: "1550 Court Pl, Denver, CO 80202",
    },
  });

  const validToken = seededOrder.bookingToken!;
  assert.ok(validToken);

  // Invalid token format -> 400
  const badTokenRes = await patchBookingNotesRoute(
    new Request("https://www.partyatredrocks.com/api/booking/bad$token!/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "hello" }),
    }),
    { params: Promise.resolve({ token: "bad$token!" }) },
  );
  assert.equal(badTokenRes.status, 400);
  assert.equal(badTokenRes.headers.get("cache-control"), "no-store");

  // Malformed JSON -> 400
  const badJsonRes = await patchBookingNotesRoute(
    new Request(`https://www.partyatredrocks.com/api/booking/${validToken}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "{not-valid-json",
    }),
    { params: Promise.resolve({ token: validToken }) },
  );
  assert.equal(badJsonRes.status, 400);

  // Non-string notes -> 400
  const nonStringRes = await patchBookingNotesRoute(
    new Request(`https://www.partyatredrocks.com/api/booking/${validToken}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: 12345 }),
    }),
    { params: Promise.resolve({ token: validToken }) },
  );
  assert.equal(nonStringRes.status, 400);

  // Oversized notes (> 1,000 chars) -> 400
  const oversizedRes = await patchBookingNotesRoute(
    new Request(`https://www.partyatredrocks.com/api/booking/${validToken}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "x".repeat(1001) }),
    }),
    { params: Promise.resolve({ token: validToken }) },
  );
  assert.equal(oversizedRes.status, 400);

  // Unknown booking token -> 404 structured JSON
  const unknownTokenRes = await patchBookingNotesRoute(
    new Request("https://www.partyatredrocks.com/api/booking/nonexistent-token-9999/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "Meet out front" }),
    }),
    { params: Promise.resolve({ token: "nonexistent-token-9999" }) },
  );
  assert.equal(unknownTokenRes.status, 404);
  assert.equal(unknownTokenRes.headers.get("cache-control"), "no-store");
  const unknownTokenBody = await unknownTokenRes.json();
  assert.equal(unknownTokenBody.ok, false);

  // Valid PATCH saves sanitized note durably without touching payment, pricing, or seats
  const saveRes = await patchBookingNotesRoute(
    new Request(`https://www.partyatredrocks.com/api/booking/${validToken}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: "  Meet at Sheraton main entrance at 5:15 PM.\u0000\u0007\r\nText Casey on arrival.  ",
      }),
    }),
    { params: Promise.resolve({ token: validToken }) },
  );
  assert.equal(saveRes.status, 200);
  assert.equal(saveRes.headers.get("cache-control"), "no-store");
  const saveBody = await saveRes.json();
  assert.equal(saveBody.ok, true);
  assert.equal(
    saveBody.notes,
    "Meet at Sheraton main entrance at 5:15 PM.\nText Casey on arrival.",
  );

  const reloadedAfterSave = await getInternalOrderByAnyReference(validToken);
  assert.equal(
    reloadedAfterSave?.notes,
    "Meet at Sheraton main entrance at 5:15 PM.\nText Casey on arrival.",
  );
  assert.equal(reloadedAfterSave?.productCode, "parr-van-10");
  assert.equal(reloadedAfterSave?.payment?.status, "paid");
  assert.equal(reloadedAfterSave?.payment?.totalDue, 599);
  assert.equal(reloadedAfterSave?.payment?.totalPaid, 599);
  assert.equal(reloadedAfterSave?.booking?.status, "confirmed");
  assert.equal(reloadedAfterSave?.booking?.quantity, 1);
  assert.equal(reloadedAfterSave?.booking?.guestCount, 8);

  // POST alias also works cleanly (e.g. clearing or updating note)
  const postAliasRes = await postBookingNotesRoute(
    new Request(`https://www.partyatredrocks.com/api/booking/${validToken}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "Updated pickup note via POST alias." }),
    }),
    { params: Promise.resolve({ token: validToken }) },
  );
  assert.equal(postAliasRes.status, 200);
  const reloadedAfterPost = await getInternalOrderByAnyReference(validToken);
  assert.equal(reloadedAfterPost?.notes, "Updated pickup note via POST alias.");

  // 4D. Verified Self-Service Order Lookup: blocks unverified guesses and resolves verified email/phone
  const missingFieldsLookup = await lookupVerifiedBooking({ reference: "RZD-NOTES-2027", contact: "" });
  assert.equal(missingFieldsLookup.ok, false);
  if (!missingFieldsLookup.ok) assert.equal(missingFieldsLookup.status, 400);

  const unknownRefLookup = await lookupVerifiedBooking({
    reference: "RZD-DOES-NOT-EXIST",
    contact: "casey.rivera@example.com",
  });
  const wrongEmailLookup = await lookupVerifiedBooking({
    reference: "RZD-NOTES-2027",
    contact: "attacker@example.com",
  });
  const wrongPhoneLookup = await lookupVerifiedBooking({
    reference: "RZD-NOTES-2027",
    contact: "303-555-9999",
  });

  assert.equal(unknownRefLookup.ok, false);
  assert.equal(wrongEmailLookup.ok, false);
  assert.equal(wrongPhoneLookup.ok, false);
  if (!unknownRefLookup.ok && !wrongEmailLookup.ok && !wrongPhoneLookup.ok) {
    assert.equal(unknownRefLookup.status, 404);
    assert.equal(wrongEmailLookup.status, 404);
    assert.equal(wrongPhoneLookup.status, 404);
    assert.equal(
      wrongEmailLookup.error,
      unknownRefLookup.error,
      "Failure response must be identical for unknown reference vs wrong contact to prevent order enumeration",
    );
    assert.equal(wrongPhoneLookup.error, unknownRefLookup.error);
  }

  const verifiedByEmail = await lookupVerifiedBooking({
    reference: "#RZD-NOTES-2027",
    contact: "casey.rivera@example.com",
  });
  assert.deepEqual(verifiedByEmail, {
    ok: true,
    bookingPath: `/booking/${encodeURIComponent(validToken)}`,
  });

  const verifiedByPhone = await lookupVerifiedBooking({
    reference: "SQ-NOTES-ORDER-1",
    contact: "(720) 555-0177",
  });
  assert.deepEqual(verifiedByPhone, {
    ok: true,
    bookingPath: `/booking/${encodeURIComponent(validToken)}`,
  });
});
