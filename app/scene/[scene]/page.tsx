// app/scene/[scene]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blobReadJson } from "@/lib/blobJson";
import { SCENES } from "@/data/scenes";

export const runtime = "nodejs";
export const revalidate = 300;

type Props = { params: Promise<{ scene: string }> };

type SceneDef = {
  slug: string;
  title: string;
  tagline: string;
  description?: string;
  keywords?: string[];
  emoji?: string;
  accentColor?: string;
  priority?: number;
};

type SceneEvent = {
  id: number;
  title: string;
  datetime_local: string; // ISO string
  url?: string;
  performers?: Array<{ name?: string; image?: string }>;
  venue?: { siteSlug?: string; siteName?: string };
};

type ScenePayload = {
  generatedAt: string;
  events: SceneEvent[];
};

const SITE =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://partyatredrocks.com";

const DCC =
  process.env.NEXT_PUBLIC_DCC_ORIGIN || "https://destinationcommandcenter.com";

function safeIso(d: string) {
  const t = Date.parse(d);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

function formatDate(d: string) {
  // Avoid server locale inconsistencies by specifying everything.
  const t = Date.parse(d);
  if (!Number.isFinite(t)) return "Date TBD";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(t));
}

function formatTime(d: string) {
  const t = Date.parse(d);
  if (!Number.isFinite(t)) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(t));
}

export async function generateStaticParams() {
  return SCENES.map((s: any) => ({ scene: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scene } = await params;
  const def = (SCENES as any[]).find((s) => s.slug === scene) as SceneDef | undefined;

  // If invalid slug: let the page 404, but metadata should still be sane.
  if (!def) {
    return {
      title: "Scene Hub | Party at Red Rocks",
      description:
        "Denver, Boulder & Colorado Springs concert shuttles, venue guides, and weekly show intel.",
      robots: { index: false, follow: true },
    };
  }

  const url = `${SITE}/scene/${def.slug}`;
  const title = `${def.title} | Party at Red Rocks`;
  const description = def.description || def.tagline;

  return {
    title,
    description,
    keywords: def.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Party at Red Rocks",
      type: "website",
      images: [{ url: `${SITE}/og-default.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/og-default.jpg`],
    },
    robots: { index: true, follow: true },
  };
}

function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "Party at Red Rocks",
    url: SITE,
    logo: `${SITE}/og-default.jpg`,
  };
}

function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: "Party at Red Rocks",
    publisher: { "@id": `${SITE}/#organization` },
  };
}

function sceneJsonLd(def: SceneDef, pageUrl: string, events: SceneEvent[]) {
  const top = (events ?? []).slice(0, 12);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: `${def.title} — Upcoming Shows & Shuttle Intel`,
    description: def.description || def.tagline,
    isPartOf: { "@id": `${SITE}/#website` },
    publisher: { "@id": `${SITE}/#organization` },
    about: [
      { "@type": "Thing", name: def.title },
      { "@type": "Thing", name: "Colorado concerts" },
      { "@type": "Thing", name: "Shuttle transportation" },
    ],
    sameAs: [`${DCC}/scene/${def.slug}`],
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: top.length,
      itemListElement: top.map((e, i) => {
        const venueUrl = e.venue?.siteSlug ? `${SITE}/venues/${e.venue.siteSlug}` : null;

        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "MusicEvent",
            "@id": `${SITE}/shows/${e.id}#event`,
            name: e.title,
            startDate: safeIso(e.datetime_local) ?? e.datetime_local,
            url: `${SITE}/shows/${e.id}`,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: e.venue?.siteName
              ? {
                  "@type": "Place",
                  name: e.venue.siteName,
                  ...(venueUrl ? { url: venueUrl } : {}),
                }
              : undefined,
            performer: (e.performers ?? [])
              .map((p) => p?.name)
              .filter(Boolean)
              .slice(0, 4)
              .map((name) => ({ "@type": "MusicGroup", name })),
            offers: {
              "@type": "Offer",
              name: "Shuttle Ride Options",
              url: `${SITE}/book?event=${e.id}&scene=${def.slug}`,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              seller: { "@id": `${SITE}/#organization` },
            },
          },
        };
      }),
    },
  };
}

export default async function SceneHub({ params }: Props) {
  const { scene } = await params;
  const def = (SCENES as any[]).find((s) => s.slug === scene) as SceneDef | undefined;
  if (!def) return notFound();

  const payload = await blobReadJson<ScenePayload>(`cache/scene/${scene}.json`, {
    revalidateSeconds: 300,
  });

  const events = payload?.events ?? [];
  const pageUrl = `${SITE}/scene/${scene}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sceneJsonLd(def, pageUrl, events)),
        }}
      />

      <div className="rounded-[32px] border border-soft panel p-8 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div
          className="inline-flex items-center gap-2 rounded-full pill px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/80"
          style={def.accentColor ? { borderColor: def.accentColor } : undefined}
        >
          Scene Hub • {def.emoji ? <span>{def.emoji}</span> : null} {def.slug}
        </div>

        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
          {def.title}
        </h1>

        <p className="mt-4 max-w-3xl text-white/70">{def.tagline}</p>

        {def.description ? (
          <p className="mt-3 max-w-3xl text-sm text-white/55">{def.description}</p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/book?scene=${def.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-neon-blue px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-black transition hover:bg-surface/40"
          >
            Book Shuttle
          </Link>

          <Link
            href="/venues"
            className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft"
          >
            Browse Venues →
          </Link>

          <a
            href={`${DCC}/scene/${def.slug}`}
            target="_blank"
            rel="nofollow noopener"
            className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft"
            title="Authority intel (DCC)"
          >
            Deep Intel (DCC) →
          </a>
        </div>

        <div className="mt-4 text-xs text-white/45">
          Feed updated: {payload?.generatedAt ?? "not synced yet"} (run /api/cron/sync)
        </div>
      </div>

      {events.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-soft panel p-8 text-white/70">
          No upcoming shows found for this scene yet. Run <span className="text-white/90">/api/cron/sync</span>{" "}
          to refresh the feed.
        </div>
      ) : (
        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <div
              key={e.id}
              className="rounded-3xl border border-soft panel p-6 transition hover:bg-surface/40"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
                  {formatDate(e.datetime_local)}
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/45">
                  {formatTime(e.datetime_local)}
                </div>
              </div>

              <h3 className="mt-2 text-xl font-black">{e.title}</h3>

              <p className="mt-1 text-sm text-white/70">
                {e.venue?.siteName ?? "Venue"}{" "}
                {e.venue?.siteSlug ? (
                  <span className="text-white/50">
                    •{" "}
                    <Link className="underline" href={`/venues/${e.venue.siteSlug}`}>
                      Venue intel
                    </Link>
                  </span>
                ) : null}
              </p>

              <p className="mt-3 text-sm text-white/70">
                {(e.performers ?? []).map((p) => p?.name).filter(Boolean).join(", ")}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="font-bold text-neon-blue" href={`/shows/${e.id}`}>
                  Full Intel →
                </Link>

                {e.url ? (
                  <a
                    className="text-white/70 underline"
                    href={e.url}
                    target="_blank"
                    rel="nofollow noopener"
                  >
                    Tickets →
                  </a>
                ) : null}

                <Link className="text-white/70 underline" href={`/book?event=${e.id}&scene=${def.slug}`}>
                  Ride Options
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
