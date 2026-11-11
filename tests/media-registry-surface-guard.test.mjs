import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();

const TARGET_FILES = [
  "app/book/[venue]/page.tsx",
  "app/venues/red-rocks-amphitheatre/page.tsx",
  "app/social/page.tsx",
  "data/social/ugc-posts.ts",
];

const BANNED_SHARED_FALLBACKS = ["afterdark.jpg", "arrival.jpg"];

const BANNED_REGISTRY_FALLBACK_PATTERNS = [
  /^\/images\/venues\/fallback\./i,
  /^\/images\/shows\/fallback\.jpg$/i,
  /^\/hero\/hero-home\./i,
  /^\/hero\/hero-guides\./i,
];

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

test("booking registry has required venue-specific entries and existing files", () => {
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

  for (const [slug, entry] of Object.entries(registry)) {
    for (const key of ["heroImage", "cardImage"]) {
      const img = entry[key];
      assert.ok(img && img.startsWith("/"), `${slug}.${key} must start with /`);
      const abs = path.join(ROOT, "public", img.slice(1));
      assert.ok(fs.existsSync(abs), `${slug}.${key} missing on disk: ${img}`);
    }
  }
});

test("venue and guide registries never use banned generic fallback paths", () => {
  for (const rel of ["data/venue-media.registry.json", "data/guide-media.registry.json"]) {
    const registry = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
    for (const [slug, entry] of Object.entries(registry)) {
      for (const field of ["cardImage", "manualImage", "resolvedImage", "fallbackImage"]) {
        const value = entry[field];
        if (!value) continue;
        for (const banned of BANNED_REGISTRY_FALLBACK_PATTERNS) {
          assert.equal(
            banned.test(value),
            false,
            `${rel} -> ${slug}.${field} uses banned path: ${value}`,
          );
        }
        if (value.startsWith("/")) {
          const abs = path.join(ROOT, "public", value.slice(1));
          assert.ok(fs.existsSync(abs), `${rel} -> ${slug}.${field} does not exist on disk: ${value}`);
        }
      }
    }
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
    assert.ok(ugc.includes(`getSocialProofImage("${id}")`), `UGC seeds should resolve ${id} via registry helper`);
  }
});

function hashFile(absPath) {
  const bytes = fs.readFileSync(absPath);
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

test("guide card registry does not map to duplicate paths or byte-identical images", () => {
  const guideRegistryPath = path.join(ROOT, "data/guide-media.registry.json");
  const guideRegistry = JSON.parse(fs.readFileSync(guideRegistryPath, "utf8"));

  const byPath = new Map();
  const byHash = new Map();

  for (const [slug, entry] of Object.entries(guideRegistry)) {
    const imageRef = entry.cardImage || entry.manualImage || entry.resolvedImage || entry.fallbackImage;
    assert.ok(imageRef, `${slug} missing active guide image`);

    if (!imageRef.startsWith("/")) {
      throw new Error(`${slug} image path must be absolute from /public: ${imageRef}`);
    }

    const existingPathSlug = byPath.get(imageRef);
    assert.equal(
      existingPathSlug,
      undefined,
      `${slug} duplicates cardImage path with ${existingPathSlug} (${imageRef})`,
    );
    byPath.set(imageRef, slug);

    const absPath = path.join(ROOT, "public", imageRef.slice(1));
    assert.ok(fs.existsSync(absPath), `${slug} image file does not exist: ${imageRef}`);

    const hash = hashFile(absPath);
    const existing = byHash.get(hash);
    assert.equal(
      existing,
      undefined,
      `${slug} duplicates image bytes with ${existing} (${imageRef})`,
    );

    byHash.set(hash, slug);
  }
});
