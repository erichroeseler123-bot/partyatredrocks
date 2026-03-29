// app/shows/[id]/page.tsx
import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import TicketButtons from "@/components/TicketButtons";
import venuesJson from "@/data/venues.json";
import { getArtistsCatalog, getEventsCatalog } from "@/lib/events/getCatalog";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import { getMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";
import { buildBookingHref } from "@/lib/parrHandoff";

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

type SetlistSong = { name?: string; with?: { name?: string }; cover?: { name?: string } };
type SetlistDoc = { sets?: { set?: Array<{ song?: SetlistSong[] }> } };

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

function fmtDate(raw: string) {
  const d = safeDate(raw);
  if (!d) return raw;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function bookingUrlForEvent(e?: ShowEvent | null) {
  const venueSlug = e?.venue?.siteSlug;
  if (!venueSlug) return `${SITE}/book`;

  return buildBookingHref({
    target: venueSlug === "red-rocks-amphitheatre" || venueSlug === "redrocks" ? "shared" : "book",
    venue: venueSlug,
    overrides: {
      date: e?.dateKey,
      event: e?.id,
      artist: e?.performers?.map((p) => p?.name).filter(Boolean)[0] ?? e?.title,
    },
  });
}

function pickTitle(e?: ShowEvent | null, id?: string) {
  if (!e) return `Event ${id} | Party at Red Rocks`;
  const venue = e.venue?.siteName ? ` at ${e.venue.siteName}` : "";
  const date = e.datetime_local ? ` | ${fmtDate(e.datetime_local)}` : "";
  return `${e.title}${venue}${date} | Shuttle Options`;
}

function pickDescription(e?: ShowEvent | null) {
  if (!e) {
    return "Concert shuttle options, venue details, and weekly show guides across Denver, Boulder, and Colorado Springs.";
  }
  const venue = e.venue?.siteName ? ` at ${e.venue.siteName}` : "";
  const when = e.datetime_local ? ` on ${fmtDate(e.datetime_local)}` : "";
  return `Shuttle options for ${e.title}${venue}${when}. Already have tickets? Plan your ride to Red Rocks or the venue and book your return trip before show night.`;
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
    url: bookingUrlForEvent(e),
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

async function getSetlist(artistName: string, dateKey: string, venueName: string): Promise<SetlistDoc | null> {
  const apiKey = process.env.SETLISTFM_API_KEY;
  if (!apiKey || !artistName || !dateKey) return null;
  try {
    const url = new URL("https://api.setlist.fm/rest/1.0/search/setlists");
    url.searchParams.set("artistName", artistName);
    url.searchParams.set("date", dateKey.replaceAll("-", ""));
    if (venueName) url.searchParams.set("venueName", venueName);
    const response = await fetch(url.toString(), {
      headers: {
        "x-api-key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { setlist?: SetlistDoc[] };
    return Array.isArray(payload.setlist) ? payload.setlist[0] ?? null : null;
  } catch {
    return null;
  }
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
  const [data, media] = await Promise.all([readShow(raw), getMediaIndex(2026)]);
  const e = data?.event ?? null;

  const title = pickTitle(e, raw);
  const description = pickDescription(e);
  const canonicalId = e?.id ?? raw;
  const url = `${SITE}/shows/${encodeURIComponent(canonicalId)}`;

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

  const mediaRow =
    (e ? media?.eventsById?.[e.id] : null) ||
    (e?.sourceId ? media?.eventsById?.[e.sourceId] : null) ||
    null;
  const mediaImage = selectImageByPriority({
    entityType: "show",
    title: e?.title ?? null,
    artistName: e?.performers?.map((p) => p?.name).filter(Boolean)[0] ?? null,
    venueName: e?.venue?.siteName ?? null,
    queryHint: e?.title ? `${e.title} ${e?.venue?.siteName || ""} concert` : "concert shuttle options",
    blobImage: mediaRow?.sources?.blobImage ?? null,
    spotifyImage: mediaRow?.sources?.spotifyImage ?? null,
    ticketmasterImage: mediaRow?.sources?.ticketmasterImage ?? null,
    seatgeekImage: mediaRow?.sources?.seatgeekImage ?? null,
    localAsset: mediaRow?.sources?.localAsset ?? null,
    fallback: mediaRow?.sources?.fallback ?? "/og-default.jpg",
  });

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
          url: mediaImage.startsWith("http") ? mediaImage : `${SITE}${mediaImage}`,
          width: 1200,
          height: 630,
          alt: e?.title ? `${e.title} shuttle options and show details` : "Concert shuttle options",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [mediaImage.startsWith("http") ? mediaImage : `${SITE}${mediaImage}`],
    },
    robots: e
      ? { index: true, follow: true }
      : { index: false, follow: true }, // don’t index empty stubs if cache missing
  };
}

export default async function ShowPage({ params }: Props) {
  const { id: raw } = await params;
  const [data, media] = await Promise.all([readShow(raw), getMediaIndex(2026)]);
  const e = data?.event ?? null;
  if (!e) {
    if (/^\d+$/.test(raw)) {
      redirect("/red-rocks/concerts");
    }
    return notFound();
  }
  if (raw !== e.id) {
    redirect(`/shows/${encodeURIComponent(e.id)}`);
  }

  const [allEvents, allArtists] = await Promise.all([getEventsCatalog(2026, "all"), getArtistsCatalog(2026, "all")]);

  const venueSlug = e?.venue?.siteSlug;
  const venueName = e?.venue?.siteName || "Venue";
  const updatedAt = data?.generatedAt ?? null;
  const primaryArtist = (e?.performers ?? []).map((p) => p?.name).filter(Boolean)[0] ?? null;
  const showMediaRow = media?.eventsById?.[e.id] || (e?.sourceId ? media?.eventsById?.[e.sourceId] : null) || null;
  const showImage = selectImageByPriority({
    entityType: "show",
    title: e?.title ?? null,
    artistName: primaryArtist,
    venueName,
    queryHint: `${primaryArtist || e.title} ${venueName} concert`,
    alt: e?.title ?? null,
    blobImage: showMediaRow?.sources?.blobImage ?? null,
    spotifyImage: showMediaRow?.sources?.spotifyImage ?? null,
    ticketmasterImage: showMediaRow?.sources?.ticketmasterImage ?? null,
    seatgeekImage: showMediaRow?.sources?.seatgeekImage ?? null,
    localAsset: showMediaRow?.sources?.localAsset ?? null,
    fallback: showMediaRow?.sources?.fallback ?? "/images/shows/fallback.jpg",
  });
  const artistRec =
    (primaryArtist
      ? allArtists.find((row) => row.id === primaryArtist || slugify(row.name) === slugify(primaryArtist))
      : null) ?? null;
  const artistMediaRow = artistRec?.id ? media?.artistsById?.[artistRec.id] ?? null : null;
  const artistImage = selectImageByPriority({
    entityType: "artist",
    title: primaryArtist,
    artistName: primaryArtist,
    queryHint: primaryArtist ? `${primaryArtist} live music artist portrait` : null,
    alt: primaryArtist,
    blobImage: artistMediaRow?.sources?.blobImage ?? null,
    spotifyImage: artistMediaRow?.sources?.spotifyImage ?? null,
    ticketmasterImage: artistMediaRow?.sources?.ticketmasterImage ?? null,
    seatgeekImage: artistMediaRow?.sources?.seatgeekImage ?? null,
    localAsset: artistMediaRow?.sources?.localAsset ?? null,
    fallback: primaryArtist ? `/images/artists/${slugify(primaryArtist)}.jpg` : "/images/shows/fallback.jpg",
  });
  const setlist = primaryArtist ? await getSetlist(primaryArtist, e.dateKey, venueName) : null;
  const setlistSongs = setlist?.sets?.set?.[0]?.song ?? [];
  const setlistSearchUrl = primaryArtist
    ? `https://www.setlist.fm/search?artistName=${encodeURIComponent(primaryArtist)}&query=${encodeURIComponent(
        `${venueName} ${e.dateKey}`
      )}`
    : "https://www.setlist.fm";
  const isRedRocksVenue = venueSlug === "red-rocks-amphitheatre" || venueSlug === "redrocks";
  const rideHref = venueSlug
    ? buildBookingHref({
        target: isRedRocksVenue ? "shared" : "book",
        venue: venueSlug,
        overrides: {
          event: e.title,
          date: e.dateKey,
          artist: primaryArtist ?? undefined,
        },
      })
    : "/book";
  const relatedShows = allEvents
    .filter((event) => event.id !== e.id && event.venueId === venueSlug)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(0, 6);

  return (
    <main className="brand-page mx-auto max-w-6xl px-4 py-12">
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
      <div className="brand-panel rounded-[32px] p-8 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-full pill px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/80">
            Show Details
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
              title="Venue details"
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

        {e?.datetime_local ? (
          <p className="brand-kicker mt-3 text-sm font-black uppercase tracking-[0.18em]">
            {fmtDate(e.datetime_local)} at {venueName}
          </p>
        ) : null}

        <p className="mt-4 max-w-3xl text-white/70">
          Already have tickets? Plan your ride to {venueName} before show night.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-white/60">
          Round-trip rides for the full concert night. Pickup details are sent before the show.
        </p>
        <div className="mt-5">
          <img
            src={showImage}
            alt={`${e?.title || "concert"} – ${
              (e?.performers ?? []).map((p) => p?.name).filter(Boolean).join(" & ") || "live performance"
            } at ${venueName}`}
            width={720}
            height={405}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", maxWidth: 720, borderRadius: 18, border: "1px solid rgba(255,255,255,.14)" }}
          />
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full">
          {isRedRocksVenue ? (
            <Link
              href="/red-rocks"
              className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft w-full sm:w-auto min-w-[180px] text-center"
            >
              Red Rocks Hub
            </Link>
          ) : null}

            <Link
              href={rideHref}
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-cyan)] px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-[var(--brand-accent-text)] transition hover:bg-[var(--brand-cyan-hover)] w-full sm:w-auto min-w-[180px] text-center"
            >
              Get a Ride
            </Link>

          <Link
            href={isRedRocksVenue ? "/week/red-rocks" : "/week"}
            className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft w-full sm:w-auto min-w-[180px] text-center"
          >
            {isRedRocksVenue ? "Red Rocks This Week →" : "This Week →"}
          </Link>

          {isRedRocksVenue ? (
            <Link
              href="/red-rocks/concerts"
              className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft w-full sm:w-auto min-w-[180px] text-center"
            >
              Concert Schedule →
            </Link>
          ) : null}

          {e?.url ? (
            <a
              href={e.url}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center justify-center rounded-full pill px-7 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:pill-soft w-full sm:w-auto min-w-[180px] text-center"
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
              .filter((name): name is string => Boolean(name))
              .slice(0, 10)
              .map((name, idx, arr) => (
                <span key={`${e.id}-${name}`}>
                  <Link href={`/artists/${encodeURIComponent(slugify(name))}`} className="underline text-white/90 hover:text-white">
                    {name}
                  </Link>
                  {idx < arr.length - 1 ? " • " : ""}
                </span>
              ))}
          </div>
        </div>
      ) : null}

      {primaryArtist ? (
        <section className="mt-8 rounded-3xl border border-soft panel-soft p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <article>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Artist</div>
              <h2 className="mt-2 text-2xl font-black">{primaryArtist}</h2>
              <img
                src={artistImage}
                alt={`${primaryArtist} performing at ${venueName}`}
                width={320}
                height={320}
                loading="lazy"
                decoding="async"
                className="mt-4 w-full max-w-[320px] h-auto rounded-xl border border-white/20 object-cover"
              />
            </article>
            <article>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Setlist</div>
              <h3 className="mt-2 text-xl font-black">Expected / Recent Setlist</h3>
              {setlistSongs.length ? (
                <ol className="mt-4 space-y-2 text-white/80 list-decimal pl-5">
                  {setlistSongs.map((song, index) => (
                    <li key={`${song?.name ?? "song"}-${index}`}>
                      {song?.name ?? "Untitled"}
                      {song?.with?.name ? ` (with ${song.with.name})` : ""}
                      {song?.cover?.name ? " (cover)" : ""}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-white/70">Setlist not available yet. Check back after showtime for updates.</p>
              )}
              <a
                href={setlistSearchUrl}
                target="_blank"
                rel="nofollow noopener"
                className="mt-4 inline-block underline text-white/80 hover:text-white"
              >
                Open Setlist.fm →
              </a>
            </article>
          </div>
        </section>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <section className="rounded-3xl border border-soft panel-soft p-6 md:col-span-2">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Venue Details</div>
          <p className="mt-3 text-sm text-white/75">
            First time at {venueName}? Use these guides before show night so arrival and pickup are already decided.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={venueSlug ? `/venues/${encodeURIComponent(venueSlug)}` : "/venues"} className="comic-btn comic-btn-secondary">
              Venue Page
            </Link>
            {isRedRocksVenue ? (
              <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary">
                Transportation Hub
              </Link>
            ) : null}
            <Link
              href={isRedRocksVenue ? "/red-rocks/parking" : "/guide/parking"}
              className="comic-btn comic-btn-secondary"
            >
              Parking Guide
            </Link>
            <Link
              href={isRedRocksVenue ? "/red-rocks/transportation/shuttle-vs-uber" : "/guide/transportation/shuttle-vs-uber"}
              className="comic-btn comic-btn-secondary"
            >
              Shuttle vs Uber
            </Link>
            <Link href={isRedRocksVenue ? "/red-rocks/map" : "/week"} className="comic-btn comic-btn-secondary">
              {isRedRocksVenue ? "Venue Map" : "Weekly Venue View"}
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-soft panel p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Heading To This Show?</div>
          <p className="mt-3 text-sm text-white/75">Compare ride options and lock in your return before post-show demand spikes.</p>
          <div className="mt-4">
            <Link
              href={rideHref}
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-cyan)] px-6 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-[var(--brand-accent-text)] transition hover:bg-[var(--brand-cyan-hover)]"
            >
              Get a Ride
            </Link>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-soft panel-soft p-6">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Related Shows</div>
        {relatedShows.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {relatedShows.map((event) => (
              <article key={event.id} className="rounded-2xl border border-soft panel p-4">
                <p className="text-xs text-white/55">{event.dateKey}</p>
                <h3 className="mt-1 text-sm font-extrabold text-white">{event.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                    Show Details
                  </Link>
                  <Link
                    href={buildBookingHref({
                      target: isRedRocksVenue ? "shared" : "book",
                      venue: event.venueId,
                      overrides: {
                        event: event.id,
                        date: event.dateKey,
                        artist: event.artistNames[0] ?? event.name,
                      },
                    })}
                    className="comic-btn comic-btn-primary"
                  >
                    Get a Ride
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-white/70">No additional upcoming shows found for this venue in the current snapshot.</p>
        )}
      </section>

      <div className="mt-10">
        <TicketButtons />
      </div>
    </main>
  );
}
