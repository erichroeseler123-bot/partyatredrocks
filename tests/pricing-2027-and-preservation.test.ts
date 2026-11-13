import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getPrivateRidePricingForDate, PARR_2026_PRICING, PARR_2027_PRICING } from "../lib/pricing";

const ROOT = path.resolve(process.cwd());

const ALLOWED_LEGACY_PRICE_FILES = new Set([
  "lib/pricing.ts",
  "app/red-rocks/transportation/shuttle-vs-uber-2026/page.tsx",
]);

function walkSourceFiles(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      out.push(...walkSourceFiles(full));
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

test("getPrivateRidePricingForDate uses 2027 rates for 2027 dates and preserves 2026 & legacy amounts", () => {
  assert.equal(PARR_2027_PRICING.suv, 499);
  assert.equal(PARR_2027_PRICING.van, 699);
  assert.equal(PARR_2026_PRICING.suv, 399);
  assert.equal(PARR_2026_PRICING.van, 599);

  const suv2027 = getPrivateRidePricingForDate({ optionSlug: "suv", serviceDate: "2027-06-15" });
  assert.equal(suv2027.priceUsd, 499);
  assert.equal(suv2027.season, "2027");

  const van2027 = getPrivateRidePricingForDate({ optionSlug: "van", serviceDate: "2027-06-15" });
  assert.equal(van2027.priceUsd, 699);
  assert.equal(van2027.season, "2027");

  const suv2026 = getPrivateRidePricingForDate({ optionSlug: "suv", serviceDate: "2026-11-20" });
  assert.equal(suv2026.priceUsd, 399);
  assert.equal(suv2026.season, "2026");

  const van2026 = getPrivateRidePricingForDate({ optionSlug: "van", serviceDate: "2026-11-20" });
  assert.equal(van2026.priceUsd, 599);
  assert.equal(van2026.season, "2026");

  const preserved2027Order = getPrivateRidePricingForDate({
    optionSlug: "suv",
    serviceDate: "2027-06-15",
    legacyAmount: 399,
  });
  assert.equal(preserved2027Order.priceUsd, 399);
  assert.equal(preserved2027Order.season, "preserved");

  const defaultSeason = getPrivateRidePricingForDate({ optionSlug: "suv" });
  assert.equal(defaultSeason.priceUsd, 499);
  assert.equal(defaultSeason.season, "2027");
});

test("no unguarded stale $399 or $599 private Red Rocks offers remain in app, components, or lib", () => {
  const files = [
    ...walkSourceFiles(path.join(ROOT, "app")),
    ...walkSourceFiles(path.join(ROOT, "components")),
    ...walkSourceFiles(path.join(ROOT, "lib")),
  ];

  const violations: string[] = [];
  for (const fullPath of files) {
    const rel = path.relative(ROOT, fullPath).replace(/\\/g, "/");
    if (ALLOWED_LEGACY_PRICE_FILES.has(rel)) continue;
    const text = fs.readFileSync(fullPath, "utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, idx) => {
      if (/\$(399|599)\b/.test(line)) {
        violations.push(`${rel}:${idx + 1}: ${line.trim()}`);
      }
    });
  }

  assert.deepEqual(
    violations,
    [],
    `Found unguarded legacy $399/$599 pricing references:\n${violations.join("\n")}`
  );
});
