// app/shows/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";
import { blobReadJson } from "@/lib/blobJson";

export const runtime = "nodejs";
export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

type ShowEvent = {
  id: number;
  title: string;
  datetime_local: string; // ISO-ish
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

type ShowCache =
  | {
      generatedAt?: string;
      event?: ShowEvent;
    }
  | ShowEvent;

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://partyatredrocks.com";
const DCC = process.env.NEXT_PUBLIC_DCC_ORIGIN || "https://destinationcommandcenter.com";

function normId(s: string) {
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

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

function breadcrumbJsonLd(e: ShowEvent | null, id: number) {
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

function musicEventJsonLd(e: ShowEvent, id: number) {
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
    url: `${SITE}/book?event=${id}${venueSlug ? `&venue=${encodeURIComponent(venueSlug)}` : ""}`,
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
      { "@type": "PropertyValue", name: "seatgeekEventId", value: String(id) },
    ],
  };
}

function normalizeShow(raw: any): { generatedAt?: string; event?: ShowEvent } | null {
  if (!raw) return null;

  // wrapper shape
  if (raw?.event && typeof raw.event === "object") {
    return { generatedAt: raw.generatedAt, event: raw.event as ShowEvent };
  }

  // direct event shape
  if (typeof raw?.id !== "undefined" && typeof raw?.title === "string") {
    return { generatedAt: raw.generatedAt, event: raw as ShowEvent };
  }

  return null;
}

async function readShow(idNum: number) {
  const keys = [
    `cache/shows/${idNum}.json`,
    `cache/show/${idNum}.json`,
    `cache/events/${idNum}.json`,
  ];

  for (const key of keys) {
    try {
      const raw = await blobReadJson<ShowCache>(key, { revalidateSeconds: 300 });
      const norm = normalizeShow(raw);
      if (norm?.event) return norm;
    } catch {
      // try next key
    }
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: raw } = await params;
  const idNum = normId(raw);
  if (!idNum) {
    return {
      title: "Show | Party at Red Rocks",
      description: "Concert shuttle options and venue intel across Colorado.",
      robots: { index: false, follow: false },
    };
  }

  const data = await readShow(idNum);
  const e = data?.event ?? null;

  const title = pickTitle(e, String(idNum));
  const description = pickDescription(e);
  const url = `${SITE}/shows/${idNum}`;

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
  const idNum = normId(raw);
  if (!idNum) return notFound();

  const data = await readShow(idNum);
  const e = data?.event ?? null;

  // If the show doesn’t exist in cache yet, render a controlled “not ready” page (not 404),
  // but metadata will noindex it until synced.
  const venueSlug = e?.venue?.siteSlug;
  const venueName = e?.venue?.siteName || "Venue";
  const updatedAt = data?.generatedAt ?? null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(e, idNum)),
        }}
      />
      {e ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(musicEventJsonLd(e, idNum)),
          }}
        />
      ) : null}

      {/* HERO */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/80">
            Show Intel
          </div>

          {e?.datetime_local ? (
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
              {fmtDateTime(e.datetime_local)}
            </div>
          ) : null}

          {venueSlug ? (
            <Link
              href={`/venues/${venueSlug}`}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.06]"
              title="Venue intel"
            >
              {venueName} →
            </Link>
          ) : e?.venue?.siteName ? (
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
              {venueName}
            </div>
          ) : null}
        </div>

        <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight">
          {e?.title ? e.title : `Event ${idNum}`}
        </h1>

        <p className="mt-4 max-w-3xl text-white/70">
          {e
            ? "Tickets + ride options with clear meetup logic. Book a guaranteed ride home after the last song."
            : "This show hasn’t synced yet. Run the sync and refresh."}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/book?event=${idNum}${venueSlug ? `&venue=${encodeURIComponent(venueSlug)}` : ""}`}
            className="inline-flex items-center justify-center rounded-full bg-neon-blue px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-black transition hover:bg-white"
          >
            Ride Options
          </Link>

          <Link
            href="/week"
            className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/5 px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:bg-white/10"
          >
            This Week →
          </Link>

          {e?.url ? (
            <a
              href={e.url}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/5 px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:bg-white/10"
              title="Tickets"
            >
              Tickets →
            </a>
          ) : null}
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

      {/* PERFORMERS (quick GEO win: scannable entities) */}
      {e?.performers?.length ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
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
