import { NextResponse } from "next/server";

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
    { loc: `${base}/shuttles`, lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: `${base}/book/red-rocks-amphitheatre`, lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: `${base}/book/red-rocks-amphitheatre/custom/shared`, lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: `${base}/book/red-rocks-amphitheatre/private`, lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: `${base}/red-rocks/transportation`, lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: `${base}/red-rocks/transportation/shuttle-vs-uber`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/red-rocks/transportation/shuttle-vs-driving`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/red-rocks/transportation/private-vs-shared`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/red-rocks/transportation/is-shuttle-worth-it`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/guide/local/denver-pickups`, lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: `${base}/guide/local/trailhead-taphouse`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${base}/guide/parking`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/guide/tailgating`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/guide/show-night-strategy`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/guide/show-night-strategy/post-show-pickup-plan`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/guide/logistics/bag-policy`, lastmod: now, changefreq: "daily", priority: 0.8 },
  ];

  return new NextResponse(toXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
