// app/shows/[id]/page.tsx
import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import {
  getPrivateRidePricingForDate,
  isLegacy2026ServiceDate,
  SUBURBAN_2027_USD,
  VAN_2027_USD,
} from "@/lib/pricing";
import { notFound, redirect } from "next/navigation";
import TicketButtons from "@/components/TicketButtons";
import venuesJson from "@/data/venues.json";
import {
  getDenverDateKey,
  getEventsCatalog,
  getMultiYearArtistsCatalog,
  getMultiYearEventsCatalog,
} from "@/lib/events/getCatalog";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import { getMultiYearMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";
import { buildBookingHref } from "@/lib/parrHandoff";

export const runtime = "nodejs";
export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

type ShowEvent = {
  id: string;
  title: string;
  datetime_local: string;
  dateKey: string;
  sourceId: string | null;
  sourceUrl?: string | null;
  verifiedAt?: string | null;
  url?: string;
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

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const DCC = process.env.NEXT_PUBLIC_DCC_ORIGIN || "https://destinationcommandcenter.com";
const EVENTS_SNAPSHOT_DIR = path.join(process.cwd(), "data", "snapshots", "events");

function safeDate(raw: string): Date | null {
  if (!raw) return null;
  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
  const d = new Date(isoDateOnly ? `${raw}T12:00:00` : raw);
  return Number.isFinite(d.getTime()) ? d : null;
}

function hasExplicitTime(raw: string): boolean {
  return /T\d{2}:\d{2}/.test(raw);
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

function isRedRocksSlug(slug?: string) {
  return slug === "red-rocks-amphitheatre" || slug === "redrocks";
}

function publicFileExists(relPath?: string | null): boolean {
  if (!relPath || !relPath.startsWith("/")) return false;
  const clean = relPath.split("?")[0]?.replace(/^\/+/, "");
  if (!clean) return false;
  return existsSync(path.join(process.cwd(), "public", clean));
}

function resolveShowVenueFallback(venueSlug?: string | null): string {
  if (!venueSlug || isRedRocksSlug(venueSlug)) {
    return "/venues/rrsite.webp";
  }
  const jpgCandidate = `/images/venues/${venueSlug}.jpg`;
  if (publicFileExists(jpgCandidate)) return jpgCandidate;
  const webpCandidate = `/images/venues/${venueSlug}.webp`;
  if (publicFileExists(webpCandidate)) return webpCandidate;
  if (venueSlug === "mishawaka-amphitheatre" && publicFileExists("/venues/mishsite.webp")) {
    return "/venues/mishsite.webp";
  }
  return "/venues/rrsite.webp";
}

function sanitizeMediaLocalAsset(candidate?: string | null): string | null {
  if (!candidate) return null;
  if (/^\/images\/(shows|venues)\/fallback\./i.test(candidate)) return null;
  if (candidate.startsWith("/") && !publicFileExists(candidate)) return null;
  return candidate;
}

function bookingUrlForEvent(e?: ShowEvent | null) {
  const venueSlug = e?.venue?.siteSlug;
  if (!venueSlug) return `${SITE}/book`;

  return buildBookingHref({
    target: isRedRocksSlug(venueSlug) ? "private" : "book",
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
  return `${e.title}${venue}${date} | ${isRedRocksSlug(e.venue?.siteSlug) ? "Private Transportation" : "Transportation"}`;
}

function pickDescription(e?: ShowEvent | null) {
  if (!e) {
    return "Concert transportation, venue details, and weekly show guides across Denver and Colorado venues.";
  }
  const venue = e.venue?.siteName ? ` at ${e.venue.siteName}` : "";
  const when = e.datetime_local ? ` on ${fmtDate(e.datetime_local)}` : "";
  if (isRedRocksSlug(e.venue?.siteSlug)) {
    const suvPrice = getPrivateRidePricingForDate({ optionSlug: "suv", serviceDate: e.datetime_local }).priceLabel;
    const vanPrice = getPrivateRidePricingForDate({ optionSlug: "van", serviceDate: e.datetime_local }).priceLabel;
    return `Private transportation for ${e.title}${venue}${when}. Plan a ${suvPrice} Private Suburban or ${vanPrice} Private Van flat round-trip with Upper North Lot tailgating setup and a waiting vehicle for the ride home.`;
  }
  return `Transportation planning for ${e.title}${venue}${when}. Already have tickets? Plan your ride and return before show night.`;
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
    items.push({ "@type": "ListItem", position: 3, name: venueName, item: `${SITE}/venues/${venueSlug}` });
    items.push({ "@type": "ListItem", position: 4, name: showName, item: `${SITE}/shows/${id}` });
  } else {
    items.push({ "@type": "ListItem", position: 3, name: showName, item: `${SITE}/shows/${id}` });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function musicEventJsonLd(e: ShowEvent, id: string, image?: string | null) {
  const venueName = e.venue?.siteName || "Venue";
  const venueSlug = e.venue?.siteSlug;
  const isRedRocks = isRedRocksSlug(venueSlug);
  const venueUrl = venueSlug ? `${SITE}/venues/${venueSlug}` : undefined;
  const location: any = {
    "@type": "Place",
    name: venueName,
    url: venueUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: e.venue?.city || (isRedRocks ? "Morrison" : "Denver"),
      addressRegion: e.venue?.state || "CO",
      streetAddress: e.venue?.address1 || (isRedRocks ? "18300 W Alameda Pkwy" : undefined),
      postalCode: e.venue?.postalCode || (isRedRocks ? "80465" : undefined),
      addressCountry: "US",
    },
    geo:
      typeof e.venue?.lat === "number" && typeof e.venue?.lon === "number"
        ? { "@type": "GeoCoordinates", latitude: e.venue.lat, longitude: e.venue.lon }
        : isRedRocks
          ? { "@type": "GeoCoordinates", latitude: 39.6654, longitude: -105.2057 }
          : undefined,
  };
  const performers =
    (e.performers ?? [])
      .map((p) => p?.name?.trim())
      .filter((n): n is string => Boolean(n))
      .slice(0, 6)
      .map((name) => ({ "@type": "MusicGroup", name }));

  const isHistorical2026 = isLegacy2026ServiceDate(e.dateKey || e.datetime_local);
  const subjectOf = isRedRocks
    ? {
        "@type": "Service",
        name: "Private Red Rocks Concert Transportation",
        provider: { "@id": `${SITE}/#organization`, "@type": "Organization", name: "Party at Red Rocks", url: SITE },
        offers: {
          "@type": "AggregateOffer",
          url: `${SITE}/book/red-rocks-amphitheatre/private`,
          lowPrice: String(SUBURBAN_2027_USD),
          highPrice: String(VAN_2027_USD),
          priceCurrency: "USD",
        },
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "@id": `${SITE}/shows/${id}#event`,
    name: e.title,
    startDate: e.datetime_local || e.dateKey,
    url: `${SITE}/shows/${id}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: image ? (image.startsWith("http") ? image : `${SITE}${image}`) : undefined,
    description: pickDescription(e),
    location,
    ...(performers.length ? { performer: performers } : {}),
    ...(subjectOf && !isHistorical2026 ? { subjectOf } : {}),
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
  const extEvent = event as Awaited<ReturnType<typeof getEventsCatalog>>[number] & {
    sourceUrl?: string | null;
    verifiedAt?: string | null;
  };
  return {
    id: event.id,
    title: event.name,
    datetime_local: event.startLocal || event.startAt || event.dateKey,
    dateKey: event.dateKey,
    sourceId: event.sourceId,
    sourceUrl: extEvent.sourceUrl ?? null,
    verifiedAt: extEvent.verifiedAt ?? null,
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
      headers: { "x-api-key": apiKey, Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { setlist?: SetlistDoc[] };
    return Array.isArray(payload.setlist) ? payload.setlist[0] ?? null : null;
  } catch {
    return null;
  }
}

function resolveShowYears(rawId?: string): number[] {
  const currentYear = Number(getDenverDateKey().slice(0, 4));
  const years = new Set<number>([2026, currentYear, currentYear + 1]);
  const idYearMatch = /(\d{4})-\d{2}-\d{2}/.exec(rawId || "");
  if (idYearMatch) {
    const parsedYear = Number(idYearMatch[1]);
    if (parsedYear >= 2000 && parsedYear <= 2100) years.add(parsedYear);
  }
  return Array.from(years).sort((a, b) => a - b);
}

async function readShow(id: string): Promise<{ generatedAt?: string; event?: ShowEvent } | null> {
  const years = resolveShowYears(id);
  const all = await getMultiYearEventsCatalog({ scope: "all", years });
  const selected = all.find((event) => event.id === id || event.sourceId === id);
  if (!selected) return null;
  const eventYear = Number(selected.dateKey.slice(0, 4)) || 2026;
  let generatedAt: string | undefined;
  try {
    const raw = await readFile(path.join(EVENTS_SNAPSHOT_DIR, `all-${eventYear}.json`), "utf8");
    const parsed = JSON.parse(raw) as { generatedAt?: string };
    generatedAt = typeof parsed.generatedAt === "string" ? parsed.generatedAt : undefined;
  } catch {
    generatedAt = undefined;
  }
  return { generatedAt, event: toShowEvent(selected) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: raw } = await params;
  const years = resolveShowYears(raw);
  const [data, media] = await Promise.all([readShow(raw), getMultiYearMediaIndex(years)]);
  const e = data?.event ?? null;
  const title = pickTitle(e, raw);
  const description = pickDescription(e);
  const canonicalId = e?.id ?? raw;
  const url = `${SITE}/shows/${encodeURIComponent(canonicalId)}`;
  const redRocks = isRedRocksSlug(e?.venue?.siteSlug);
  const keywords = Array.from(
    new Set([
      "concert transportation",
      "Denver concert transportation",
      redRocks ? "Red Rocks private transportation" : "concert ride",
      redRocks ? "Red Rocks private car service" : "",
      "party at red rocks",
      e?.venue?.siteName ? `${e.venue.siteName} transportation` : "",
      ...(e?.performers ?? []).map((p) => p?.name || "").filter(Boolean),
    ].filter(Boolean))
  );
  const mediaRow = (e ? media?.eventsById?.[e.id] : null) || (e?.sourceId ? media?.eventsById?.[e.sourceId] : null) || null;
  const venueFallback = resolveShowVenueFallback(e?.venue?.siteSlug);
  const mediaImage = selectImageByPriority({
    entityType: "show",
    title: e?.title ?? null,
    artistName: e?.performers?.map((p) => p?.name).filter(Boolean)[0] ?? null,
    venueName: e?.venue?.siteName ?? null,
    queryHint: e?.title ? `${e.title} ${e?.venue?.siteName || ""} concert` : "concert transportation",
    blobImage: mediaRow?.sources?.blobImage ?? null,
    spotifyImage: mediaRow?.sources?.spotifyImage ?? null,
    ticketmasterImage: mediaRow?.sources?.ticketmasterImage ?? null,
    seatgeekImage: mediaRow?.sources?.seatgeekImage ?? null,
    localAsset: sanitizeMediaLocalAsset(mediaRow?.sources?.localAsset),
    fallback: e ? venueFallback : "/og-default.jpg",
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
      images: [{
        url: mediaImage.startsWith("http") ? mediaImage : `${SITE}${mediaImage}`,
        width: 1200,
        height: 630,
        alt: e?.title ? `${e.title} show details and transportation` : "Concert transportation",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [mediaImage.startsWith("http") ? mediaImage : `${SITE}${mediaImage}`],
    },
    robots: e ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function ShowPage({ params }: Props) {
  const { id: raw } = await params;
  const years = resolveShowYears(raw);
  const [data, media] = await Promise.all([readShow(raw), getMultiYearMediaIndex(years)]);
  const e = data?.event ?? null;
  if (!e) {
    if (/^\d+$/.test(raw)) redirect("/red-rocks/concerts");
    return notFound();
  }
  if (raw !== e.id) redirect(`/shows/${encodeURIComponent(e.id)}`);

  const [allEvents, allArtists] = await Promise.all([
    getMultiYearEventsCatalog({ scope: "all", years }),
    getMultiYearArtistsCatalog({ scope: "all", years }),
  ]);
  const venueSlug = e.venue?.siteSlug;
  const venueName = e.venue?.siteName || "Venue";
  const updatedAt = data?.generatedAt ?? null;
  const primaryArtist = (e.performers ?? []).map((p) => p?.name).filter(Boolean)[0] ?? null;
  const showMediaRow = media?.eventsById?.[e.id] || (e.sourceId ? media?.eventsById?.[e.sourceId] : null) || null;
  const venueFallback = resolveShowVenueFallback(venueSlug);
  const artistRec = primaryArtist
    ? allArtists.find((row) => row.id === primaryArtist || slugify(row.name) === slugify(primaryArtist)) ?? null
    : null;
  const artistMediaRow = artistRec?.id ? media?.artistsById?.[artistRec.id] ?? null : null;
  const localArtistCandidate = primaryArtist ? `/images/artists/${slugify(primaryArtist)}.jpg` : null;
  const verifiedLocalArtistPortrait =
    sanitizeMediaLocalAsset(artistMediaRow?.sources?.localAsset) ||
    (localArtistCandidate && publicFileExists(localArtistCandidate) ? localArtistCandidate : null);
  const hasVerifiedArtistPortrait = Boolean(
    artistMediaRow?.sources?.blobImage ||
      artistMediaRow?.sources?.spotifyImage ||
      artistMediaRow?.sources?.ticketmasterImage ||
      artistMediaRow?.sources?.seatgeekImage ||
      artistRec?.image ||
      verifiedLocalArtistPortrait
  );
  const artistImage = hasVerifiedArtistPortrait
    ? selectImageByPriority({
        entityType: "artist",
        title: primaryArtist,
        artistName: primaryArtist,
        queryHint: primaryArtist ? `${primaryArtist} live music artist portrait` : null,
        alt: primaryArtist,
        blobImage: artistMediaRow?.sources?.blobImage ?? null,
        spotifyImage: artistMediaRow?.sources?.spotifyImage ?? null,
        ticketmasterImage: artistMediaRow?.sources?.ticketmasterImage ?? null,
        seatgeekImage: artistMediaRow?.sources?.seatgeekImage ?? artistRec?.image ?? null,
        localAsset: verifiedLocalArtistPortrait,
        fallback: venueFallback,
      })
    : null;
  const showImage = selectImageByPriority({
    entityType: "show",
    title: e.title,
    artistName: primaryArtist,
    venueName,
    queryHint: `${primaryArtist || e.title} ${venueName} concert`,
    alt: e.title,
    blobImage: showMediaRow?.sources?.blobImage ?? null,
    spotifyImage: showMediaRow?.sources?.spotifyImage ?? artistMediaRow?.sources?.spotifyImage ?? null,
    ticketmasterImage: showMediaRow?.sources?.ticketmasterImage ?? null,
    seatgeekImage: showMediaRow?.sources?.seatgeekImage ?? null,
    localAsset: sanitizeMediaLocalAsset(showMediaRow?.sources?.localAsset),
    fallback: venueFallback,
  });
  const setlist = primaryArtist ? await getSetlist(primaryArtist, e.dateKey, venueName) : null;
  const setlistSongs = setlist?.sets?.set?.[0]?.song ?? [];
  const setlistSearchUrl = primaryArtist
    ? `https://www.setlist.fm/search?artistName=${encodeURIComponent(primaryArtist)}&query=${encodeURIComponent(`${venueName} ${e.dateKey}`)}`
    : "https://www.setlist.fm";
  const isRedRocksVenue = isRedRocksSlug(venueSlug);
  const rideHref = venueSlug
    ? buildBookingHref({
        target: isRedRocksVenue ? "private" : "book",
        venue: venueSlug,
        overrides: { event: e.id, date: e.dateKey, artist: primaryArtist ?? undefined },
      })
    : "/book";
  const todayKey = new Date().toISOString().slice(0, 10);
  const relatedShows = allEvents
    .filter((event) => event.id !== e.id && event.venueId === venueSlug && event.dateKey >= todayKey)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(0, 6);

  return (
    <main className="brand-page mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(e, e.id)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(musicEventJsonLd(e, e.id, showImage)) }} />

      {isLegacy2026ServiceDate(e.dateKey || e.datetime_local) ? (
        <aside
          aria-label="2026 historical event archive notice"
          className="mb-6 rounded-2xl border border-[#ffb07c]/35 bg-[#ffb07c]/10 p-4 text-sm leading-6 text-white/90"
        >
          <strong className="uppercase tracking-wider text-[#ffb07c]">2026 Historical Event Page:</strong> This concert took place during the 2026 season. Existing 2026 ride orders remain unchanged at their original booked prices. Looking for upcoming shows?{" "}
          <Link href="/red-rocks/concerts" className="font-bold text-[#ffb07c] underline">
            Browse the 2027 Red Rocks Concert Schedule (${SUBURBAN_2027_USD} Suburban / ${VAN_2027_USD} Van) →
          </Link>
        </aside>
      ) : null}

      <div className="rounded-[32px] border border-white/12 bg-[#0d1424] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-[#ffb07c]/35 bg-[#ffb07c]/12 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">
                {isLegacy2026ServiceDate(e.dateKey || e.datetime_local) ? "2026 Show Archive" : "Verified Concert Night"}
              </span>
              {e.datetime_local && hasExplicitTime(e.datetime_local) ? (
                <span className="inline-flex items-center rounded-full border border-white/14 bg-white/6 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
                  {fmtDateTime(e.datetime_local)}
                </span>
              ) : null}
              {venueSlug ? (
                <Link
                  href={`/venues/${venueSlug}`}
                  className="inline-flex items-center rounded-full border border-white/14 bg-white/6 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80 no-underline hover:bg-white/12"
                >
                  {venueName} →
                </Link>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              {e.title}
            </h1>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-[#ffb07c]">
              {fmtDate(e.datetime_local)} · {venueName}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/82">
              {isRedRocksVenue
                ? `Skip the parking hike and post-encore surge chaos. Reserve one dedicated private vehicle for your crew—$${SUBURBAN_2027_USD} Private Suburban (up to 6) or $${VAN_2027_USD} Private Van (up to 10) for 2027 concerts, including Upper North Lot tailgating gear (chairs, cooler, speaker & ice) and a driver waiting through the show.`
                : `Already holding tickets for ${e.title}? Lock in your private round-trip ride to ${venueName} before show night.`}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={rideHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff7a4d] px-7 text-xs font-black uppercase tracking-[0.14em] text-[#140804] no-underline shadow-[0_12px_30px_rgba(255,122,77,0.3)] transition hover:bg-[#ff926b]"
              >
                {isRedRocksVenue ? `Book Private Ride ($${SUBURBAN_2027_USD} / $${VAN_2027_USD})` : "Request Private Ride"}
              </Link>
              {isRedRocksVenue ? (
                <Link
                  href="/red-rocks/concerts"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/8 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/14"
                >
                  2027 Concert Schedule →
                </Link>
              ) : (
                <Link
                  href="/venues"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/8 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/14"
                >
                  All Venues →
                </Link>
              )}
              {(e.sourceUrl || e.url) ? (
                <a
                  href={(e.sourceUrl || e.url) ?? undefined}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-black/30 px-5 text-xs font-bold uppercase tracking-[0.14em] text-white/85 no-underline transition hover:bg-white/10"
                >
                  Official Event Source ↗
                </a>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/55">
              <span>
                Official venue reference:{" "}
                <a
                  href={e.sourceUrl || "https://www.redrocksonline.com/events/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/75 underline"
                >
                  {e.sourceUrl ? "redrocksonline.com listing" : "redrocksonline.com/events"}
                </a>
              </span>
              <span>
                Freshness verified:{" "}
                {e.verifiedAt ? (
                  <time dateTime={e.verifiedAt}>{e.verifiedAt}</time>
                ) : updatedAt ? (
                  <time dateTime={updatedAt}>{updatedAt.slice(0, 10)}</time>
                ) : (
                  "2026-11-11"
                )}
              </span>
            </div>
          </div>

          <div>
            <img
              src={showImage}
              alt={`${e.title} at ${venueName}`}
              width={720}
              height={405}
              loading="eager"
              decoding="async"
              className="aspect-[16/10] w-full rounded-[22px] border border-white/12 object-cover shadow-xl"
            />
          </div>
        </div>
      </div>

      {e.performers?.length ? (
        <div className="mt-8 rounded-3xl border border-soft panel-soft p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Performers</div>
          <div className="mt-3 text-sm text-white/80">
            {e.performers.map((p) => p?.name).filter((name): name is string => Boolean(name)).slice(0, 10).map((name, idx, arr) => (
              <span key={`${e.id}-${name}`}><Link href={`/artists/${encodeURIComponent(slugify(name))}`} className="underline text-white/90 hover:text-white">{name}</Link>{idx < arr.length - 1 ? " • " : ""}</span>
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
              {artistImage && artistImage !== showImage ? (
                <img
                  src={artistImage}
                  alt={`${primaryArtist} performing at ${venueName}`}
                  width={320}
                  height={320}
                  loading="lazy"
                  decoding="async"
                  className="mt-4 w-full max-w-[320px] h-auto rounded-xl border border-white/20 object-cover"
                />
              ) : (
                <div className="mt-4 rounded-2xl border border-white/14 bg-white/[0.04] p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--brand-cyan)]">
                    Live Stage Bill
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    {primaryArtist} is scheduled at <strong className="text-white">{venueName}</strong> on{" "}
                    <strong className="text-white">{fmtDate(e.datetime_local)}</strong>.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/artists/${encodeURIComponent(slugify(primaryArtist))}`}
                      className="comic-btn comic-btn-secondary"
                    >
                      Artist Tour Dates →
                    </Link>
                  </div>
                </div>
              )}
            </article>
            <article>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Setlist</div>
              <h3 className="mt-2 text-xl font-black">Expected / Recent Setlist</h3>
              {setlistSongs.length ? (
                <ol className="mt-4 space-y-2 text-white/80 list-decimal pl-5">{setlistSongs.map((song, index) => <li key={`${song?.name ?? "song"}-${index}`}>{song?.name ?? "Untitled"}{song?.with?.name ? ` (with ${song.with.name})` : ""}{song?.cover?.name ? " (cover)" : ""}</li>)}</ol>
              ) : <p className="mt-4 text-white/70">Setlist not available yet. Check back after showtime for updates.</p>}
              <a href={setlistSearchUrl} target="_blank" rel="nofollow noopener" className="mt-4 inline-block underline text-white/80 hover:text-white">Open Setlist.fm →</a>
            </article>
          </div>
        </section>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <section className="rounded-3xl border border-soft panel-soft p-6 md:col-span-2">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Venue Details</div>
          <p className="mt-3 text-sm text-white/75">First time at {venueName}? Use these guides before show night so arrival and pickup are already decided.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={venueSlug ? `/venues/${encodeURIComponent(venueSlug)}` : "/venues"} className="comic-btn comic-btn-secondary">Venue Page</Link>
            {isRedRocksVenue ? <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary">Transportation Hub</Link> : null}
            <Link href={isRedRocksVenue ? "/red-rocks/parking" : "/guide/parking"} className="comic-btn comic-btn-secondary">Parking Guide</Link>
            <Link href={isRedRocksVenue ? "/red-rocks/transportation/shuttle-vs-uber" : "/guide/transportation/shuttle-vs-uber"} className="comic-btn comic-btn-secondary">Transportation Comparison</Link>
            <Link href={isRedRocksVenue ? "/red-rocks/map" : "/week"} className="comic-btn comic-btn-secondary">{isRedRocksVenue ? "Venue Map" : "Weekly Venue View"}</Link>
          </div>
        </section>
        <section className="rounded-3xl border border-soft panel p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Heading To This Show?</div>
          <p className="mt-3 text-sm text-white/75">{isRedRocksVenue ? "Reserve the private vehicle for your group before show night." : "Plan your ride and return before show night."}</p>
          <div className="mt-4"><Link href={rideHref} className="inline-flex items-center justify-center rounded-full bg-[var(--brand-cyan)] px-6 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-[var(--brand-accent-text)] transition hover:bg-[var(--brand-cyan-hover)]">{isRedRocksVenue ? "Book Private Ride" : "Get a Ride"}</Link></div>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-soft panel-soft p-6">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Upcoming Shows</div>
        {relatedShows.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">{relatedShows.map((event) => (
            <article key={event.id} className="rounded-2xl border border-soft panel p-4">
              <p className="text-xs text-white/55">{event.dateKey}</p>
              <h3 className="mt-1 text-sm font-extrabold text-white">{event.name}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">Show Details</Link>
                <Link href={buildBookingHref({ target: isRedRocksVenue ? "private" : "book", venue: event.venueId, overrides: { event: event.id, date: event.dateKey, artist: event.artistNames[0] ?? event.name } })} className="comic-btn comic-btn-primary">{isRedRocksVenue ? "Book Private Ride" : "Get a Ride"}</Link>
              </div>
            </article>
          ))}</div>
        ) : <p className="mt-3 text-sm text-white/70">No additional upcoming shows found for this venue in the current snapshot.</p>}
      </section>

      <div className="mt-10"><TicketButtons /></div>
    </main>
  );
}
