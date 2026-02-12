import fs from "fs";
import path from "path";

const file = path.join(process.cwd(), "public/data/shows-2026.json");

const data = JSON.parse(fs.readFileSync(file, "utf8"));

const seen = new Map<string, number>();

for (const show of data) {
  let base = show.slug;

  if (!seen.has(base)) {
    seen.set(base, 1);
    continue;
  }

  const count = seen.get(base)! + 1;
  seen.set(base, count);

  const date = new Date(show.date)
    .toISOString()
    .slice(0, 10);

  show.slug = `${base}-${date}`;
}

fs.writeFileSync(
  file,
  JSON.stringify(data, null, 2)
);

console.log("✅ Slugs fixed");
