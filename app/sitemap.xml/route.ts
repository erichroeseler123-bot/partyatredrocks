import { NextResponse } from "next/server";

export const revalidate = 300;

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
      const lastmod = u.lastmod ? `<lastmod>${esc(u.lastmod)}</lastmod>` : "";
      const changefreq = u.changefreq
        ? `<changefreq>${esc(u.changefreq)}</changefreq>`
        : "";
      const priority =
        typeof u.priority === "number"
          ? `<priority>${u.priority.toFixed(1)}</priority>`
          : "";
      return `<url><loc>${esc(u.loc)}</loc>${lastmod}${changefreq}${priority}</url>`;
    })
    .join("");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    items +
    `</urlset>`
  );
}

export async function GET() {
  const base = "https://www.partyatredrocks.com";
  const now = new Date().toISOString();

  const urls: UrlEntry[] = [
    { loc: `${base}/`, lastmod: now, changefreq: "daily", priority: 1.0 },
    { loc: `${base}/week`, lastmod: now, changefreq: "hourly", priority: 0.9 },
    { loc: `${base}/venues`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { loc: `${base}/scene/jam`, lastmod: now, changefreq: "hourly", priority: 0.8 },
    { loc: `${base}/scene/edm`, lastmod: now, changefreq: "hourly", priority: 0.8 },
    { loc: `${base}/scene/hiphop`, lastmod: now, changefreq: "hourly", priority: 0.8 },
  ];

  return new NextResponse(toXml(urls), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
