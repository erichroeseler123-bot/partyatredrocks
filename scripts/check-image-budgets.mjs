import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const IMAGE_BUDGETS = [
  { relPath: "public/hero/hero_red_rocks.webp", maxKb: 220 },
  { relPath: "public/hero/sprinter_red_rocks.webp", maxKb: 260 },
  { relPath: "public/hero/hero_red_rocks_card.webp", maxKb: 40 },
  { relPath: "public/hero/sprinter_red_rocks_card.webp", maxKb: 40 },
  { relPath: "public/venues/rrsite_thumb.webp", maxKb: 40 },
  { relPath: "public/hero/arrival_thumb.webp", maxKb: 40 },
];

let failed = false;

console.log("Checking PARR image budgets...");

for (const { relPath, maxKb } of IMAGE_BUDGETS) {
  const absPath = path.join(ROOT, relPath);
  if (!fs.existsSync(absPath)) {
    console.error(`  [FAIL] Missing required image: ${relPath}`);
    failed = true;
    continue;
  }

  const stat = fs.statSync(absPath);
  const maxBytes = maxKb * 1024;
  const actualKb = (stat.size / 1024).toFixed(1);

  if (stat.size <= 0) {
    console.error(`  [FAIL] Empty image file: ${relPath} (0 bytes)`);
    failed = true;
  } else if (stat.size > maxBytes) {
    console.error(
      `  [FAIL] Over budget: ${relPath} is ${actualKb} KB (${stat.size} B) > limit ${maxKb} KB (${maxBytes} B)`
    );
    failed = true;
  } else {
    console.log(`  [PASS] ${relPath}: ${actualKb} KB <= ${maxKb} KB (${stat.size} B)`);
  }
}

if (failed) {
  console.error("Image budget check failed.");
  process.exit(1);
}

console.log("All image budgets passed.");
