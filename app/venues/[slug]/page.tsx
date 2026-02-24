// app/venues/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { blobReadJson } from "@/lib/blobJson";

export const runtime = "nodejs";
export const revalidate = 300;

type VenueRec = {
  name?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  capacity?: number;
  kind?: string;
  region?: string;
  featured?: boolean;
  seatgeekSlug?: string;
  seatgeekVenueId?: number;
  lat?: number;
  lon?: number;
  address1?: string;
  postalCode?: string;
};

type VenueCache = {
  generatedAt: string;
  venue: {
    siteSlug: string;
    siteName: string;
    seatgeekVenueId?: number;
  };
  events: Array<{
    id: number;
    title: string;
    datetime_local: string;
    url?: string;
    performers?: Array<{ name?: string; image?: string }>;
    venue?: { siteSlug?: string; siteName?: string };
  }>;
};

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const DCC = process.env.NEXT_PUBLIC_DCC_ORIGIN || "https://destinationcommandcenter.com";

const SITE_KEYWORDS = [
  "Red Rocks shuttle",
  "Red Rocks transportation",
  "Red Rocks shuttle from Denver",
  "Red Rocks concert shuttle",
  "Denver concert shuttle",
  "concert transportation Denver",
  "party at red rocks",
];

function normSlug(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function getVenue(slug: string): VenueRec | null {
  const v = (venuesJson as Record<string, any>)[slug];
  return v ? (v as VenueRec) : null;
}

function displayName(slug: string, v: VenueRec) {
  return v?.name ?? slug.replace(/-/g, " ");
}

function cityLine(v: VenueRec) {
  const city = v?.city || "Denver";
  const state = v?.state || "CO";
  return `${city}, ${state}`;
}

function safeDate(raw?: string): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) ? d : null;
}

function venueTitle(slug: string, v: VenueRec) {
  return `${displayName(slug, v)} | Venue Intel + Shuttle Options | Party at Red Rocks`;
}

function venueDescription(slug: string, v: VenueRec) {
  const name = displayName(slug, v);
  const city = cityLine(v);
  const cap = v?.capacity ? `Capacity ~${v.capacity.toLocaleString()}. ` : "";
  return `${name} in ${city}. ${cap}Upcoming shows, venue intel, and shuttle/ride options across Denver, Boulder & Colorado Springs — book a guaranteed ride home after the show.`;
}

function venueKeywords(slug: string, v: VenueRec): string[] {
  const name = displayName(slug, v);
  const city = v?.city || "Denver";
  const state = v?.state || "CO";
  const kind = v?.kind ? [v.kind] : [];
  return Array.from(
    new Set([
      ...SITE_KEYWORDS,
      `${name} shows`,
      `${name} tickets`,
      `${name} shuttle`,
      `${city} concerts`,
      `${city} venue`,
      `${state} concerts`,
      ...kind,
    ])
  );
}

function breadcrumbJsonLd(slug: string, v: VenueRec) {
  const name = displayName(slug, v);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Venues", item: `${SITE}/venues` },
      { "@type": "ListItem", position: 3, name, item: `${SITE}/venues/${slug}` },
    ],
  };
}

function placeJsonLd(slug: string, v: VenueRec) {
  const name = displayName(slug, v);
  const city = v?.city ?? "Denver";
  const state = v?.state ?? "CO";

  const dccVenueId = `dcc:venue:us-${state.toLowerCase()}:${slug}`;
  const dccVenueUrl = `${DCC}/venues/${slug}`;

  const seatgeekSameAs =
    v?.seatgeekSlug ? [`https://seatgeek.com/venues/${v.seatgeekSlug}`] : [];

  const identifiers: any[] = [
    { "@type": "PropertyValue", name: "dccVenueId", value: dccVenueId },
  ];

  if (v?.seatgeekVenueId) {
    identifiers.push({
      "@type": "PropertyValue",
      name: "seatgeekVenueId",
      value: String(v.seatgeekVenueId),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${SITE}/venues/${slug}#place`,
    name,
    url: `${SITE}/venues/${slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: v?.address1 || undefined,
      addressLocality: city,
      addressRegion: state,
      postalCode: v?.postalCode || undefined,
      addressCountry: "US",
    },
    geo:
      typeof v?.lat === "number" && typeof v?.lon === "number"
        ? {
            "@type": "GeoCoordinates",
            latitude: v.lat,
            longitude: v.lon,
          }
        : undefined,
    maximumAttendeeCapacity: v?.capacity ? Number(v.capacity) : undefined,
    sameAs: [dccVenueUrl, ...seatgeekSameAs].filter(Boolean),
    identifier: identifiers,
  };
}

function eventsItemListJsonLd(slug: string, v: VenueRec, events: VenueCache["events"]) {
  const name = displayName(slug, v);
  const city = v?.city ?? "Denver";
  const state = v?.state ?? "CO";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Upcoming events at ${name}`,
    itemListElement: (events ?? []).slice(0, 12).map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MusicEvent",
        "@id": `${SITE}/shows/${e.id}#event`,
        name: e.title,
        startDate: e.datetime_local,
        url: `${SITE}/shows/${e.id}`,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          "@id": `${SITE}/venues/${slug}#place`,
          name,
          address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressRegion: state,
            addressCountry: "US",
          },
        },
        performer: (e.performers ?? [])
          .map((p) => p?.name)
          .filter(Boolean)
          .slice(0, 4)
          .map((n) => ({ "@type": "MusicGroup", name: n })),
        offers: {
          "@type": "Offer",
          name: "Shuttle Ride Options",
          url: `${SITE}/book?venue=${slug}&event=${e.id}`,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

function venueFaqJsonLd(slug: string, v: VenueRec) {
  const name = displayName(slug, v);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do you run shuttles to ${name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes — we cover Denver, Boulder, and Colorado Springs venues. Choose your show and book a guaranteed ride home (no surge, clear meetup plan).",
        },
      },
      {
        "@type": "Question",
        name: "Where are pickups?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Pickups are typically staged in common Denver-area hubs (and scene-appropriate meetup points). Your confirmation includes the exact pickup window and location.",
        },
      },
      {
        "@type": "Question",
        name: "What happens after the show?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "We use a post-show meetup protocol and a waiting window so your group exits cleanly without getting trapped in rideshare surge traffic.",
        },
      },
      {
        "@type": "Question",
        name: "Do you cover private SUVs/Suburbans?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes — private options are available for groups. You’ll see private upgrades during booking if offered for that venue/date.",
        },
      },
    ],
  };
}

export async function generateStaticParams() {
  return Object.keys(venuesJson as Record<string, any>).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normSlug(rawSlug);
  const v = getVenue(slug);

  if (!v) {
    return {
      title: "Venue | Party at Red Rocks",
      description:
        "Denver, Boulder & Colorado Springs concert shuttles, venue guides, and weekly show intel.",
      robots: { index: true, follow: true },
    };
  }

  const title = venueTitle(slug, v);
  const description = venueDescription(slug, v);
  const url = `${SITE}/venues/${slug}`;

  return {
    title,
    description,
    keywords: venueKeywords(slug, v),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Party at Red Rocks",
      type: "website",
      images: [
        {
          url: `${SITE}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: `${displayName(slug, v)} venue intel`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/og-default.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normSlug(rawSlug);
  const v = getVenue(slug);
  if (!v) return notFound();

  let cache: VenueCache | null = null;
  try {
    cache = await blobReadJson<VenueCache>(`cache/venues/${slug}.json`, {
      revalidateSeconds: 300,
    });
  } catch {
    cache = null;
  }

  const name = displayName(slug, v);
  const city = cityLine(v);
  const dccVenueUrl = `${DCC}/venues/${slug}`;

  const now = new Date();

  // clean + stable: upcoming only, dedupe, sort asc
  const events = (() => {
    const seen = new Set<number>();
    const list = (cache?.events ?? [])
      .filter((e) => Number.isFinite(Number(e?.id)) && !!e?.datetime_local)
      .map((e) => ({ e, dt: safeDate(e.datetime_local) }))
      .filter(({ dt }) => dt && dt >= now)
      .sort((a, b) => (a.dt!.getTime() - b.dt!.getTime()))
      .map(({ e }) => e);

    const out: VenueCache["events"] = [];
    for (const e of list) {
      const id = Number(e.id);
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(e);
      if (out.length >= 24) break;
    }
    return out;
  })();

  const updatedAt = cache?.generatedAt ?? null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* JSON-LD (high impact for SEO + GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(slug, v)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(placeJsonLd(slug, v)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventsItemListJsonLd(slug, v, events)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(venueFaqJsonLd(slug, v)),
        }}
      />

      {/* HERO */}
      <div className="rounded-[32px] border border-soft panel p-8 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-full pill px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/80">
            Venue Intel
          </div>

          <div className="inline-flex items-center rounded-full border border-soft panel px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
            {city}
          </div>

          {v?.kind ? (
            <div className="inline-flex items-center rounded-full border border-soft panel px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
              {v.kind}
            </div>
          ) : null}

          {v?.capacity ? (
            <div className="inline-flex items-center rounded-full border border-soft panel px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
              ~{v.capacity.toLocaleString()} cap
            </div>
          ) : null}
        </div>

        <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight">{name}</h1>

        <p className="mt-4 max-w-3xl text-white/70">
          Upcoming shows, post-show pickup logic, and ride options. We cover Denver, Boulder, and
          Colorado Springs — book a guaranteed ride home after the last song.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/book?venue=${slug}`}
            className="inline-flex items-center justify-center rounded-full bg-neon-blue px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-black transition hover:bg-surface/40"
          >
            Book this venue
          </Link>

          <Link
            href="/week"
            className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft"
          >
            This Week →
          </Link>

          <a
            href={dccVenueUrl}
            target="_blank"
            rel="nofollow noopener"
            className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft"
            title="Authority intel (DCC)"
          >
            Deep Intel (DCC) →
          </a>
        </div>

        <div className="mt-4 text-xs text-white/45">
          Feed updated:{" "}
          {updatedAt ? (
            <time dateTime={updatedAt}>{updatedAt}</time>
          ) : (
            <>
              not synced yet (run{" "}
              <code className="text-white/80">/api/cron/sync?secret=...</code>)
            </>
          )}
        </div>
      </div>

      {/* 3-CARD INTEL */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-soft panel-soft p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
            Pickup Strategy
          </div>
          <p className="mt-3 text-sm text-white/75">
            Pre-show arrival buffer, meetup clarity, and a clean staging plan so you’re not stuck in
            last-minute surge chaos.
          </p>
        </div>

        <div className="rounded-3xl border border-soft panel-soft p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
            Return Plan
          </div>
          <p className="mt-3 text-sm text-white/75">
            Post-show waiting + a meet-up protocol built for fast exits and predictable departures.
          </p>
        </div>

        <div className="rounded-3xl border border-soft panel-soft p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
            Options
          </div>
          <p className="mt-3 text-sm text-white/75">
            Shared seats + private upgrades depending on show night demand. See ride options on the
            event page.
          </p>
          <Link href="/venues" className="mt-4 inline-flex text-sm font-bold text-white/80 hover:text-white">
            Browse all venues →
          </Link>
        </div>
      </div>

      {/* EVENTS */}
      {events.length > 0 ? (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-black">Upcoming at {name}</h2>
            <div className="text-xs text-white/50">Showing {events.length} events</div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-5">
            {events.slice(0, 10).map((e) => (
              <div
                key={e.id}
                className="rounded-3xl border border-soft panel-soft p-5 hover:bg-surface/40 transition"
              >
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
                  {new Date(e.datetime_local).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>

                <div className="mt-2 text-lg font-black">{e.title}</div>

                <div className="mt-2 text-sm text-white/70">
                  {(e.performers ?? []).map((p) => p?.name).filter(Boolean).join(", ")}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link className="text-neon-blue font-bold" href={`/shows/${e.id}`}>
                    Full Intel →
                  </Link>
                  <Link className="text-white/70 underline" href={`/book?event=${e.id}&venue=${slug}`}>
                    Ride Options
                  </Link>
                  {e.url ? (
                    <a className="text-white/70 underline" href={e.url} target="_blank" rel="nofollow noopener">
                      Tickets →
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shuttles/all-venue"
              className="inline-flex items-center justify-center rounded-full pill px-6 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft"
            >
              All-Venue Shuttle
            </Link>
            <Link
              href={`/book?venue=${slug}`}
              className="inline-flex items-center justify-center rounded-full bg-neon-blue px-6 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-black transition hover:bg-surface/40"
            >
              Book Now
            </Link>
          </div>
        </section>
      ) : (
        <div className="mt-10 rounded-3xl border border-soft panel p-6 text-white/70">
          <span className="font-black">Upcoming at {name}:</span> Not synced yet. Run{" "}
          <code className="text-white/85">/api/cron/sync</code>.
        </div>
      )}
    </main>
  );
}
