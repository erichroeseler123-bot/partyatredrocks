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
