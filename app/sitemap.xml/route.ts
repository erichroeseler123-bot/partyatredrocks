import { NextResponse } from "next/server";
import { getDenverDateKey, getEventsCatalog } from "@/lib/events/getCatalog";
import { RED_ROCKS_ENTITIES } from "@/lib/redRocksAuthority";
import { ACTIVE_PARR_VENUE_SLUGS } from "@/lib/servedVenues";
import { evaluateFutureRedRocksShowGate } from "@/lib/seo/indexationGate";

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

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    items +
    `\n</urlset>\n`
  );
}

export const revalidate = 1800;

const RETIRED_COMPARISON_PREFIXES = ["private-vs-", "shuttle-vs", "how-to-get-to-red-rocks", "red-rocks-shuttle"];

export async function GET() {
  const base = "https://www.partyatredrocks.com";
  const lastmod = "2026-11-18";

  const corePaths: Array<{ path: string; changefreq: string; priority: number }> = [
    { path: "/", changefreq: "daily", priority: 1.0 },
    { path: "/book/red-rocks-amphitheatre/private", changefreq: "daily", priority: 0.9 },
    { path: "/book/red-rocks-amphitheatre/private/suv", changefreq: "daily", priority: 0.9 },
    { path: "/book/red-rocks-amphitheatre/private/van", changefreq: "daily", priority: 0.9 },
    { path: "/red-rocks", changefreq: "weekly", priority: 0.9 },
    { path: "/red-rocks/concerts", changefreq: "daily", priority: 0.9 },
    { path: "/red-rocks/concerts/june", changefreq: "weekly", priority: 0.8 },
    { path: "/red-rocks/concerts/july", changefreq: "weekly", priority: 0.8 },
    { path: "/red-rocks/concerts/august", changefreq: "weekly", priority: 0.8 },
    { path: "/red-rocks/what-to-wear", changefreq: "weekly", priority: 0.9 },
    { path: "/red-rocks/weather", changefreq: "weekly", priority: 0.8 },
    { path: "/red-rocks/post-concert-exit-guide", changefreq: "weekly", priority: 0.8 },
    { path: "/red-rocks/transportation", changefreq: "weekly", priority: 0.9 },
    { path: "/red-rocks/shuttle", changefreq: "weekly", priority: 0.9 },
    { path: "/red-rocks/car-service", changefreq: "weekly", priority: 0.8 },
    { path: "/red-rocks/group-transportation", changefreq: "weekly", priority: 0.8 },
    { path: "/red-rocks/parking", changefreq: "weekly", priority: 0.8 },
    { path: "/red-rocks/seating-chart", changefreq: "monthly", priority: 0.8 },
    { path: "/red-rocks/map", changefreq: "monthly", priority: 0.8 },
    { path: "/guide", changefreq: "weekly", priority: 0.8 },
    { path: "/guide/tailgating", changefreq: "weekly", priority: 0.8 },
    { path: "/guide/parking", changefreq: "weekly", priority: 0.8 },
    { path: "/guide/parking/best-lots", changefreq: "monthly", priority: 0.7 },
    { path: "/guide/local/denver-pickups", changefreq: "weekly", priority: 0.9 },
    { path: "/guide/show-night-strategy", changefreq: "weekly", priority: 0.8 },
    { path: "/guide/show-night-strategy/post-show-pickup-plan", changefreq: "weekly", priority: 0.8 },
    { path: "/guide/logistics/bag-policy", changefreq: "weekly", priority: 0.8 },
    { path: "/guide/compare", changefreq: "weekly", priority: 0.8 },
    { path: "/guide/transportation", changefreq: "weekly", priority: 0.8 },
    { path: "/guide/denver-concert-transportation", changefreq: "weekly", priority: 0.8 },
    { path: "/guide/red-rocks-faq", changefreq: "monthly", priority: 0.7 },
    { path: "/venues", changefreq: "weekly", priority: 0.8 },
    ...ACTIVE_PARR_VENUE_SLUGS.map((slug) => ({
      path: `/venues/${slug}`,
      changefreq: slug === "red-rocks-amphitheatre" ? "weekly" : "monthly",
      priority: slug === "red-rocks-amphitheatre" ? 0.9 : slug === "mishawaka-amphitheatre" ? 0.7 : 0.6,
    })),
    { path: "/about", changefreq: "monthly", priority: 0.7 },
    { path: "/contact", changefreq: "monthly", priority: 0.7 },
  ];

  const seen = new Set<string>();
  const urls: UrlEntry[] = [];

  function pushPath(p: string, changefreq: string, priority: number) {
    const loc = p === "/" ? `${base}/` : `${base}${p}`;
    if (seen.has(loc)) return;
    seen.add(loc);
    urls.push({ loc, lastmod, changefreq, priority });
  }

  for (const row of corePaths) {
    pushPath(row.path, row.changefreq, row.priority);
  }

  for (const entity of RED_ROCKS_ENTITIES) {
    const skip = RETIRED_COMPARISON_PREFIXES.some((prefix) => entity.slug.startsWith(prefix));
    if (skip) continue;
    pushPath(`/red-rocks/${entity.slug}`, "monthly", 0.7);
  }

  // Note (SEO Gate 3): Historical 2026 Red Rocks show pages are intentionally held out of
  // /sitemap.xml until full post-show setlist/archive recaps are populated; only verified
  // future 2027 Red Rocks shows passing all 7 gate criteria are included in the XML sitemap.
  const todayDenverKey = getDenverDateKey();
  const events2027 = await getEventsCatalog(2027, "redrocks");
  for (const ev of events2027) {
    if (ev.venueId !== "red-rocks-amphitheatre") continue;
    const ext = ev as typeof ev & { sourceUrl?: string | null; doorsAt?: string | null };
    const gate = evaluateFutureRedRocksShowGate({
      id: ev.id,
      title: ev.name,
      venueSlug: ev.venueId,
      dateKey: ev.dateKey,
      todayDenverKey,
      performers: ev.artistNames,
      officialSourceUrl: ext.sourceUrl ?? null,
      ticketUrl: ev.ticketUrl ?? null,
      hasExplicitStartTime: Boolean(ev.startLocal && /T\d{2}:\d{2}/.test(ev.startLocal)),
      hasExplicitDoorTime: Boolean(ext.doorsAt),
      bookingHref: `/book/red-rocks-amphitheatre/private?date=${encodeURIComponent(ev.dateKey)}&event=${encodeURIComponent(ev.id)}`,
      hasOperatorLogisticsSection: true,
      hasHonestTimeLabel: true,
    });
    if (gate.passesAll) {
      pushPath(`/shows/${encodeURIComponent(ev.id)}`, "weekly", 0.7);
    }
  }

  return new NextResponse(toXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
    },
  });
}
