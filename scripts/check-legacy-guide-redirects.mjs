#!/usr/bin/env node

const base = process.argv[2] || "http://localhost:3000";

const cases = [
  ["/guide/post-encore-strategy", "/guide/show-night-strategy/post-show-pickup-plan"],
  ["/guide/bag-policy-2026", "/guide/logistics/bag-policy"],
  ["/guide/sheraton-pickup", "/guide/local/denver-pickups"],
];

function normalizeLocation(value) {
  if (!value) return "";
  try {
    const u = new URL(value, base);
    return `${u.pathname}${u.search}`;
  } catch {
    return value;
  }
}

let failed = false;

for (const [fromPath, expectedPath] of cases) {
  const fromUrl = new URL(fromPath, base).toString();
  const res = await fetch(fromUrl, { method: "GET", redirect: "manual" });
  const status = res.status;
  const locationHeader = res.headers.get("location");
  const actualPath = normalizeLocation(locationHeader);

  const redirectOk = status >= 300 && status < 400;
  const locationOk = actualPath === expectedPath;

  if (!redirectOk || !locationOk) {
    failed = true;
    console.error(
      `FAIL ${fromPath} -> expected ${expectedPath}, got status=${status}, location=${actualPath || "none"}`
    );
  } else {
    console.log(`OK   ${fromPath} -> ${expectedPath} (status ${status})`);
  }
}

if (failed) process.exit(1);
console.log("All legacy guide redirects passed.");
