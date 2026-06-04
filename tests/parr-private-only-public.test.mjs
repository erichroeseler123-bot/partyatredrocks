import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const publicSellingFiles = [
  "lib/bookingCopy.ts",
  "lib/rideCatalog.ts",
  "app/book/page.tsx",
  "app/book/[venue]/page.tsx",
  "app/book/[venue]/bookingSeo.ts",
  "app/book/[venue]/private/page.tsx",
  "app/book/[venue]/private/[option]/page.tsx",
  "app/book/[venue]/custom/shared/page.tsx",
  "app/book/[venue]/custom/shared/[pickup]/page.tsx",
  "app/page.tsx",
  "components/home/HomeBookingSteps.tsx",
  "components/home/HomeServicesGrid.tsx",
  "components/home/RedRocks123.tsx",
  "components/home/RedRocksFAQ.tsx",
  "components/FeaturedServices.tsx",
  "components/FleetGrid.tsx",
  "components/shared/BookingCTA.tsx",
];

test("public booking config exposes only Suburban and private van", () => {
  const catalog = read("lib/rideCatalog.ts");
  assert.match(catalog, /PUBLIC_PRIVATE_RIDE_OPTIONS = \[PRIVATE_RIDE_OPTIONS\[0\], PRIVATE_RIDE_OPTIONS\[1\]\] as const/);
  assert.match(catalog, /SUBURBAN_PRICE_RANGE_LABEL = "\$399–\$499"/);
  assert.match(catalog, /SUBURBAN_PRICE_TIERS = \[399, 449, 499, 499\] as const/);
  assert.match(catalog, /title: "Private Suburban"/);
  assert.match(catalog, /title: "Upgrade to Private Van"/);
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

test("active public selling surfaces do not advertise shared or per-person offers", () => {
  const banned = [
    /\$59(?!9)/i,
    /59\/pp/i,
    /per-person/i,
    /per-seat/i,
    /shared shuttle/i,
    /shuttle seats/i,
    /public shuttle/i,
    /scheduled shuttle/i,
    /group shuttle/i,
    /passenger ticket/i,
    /individual fare/i,
  ];

  for (const path of publicSellingFiles) {
    const source = read(path);
    for (const pattern of banned) {
      assert.doesNotMatch(source, pattern, `${path} contains banned public selling copy: ${pattern}`);
    }
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
