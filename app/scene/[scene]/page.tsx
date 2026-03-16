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
      title: "Music Scenes | Party at Red Rocks",
      description:
        "Browse Colorado music scenes, upcoming shows, and venues connected to Red Rocks and Denver concerts.",
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
    name: `${def.title} — Upcoming Shows`,
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
              name: "Shuttle booking",
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
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
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
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-4xl">
            <div
              className="inline-flex items-center gap-2 rounded-full border bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white"
              style={def.accentColor ? { borderColor: `${def.accentColor}66`, color: def.accentColor } : undefined}
            >
              <span>Music scene</span>
              {def.emoji ? <span>{def.emoji}</span> : null}
              <span>{def.slug}</span>
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              {def.title}
            </h1>
            <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/74 sm:text-lg">
              {def.description || def.tagline}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shuttles"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
              >
                See Shuttle Options
              </Link>
              <Link
                href="/venues"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Browse Venues
              </Link>
              <Link
                href="/week"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Browse Shows
              </Link>
            </div>
            <div className="mt-5 text-xs text-white/45">
              Updated: {payload?.generatedAt ?? "not synced yet"}
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Scene Links
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/artists"
              className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
            >
              Artists
            </Link>
            <a
              href={`${DCC}/scene/${def.slug}`}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
              title="More scene guides"
            >
              More Guides
            </a>
            {def.slug === "bluegrass" ? (
              <Link
                href="/scene/bluegrass/festivals"
                className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
              >
                Festival Guide
              </Link>
            ) : null}
            {def.slug === "jam" ? (
              <Link
                href="/phish-folsom"
                className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
              >
                Phish Folsom Guide
              </Link>
            ) : null}
            {def.slug === "jam" ? (
              <Link
                href="/dead-and-company-red-rocks"
                className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
              >
                Dead & Company Guide
              </Link>
            ) : null}
          </div>
        </section>

        {events.length === 0 ? (
          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 text-white/70 sm:p-8">
            No upcoming shows are listed for this scene yet.
          </section>
        ) : (
          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Upcoming Shows
            </div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
              {def.title} on the calendar
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Open any show for details, venue context, and ride planning.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {events.map((e) => (
                <article
                  key={e.id}
                  className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                      {formatDate(e.datetime_local)}
                    </div>
                    <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/45">
                      {formatTime(e.datetime_local)}
                    </div>
                  </div>

                  <h3 className="mt-3 text-2xl font-black text-white">{e.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {e.venue?.siteName ?? "Venue"}
                    {e.venue?.siteSlug ? (
                      <>
                        {" "}
                        •{" "}
                        <Link className="font-bold text-[#ffb07c] hover:text-white" href={`/venues/${e.venue.siteSlug}`}>
                          Venue page
                        </Link>
                      </>
                    ) : null}
                  </p>

                  {(e.performers ?? []).length ? (
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      {(e.performers ?? []).map((p) => p?.name).filter(Boolean).join(", ")}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      className="inline-flex min-h-11 items-center rounded-full bg-[#3df3ff] px-4 text-xs font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
                      href={`/shows/${e.id}`}
                    >
                      Show Details
                    </Link>
                    {e.url ? (
                      <a
                        className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
                        href={e.url}
                        target="_blank"
                        rel="nofollow noopener"
                      >
                        Tickets
                      </a>
                    ) : null}
                    <Link
                      className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
                      href="/shuttles"
                    >
                      Shuttle Options
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
