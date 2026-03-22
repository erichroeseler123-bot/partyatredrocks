import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = "/home/ewrewr12/partyatredrocks";

const TARGET_FILES = [
  "app/book/[venue]/page.tsx",
  "app/venues/red-rocks-amphitheatre/page.tsx",
  "app/social/page.tsx",
  "data/social/ugc-posts.ts",
];

const BANNED_SHARED_FALLBACKS = ["afterdark.jpg", "arrival.jpg"];

test("booking, venue, and social surfaces do not use banned shared jpg fallbacks", () => {
  for (const rel of TARGET_FILES) {
    const abs = path.join(ROOT, rel);
    const content = fs.readFileSync(abs, "utf8");

    for (const banned of BANNED_SHARED_FALLBACKS) {
      assert.equal(
        content.includes(banned),
        false,
        `${rel} should not reference ${banned}`,
      );
    }
  }
});

test("booking registry has required venue-specific entries", () => {
  const registryPath = path.join(ROOT, "data/booking-media.registry.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

  const required = [
    "ball-arena",
    "empower-field-at-mile-high",
    "mission-ballroom",
    "fillmore-auditorium",
    "mishawaka-amphitheatre",
  ];

  for (const slug of required) {
    assert.ok(registry[slug], `booking registry missing ${slug}`);
    assert.ok(registry[slug].heroImage, `${slug} missing heroImage`);
    assert.ok(registry[slug].cardImage, `${slug} missing cardImage`);
  }
});

test("homepage venue-row registry entries stay venue-specific", () => {
  const venueRegistryPath = path.join(ROOT, "data/venue-media.registry.json");
  const venueRegistry = JSON.parse(fs.readFileSync(venueRegistryPath, "utf8"));

  const homepageVenueSlugs = [
    "mission-ballroom",
    "fillmore-auditorium",
    "ball-arena",
    "empower-field-at-mile-high",
    "all-venues",
  ];

  const bannedPatterns = [/\/images\/marketing\//i, /\/hero\//i, /afterdark\.jpg/i, /arrival\.jpg/i];

  for (const slug of homepageVenueSlugs) {
    const entry = venueRegistry[slug];
    assert.ok(entry, `venue registry missing ${slug}`);

    const imageRef = entry.manualImage || entry.resolvedImage || entry.fallbackImage || "";
    assert.ok(imageRef, `${slug} missing active image reference`);

    for (const pattern of bannedPatterns) {
      assert.equal(pattern.test(imageRef), false, `${slug} should not use transport/generic image: ${imageRef}`);
    }
  }
});

test("social-proof registry covers seeded post ids", () => {
  const socialProofPath = path.join(ROOT, "data/social-proof.registry.json");
  const ugcPath = path.join(ROOT, "data/social/ugc-posts.ts");

  const socialProof = JSON.parse(fs.readFileSync(socialProofPath, "utf8"));
  const ugc = fs.readFileSync(ugcPath, "utf8");

  const expectedIds = [
    "parr-night-arrival",
    "parr-night-crowd",
    "parr-night-suv",
    "parr-night-group",
  ];

  for (const id of expectedIds) {
    assert.ok(socialProof[id], `social proof registry missing ${id}`);
    assert.ok(socialProof[id].imageUrl, `${id} missing imageUrl`);
    assert.ok(ugc.includes(`getSocialProofImage(\"${id}\")`), `UGC seeds should resolve ${id} via registry helper`);
  }
});
