import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const ACTIVE_PUBLIC_COPY_FILES = [
  "app/page.tsx",
  "app/shuttles/page.tsx",
  "components/home/HomeHero.tsx",
  "components/home/HomeSections.tsx",
  "components/home/HomeServicesGrid.tsx",
  "components/FeaturedServices.tsx",
  "components/MainNav.tsx",
  "components/SiteFooter.tsx",
  "components/shared/BookingCTA.tsx",
  "lib/bookingCopy.ts",
  "lib/pricing.ts",
];

const PUBLIC_FORBIDDEN_PATTERNS = [
  /\$59(?!9)/,
  /59\/pp/i,
  /per person/i,
  /per-person/i,
  /shared shuttle/i,
  /shuttle seats/i,
  /public shuttle/i,
  /scheduled shuttle/i,
  /group shuttle/i,
  /passenger ticket/i,
  /individual fare/i,
  /\$399–\$499/,
  /\$449/,
  /Suburban[^"\n]*\$499/i,
  /Sprinter/i,
  /party bus/i,
];

const ALLOWED_METADATA_CLARIFICATIONS = [
  "No shared seats or per-person fares.",
];

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

test("public booking config exposes only Suburban and private van", () => {
  const catalog = read("lib/rideCatalog.ts");
  assert.match(catalog, /PUBLIC_PRIVATE_RIDE_OPTIONS = \[PRIVATE_RIDE_OPTIONS\[0\], PRIVATE_RIDE_OPTIONS\[1\]\] as const/);
  assert.match(catalog, /SUBURBAN_PRICE = 399/);
  assert.match(catalog, /SUBURBAN_PRICE_LABEL = "\$399"/);
  assert.doesNotMatch(catalog, /\$399–\$499/);
  assert.doesNotMatch(catalog, /399, 449, 499/);
  assert.match(catalog, /title: "Private Suburban"/);
  assert.match(catalog, /title: "Upgrade to Private Van"/);
});

test("public Suburban pricing is flat 399", () => {
  const catalog = read("lib/rideCatalog.ts");
  const privatePage = read("app/book/[venue]/private/page.tsx");
  const privateSeo = read("app/book/[venue]/bookingSeo.ts");
  const combined = `${catalog}\n${privatePage}\n${privateSeo}`;

  assert.match(combined, /\$399/);
  assert.match(catalog, /return `\$\$\{SUBURBAN_PRICE\}`/);
  assert.doesNotMatch(combined, /\$399–\$499/);
  assert.doesNotMatch(combined, /\$449/);
  assert.doesNotMatch(combined, /\$499/);
  assert.doesNotMatch(combined, /\$59\/pp/);
  assert.doesNotMatch(combined, /per person/i);
  assert.doesNotMatch(combined, /shared pickup/i);
  assert.doesNotMatch(combined, /shared shuttle/i);
});

test("active public copy does not sell shared or per-person rides", () => {
  for (const path of ACTIVE_PUBLIC_COPY_FILES) {
    let source = read(path);
    for (const allowed of ALLOWED_METADATA_CLARIFICATIONS) {
      source = source.replaceAll(allowed, "");
    }
    for (const pattern of PUBLIC_FORBIDDEN_PATTERNS) {
      assert.doesNotMatch(source, pattern, `${path} contains ${pattern}`);
    }
  }
});

test("shuttles page metadata is private-vehicle-only", () => {
  const shuttles = read("app/shuttles/page.tsx");

  assert.match(shuttles, /Private Red Rocks Transportation \| Suburban \$399 \+ Van Upgrade/);
  assert.match(
    shuttles,
    /Book private Red Rocks transportation with a \$399 Private Suburban or upgrade to a private van\. No shared seats or per-person fares\./,
  );
  assert.match(shuttles, /openGraph/);
  assert.match(shuttles, /twitter/);
  assert.doesNotMatch(shuttles, /\$59(?!9)/);
  assert.doesNotMatch(shuttles, /Red Rocks Shuttle from Denver/);
  assert.doesNotMatch(shuttles, /Private SUVs/);
});

test("public shared booking routes redirect to private Suburban", () => {
  for (const path of [
    "app/book-shuttle/page.tsx",
    "app/book/[venue]/shared/page.tsx",
    "app/book/[venue]/shared/[productCode]/page.tsx",
    "app/book/[venue]/custom/shared/page.tsx",
    "app/book/[venue]/custom/shared/[pickup]/page.tsx",
  ]) {
    const source = read(path);
    assert.match(source, /private\/suv/);
  }
});

test("DCC tracking params are preserved through private redirects", () => {
  const handoff = read("lib/parrHandoff.ts");
  for (const key of ["ref", "dcc", "utm_source", "utm_campaign"]) {
    assert.match(handoff, new RegExp(`"${key}"`), `lib/parrHandoff.ts should preserve ${key}`);
  }
  assert.match(handoff, /export function appendSearchParams/);

  for (const path of [
    "app/book-shuttle/page.tsx",
    "app/book/[venue]/page.tsx",
    "app/book/[venue]/custom/shared/page.tsx",
    "app/book/[venue]/custom/shared/[pickup]/page.tsx",
  ]) {
    const source = read(path);
    assert.match(source, /appendSearchParams/);
    assert.match(source, /private\/suv/);
  }
});

test("Rezdy booking telemetry events are accepted and carry DCC context", () => {
  const telemetryRoute = read("app/api/telemetry/parr/route.ts");
  const telemetryStore = read("lib/parrTelemetryStore.ts");
  const rezdyEmbed = read("components/booking/rezdy/RezdyBookingEmbed.tsx");

  for (const eventName of ["booking_opened", "rezdy_embed_viewed"]) {
    assert.match(telemetryRoute, new RegExp(`"${eventName}"`));
    assert.match(telemetryStore, new RegExp(`\\| "${eventName}"`));
    assert.match(rezdyEmbed, new RegExp(`trackParrEvent\\("${eventName}"`));
  }

  for (const key of [
    "source",
    "dcc_handoff_id",
    "handoff_id",
    "decision_corridor",
    "ref",
    "dcc",
    "utm_source",
    "utm_campaign",
  ]) {
    assert.match(rezdyEmbed, new RegExp(`"${key}"`));
  }
});

test("public sitemap omits shared booking URLs", () => {
  const sitemap = read("app/sitemap.xml/route.ts");
  assert.doesNotMatch(sitemap, /custom\/shared/);
  assert.doesNotMatch(sitemap, /private-vs-shared/);
  assert.doesNotMatch(sitemap, /shuttle-vs-/);
  assert.match(sitemap, /private\/suv/);
  assert.match(sitemap, /private\/van/);
});
