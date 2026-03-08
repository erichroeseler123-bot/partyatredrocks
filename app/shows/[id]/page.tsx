// app/shows/[id]/page.tsx
import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";
import venuesJson from "@/data/venues.json";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";

export const runtime = "nodejs";
export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

type ShowEvent = {
  id: string;
  title: string;
  datetime_local: string; // ISO-ish
  dateKey: string;
  sourceId: string | null;
  url?: string; // ticket URL (SeatGeek, etc.)
  performers?: Array<{ name?: string; image?: string }>;
  venue?: {
    siteSlug?: string;
    siteName?: string;
    city?: string;
    state?: string;
    address1?: string;
    postalCode?: string;
    lat?: number;
    lon?: number;
    seatgeekVenueId?: number;
  };
};

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://partyatredrocks.com";
const DCC = process.env.NEXT_PUBLIC_DCC_ORIGIN || "https://destinationcommandcenter.com";
const EVENTS_SNAPSHOT_DIR = path.join(process.cwd(), "data", "snapshots", "events");

function safeDate(raw?: string) {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) ? d : null;
}

function fmtDateTime(raw: string) {
  const d = safeDate(raw);
  if (!d) return raw;
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function pickTitle(e?: ShowEvent | null, id?: string) {
  return e?.title ? `${e.title} | Shuttle & Venue Intel | Party at Red Rocks` : `Event ${id} | Party at Red Rocks`;
}

function pickDescription(e?: ShowEvent | null) {
  if (!e) {
    return "Concert shuttle options, venue intel, and weekly show guides across Denver, Boulder & Colorado Springs.";
  }
  const venue = e.venue?.siteName ? ` at ${e.venue.siteName}` : "";
  const when = e.datetime_local ? ` (${fmtDateTime(e.datetime_local)})` : "";
  return `${e.title}${venue}${when}. Tickets + shuttle ride options — book a guaranteed ride home after the show.`;
}

function breadcrumbJsonLd(e: ShowEvent | null, id: string) {
  const showName = e?.title || `Show ${id}`;
  const venueName = e?.venue?.siteName || "Venue";
  const venueSlug = e?.venue?.siteSlug;

  const items: any[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
    { "@type": "ListItem", position: 2, name: "This Week", item: `${SITE}/week` },
  ];

  if (venueSlug) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: venueName,
      item: `${SITE}/venues/${venueSlug}`,
    });
    items.push({
      "@type": "ListItem",
      position: 4,
      name: showName,
      item: `${SITE}/shows/${id}`,
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: showName,
      item: `${SITE}/shows/${id}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function musicEventJsonLd(e: ShowEvent, id: string) {
  const venueName = e.venue?.siteName || "Venue";
  const venueSlug = e.venue?.siteSlug;
  const venueUrl = venueSlug ? `${SITE}/venues/${venueSlug}` : undefined;

  const location: any = {
    "@type": "Place",
    name: venueName,
    url: venueUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: e.venue?.city || undefined,
      addressRegion: e.venue?.state || undefined,
      streetAddress: e.venue?.address1 || undefined,
      postalCode: e.venue?.postalCode || undefined,
      addressCountry: "US",
    },
    geo:
      typeof e.venue?.lat === "number" && typeof e.venue?.lon === "number"
        ? { "@type": "GeoCoordinates", latitude: e.venue.lat, longitude: e.venue.lon }
        : undefined,
  };

  const performers =
    (e.performers ?? [])
      .map((p) => p?.name)
      .filter(Boolean)
      .slice(0, 6)
      .map((name) => ({ "@type": "MusicGroup", name })) || [];

  // Keep offers conservative (accurate > aggressive):
  // - Ticket offer points to the ticket URL (no price).
  // - Shuttle offer points to your booking flow (no hard price; avoids being wrong).
  const offers: any[] = [];
  if (e.url) {
    offers.push({
      "@type": "Offer",
      name: "Tickets",
      url: e.url,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    });
  }
  offers.push({
    "@type": "Offer",
    name: "Shuttle Ride Options",
    url: `${SITE}/find?date=${encodeURIComponent(e.dateKey)}&qty=2`,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    seller: { "@id": `${SITE}/#organization` },
  });

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "@id": `${SITE}/shows/${id}#event`,
    name: e.title,
    startDate: e.datetime_local,
    url: `${SITE}/shows/${id}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    description: pickDescription(e),
    location,
    performer: performers.length ? performers : undefined,
    offers,
    organizer: { "@id": `${SITE}/#organization` },
    sameAs: [`${DCC}/shows/${id}`],
    identifier: [
      { "@type": "PropertyValue", name: "dccShowId", value: `dcc:show:${id}` },
      ...(e.sourceId ? [{ "@type": "PropertyValue", name: "seatgeekEventId", value: e.sourceId }] : []),
    ],
  };
}

type VenueRec = {
  city?: string;
  state?: string;
  address1?: string;
  postalCode?: string;
  lat?: number;
  lon?: number;
  seatgeekVenueId?: number;
};

function getVenueRec(slug: string): VenueRec {
  const row = (venuesJson as Record<string, any>)[slug];
  if (!row || typeof row !== "object") return {};
  return row as VenueRec;
}

function toShowEvent(event: Awaited<ReturnType<typeof getEventsCatalog>>[number]): ShowEvent {
  const venueSlug = event.venueId;
  const venueIdentity = VENUE_LEDGER_BY_SLUG.get(venueSlug);
  const venueMeta = getVenueRec(venueSlug);
  return {
    id: event.id,
    title: event.name,
    datetime_local: event.startLocal ?? event.startAt ?? `${event.dateKey}T19:00:00`,
    dateKey: event.dateKey,
    sourceId: event.sourceId,
    url: event.ticketUrl ?? undefined,
    performers: event.artistNames.map((name) => ({ name })),
    venue: {
      siteSlug: venueSlug,
      siteName: venueIdentity?.name ?? venueSlug,
      city: venueMeta.city,
      state: venueMeta.state,
      address1: venueMeta.address1,
      postalCode: venueMeta.postalCode,
      lat: venueMeta.lat,
      lon: venueMeta.lon,
      seatgeekVenueId: venueMeta.seatgeekVenueId,
    },
  };
}

async function readShow(id: string): Promise<{ generatedAt?: string; event?: ShowEvent } | null> {
  const all = await getEventsCatalog(2026, "all");
  const selected = all.find((event) => event.id === id || event.sourceId === id);
  if (!selected) return null;

  let generatedAt: string | undefined;
  try {
    const raw = await readFile(path.join(EVENTS_SNAPSHOT_DIR, "all-2026.json"), "utf8");
    const parsed = JSON.parse(raw) as { generatedAt?: string };
    generatedAt = typeof parsed.generatedAt === "string" ? parsed.generatedAt : undefined;
  } catch {
    generatedAt = undefined;
  }
  return { generatedAt, event: toShowEvent(selected) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: raw } = await params;
  const data = await readShow(raw);
  const e = data?.event ?? null;

  const title = pickTitle(e, raw);
  const description = pickDescription(e);
  const url = `${SITE}/shows/${encodeURIComponent(raw)}`;

  const keywords = Array.from(
    new Set([
      "concert shuttle",
      "Denver concert transportation",
      "Red Rocks shuttle",
      "party at red rocks",
      e?.venue?.siteName ? `${e.venue.siteName} shuttle` : "",
      ...(e?.performers ?? []).map((p) => p?.name || "").filter(Boolean),
    ].filter(Boolean))
  );

  return {
    title,
    description,
    keywords,
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
          alt: e?.title ? `${e.title} show intel` : "Show intel",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/og-default.jpg`],
    },
    robots: e
      ? { index: true, follow: true }
      : { index: false, follow: true }, // don’t index empty stubs if cache missing
  };
}

export default async function ShowPage({ params }: Props) {
  const { id: raw } = await params;
  const data = await readShow(raw);
  const e = data?.event ?? null;
  if (!e) return notFound();

  const venueSlug = e?.venue?.siteSlug;
  const venueName = e?.venue?.siteName || "Venue";
  const updatedAt = data?.generatedAt ?? null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(e, e.id)),
        }}
      />
      {e ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(musicEventJsonLd(e, e.id)),
          }}
        />
      ) : null}

      {/* HERO */}
      <div className="rounded-[32px] border border-soft panel p-8 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-full pill px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/80">
            Show Intel
          </div>

          {e?.datetime_local ? (
            <div className="inline-flex items-center rounded-full border border-soft panel px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
              {fmtDateTime(e.datetime_local)}
            </div>
          ) : null}

          {venueSlug ? (
            <Link
              href={`/venues/${venueSlug}`}
              className="inline-flex items-center rounded-full border border-soft panel px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/60 hover:bg-surface/40"
              title="Venue intel"
            >
              {venueName} →
            </Link>
          ) : e?.venue?.siteName ? (
            <div className="inline-flex items-center rounded-full border border-soft panel px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
              {venueName}
            </div>
          ) : null}
        </div>

        <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight">
          {e?.title ? e.title : `Event ${e.id}`}
        </h1>

        <p className="mt-4 max-w-3xl text-white/70">
          Tickets + ride options with clear meetup logic. Book a guaranteed ride home after the last song.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/find?date=${encodeURIComponent(e.dateKey)}&qty=2`}
            className="inline-flex items-center justify-center rounded-full bg-neon-blue px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-black transition hover:bg-surface/40"
          >
            Ride Options
          </Link>

          <Link
            href="/week"
            className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft"
          >
            This Week →
          </Link>

          {e?.url ? (
            <a
              href={e.url}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft"
              title="Tickets"
            >
              Tickets →
            </a>
          ) : null}
        </div>

        <div className="mt-4 text-xs text-white/45">
          Snapshot generated:{" "}
          {updatedAt ? (
            <time dateTime={updatedAt}>{updatedAt}</time>
          ) : (
            <>unknown</>
          )}
        </div>
      </div>

      {/* PERFORMERS (quick GEO win: scannable entities) */}
      {e?.performers?.length ? (
        <div className="mt-8 rounded-3xl border border-soft panel-soft p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
            Performers
          </div>
          <div className="mt-3 text-sm text-white/80">
            {e.performers
              .map((p) => p?.name)
              .filter(Boolean)
              .slice(0, 10)
              .join(" • ")}
          </div>
        </div>
      ) : null}

      {/* EXISTING WIDGETS */}
      <div className="mt-10 space-y-6">
        <TicketButtons />
        <RezdyWidgets />
      </div>
    </main>
  );
}
