import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

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

test("public sitemap omits shared booking URLs", () => {
  const sitemap = read("app/sitemap.xml/route.ts");
  assert.doesNotMatch(sitemap, /custom\/shared/);
  assert.doesNotMatch(sitemap, /private-vs-shared/);
  assert.doesNotMatch(sitemap, /shuttle-vs-/);
  assert.match(sitemap, /private\/suv/);
  assert.match(sitemap, /private\/van/);
});
