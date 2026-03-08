import { NextResponse } from "next/server";
import { VENUE_SLUGS } from "@/lib/venues";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";

type UrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toXml(entries: UrlEntry[]) {
  const items = entries
    .map((u) => {
      const lastmod = u.lastmod ? `\n    <lastmod>${esc(u.lastmod)}</lastmod>` : "";
      const changefreq = u.changefreq ? `\n    <changefreq>${esc(u.changefreq)}</changefreq>` : "";
      const priority = typeof u.priority === "number" ? `\n    <priority>${u.priority.toFixed(1)}</priority>` : "";
      return `  <url>\n    <loc>${esc(u.loc)}</loc>${lastmod}${changefreq}${priority}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    items +
    `\n</urlset>\n`;
}

export const revalidate = 300;

export async function GET() {
  const base = "https://www.partyatredrocks.com";
  const now = new Date().toISOString();

  const urls: UrlEntry[] = [
    { loc: `${base}/`, lastmod: now, changefreq: "daily", priority: 1.0 },
    { loc: `${base}/week`, lastmod: now, changefreq: "hourly", priority: 0.9 },
    { loc: `${base}/venues`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/find`, lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: `${base}/red-rocks`, lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: `${base}/red-rocks/transportation`, lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: `${base}/red-rocks/parking`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/red-rocks/faq`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/month/red-rocks`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/2026/red-rocks-concerts`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/red-rocks/concert-guide`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/red-rocks/concerts`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/red-rocks/weather`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/red-rocks/what-to-wear`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/red-rocks/visiting-guide`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/red-rocks/hiking-trails`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/red-rocks/geology`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/red-rocks/wildlife`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/red-rocks/camping-nearby`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/ogden-theatre/concerts`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/venues/ogden-theatre/concerts/june`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/ogden-theatre/concerts/july`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/ogden-theatre/concerts/august`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/gothic-theatre/concerts`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/venues/bluebird-theater/concerts`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/venues/bluebird-theater/concerts/june`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/bluebird-theater/concerts/july`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/bluebird-theater/concerts/august`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/paramount-theatre/concerts`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/venues/paramount-theatre/concerts/june`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/paramount-theatre/concerts/july`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/paramount-theatre/concerts/august`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/summit-music-hall/concerts`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/venues/summit-music-hall/concerts/june`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/summit-music-hall/concerts/july`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/summit-music-hall/concerts/august`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/levitt-pavilion-denver/concerts`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/venues/levitt-pavilion-denver/concerts/june`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/levitt-pavilion-denver/concerts/july`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/levitt-pavilion-denver/concerts/august`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/1stbank-center/concerts`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/venues/1stbank-center/concerts/june`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/1stbank-center/concerts/july`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/1stbank-center/concerts/august`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/mission-ballroom/concerts`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/venues/mission-ballroom/concerts/june`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/mission-ballroom/concerts/july`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/venues/mission-ballroom/concerts/august`, lastmod: now, changefreq: "weekly", priority: 0.7 },

    // scenes (keep if these routes exist)
    { loc: `${base}/scene/jam`, lastmod: now, changefreq: "hourly", priority: 0.8 },
    { loc: `${base}/scene/edm`, lastmod: now, changefreq: "hourly", priority: 0.8 },
    { loc: `${base}/scene/hiphop`, lastmod: now, changefreq: "hourly", priority: 0.8 },
  ];

  // venue detail pages
  for (const slug of VENUE_SLUGS) {
    urls.push({
      loc: `${base}/venues/${slug}`,
      lastmod: now,
      changefreq: "hourly",
      priority: 0.7,
    });
    urls.push({
      loc: `${base}/venues/${slug}/best-time-to-arrive`,
      lastmod: now,
      changefreq: "weekly",
      priority: 0.7,
    });
    urls.push({
      loc: `${base}/venues/${slug}/what-to-wear`,
      lastmod: now,
      changefreq: "weekly",
      priority: 0.7,
    });
    urls.push({
      loc: `${base}/venues/${slug}/transportation`,
      lastmod: now,
      changefreq: "weekly",
      priority: 0.7,
    });
  }

  // programmatic red rocks authority pages
  for (const page of RED_ROCKS_ENTITIES) {
    urls.push({
      loc: `${base}/red-rocks/${page.slug}`,
      lastmod: now,
      changefreq: "weekly",
      priority: page.category === "transportation" ? 0.9 : 0.7,
    });
  }

  return new NextResponse(toXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
