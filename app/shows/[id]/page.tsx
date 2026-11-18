// app/shows/[id]/page.tsx
import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import {
  PARR_2027_OPTION_B_PRICING_AUTHORITY,
  PARR_COMPLETE_TOTAL_DISCLOSURE,
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
import {
  CURATED_HISTORICAL_RED_ROCKS_NOTES,
  buildRedRocksShowLogisticsGuidance,
  evaluateHistoricalRedRocksShowQualification,
  evaluateShowPageDisposition,
  extractDistinctBilledActs,
  getParrVenueServiceSummary,
  isNonArtistParserLabel,
  isParrServedVenue,
  normalizeBaseArtistKey,
} from "@/lib/seo/indexationGate";

export const runtime = "nodejs";
export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

type ShowEvent = {
  id: string;
  title: string;
  datetime_local: string;
  dateKey: string;
  doorsAt?: string | null;
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

function fmtTimeOnly(raw: string): string | null {
  if (!hasExplicitTime(raw)) return null;
  const d = safeDate(raw);
  if (!d) return null;
  return d.toLocaleTimeString("en-US", {
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

function isRedRocksSlug(slug?: string | null) {
  return slug === "red-rocks-amphitheatre" || slug === "redrocks";
}

function cleanPerformerNames(performers?: Array<{ name?: string }>): string[] {
  return (performers ?? [])
    .map((p) => p?.name?.trim() || "")
    .filter((name) => Boolean(name) && !isNonArtistParserLabel(name));
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

function futureBookingPathForEvent(e: ShowEvent): string {
  const venueSlug = e.venue?.siteSlug;
  if (!venueSlug) return "/book/red-rocks-amphitheatre/private";
  const cleanArtists = cleanPerformerNames(e.performers);

  return buildBookingHref({
    target: isRedRocksSlug(venueSlug) ? "private" : "book",
    venue: venueSlug,
    overrides: {
      date: e.dateKey,
      event: e.id,
      artist: cleanArtists[0] ?? e.title,
    },
  });
}

function pickTitle(e: ShowEvent | null, id: string, isPast: boolean) {
  if (!e) return `Event ${id} | Party at Red Rocks`;
  const venue = e.venue?.siteName ? ` at ${e.venue.siteName}` : "";
  const date = e.datetime_local ? ` | ${fmtDate(e.datetime_local)}` : "";
  if (isPast) {
    return `${e.title}${venue}${date} (Completed Concert) | Party at Red Rocks`;
  }
  return `${e.title}${venue}${date} | ${isRedRocksSlug(e.venue?.siteSlug) ? "Private Transportation" : "Transportation"}`;
}

function pickDescription(e: ShowEvent | null, isPast: boolean) {
  if (!e) {
    return "Concert transportation, venue details, and show guides across Red Rocks and Colorado venues.";
  }
  const venue = e.venue?.siteName ? ` at ${e.venue.siteName}` : "";
  const when = e.datetime_local ? ` on ${fmtDate(e.datetime_local)}` : "";
  if (isPast) {
    return `Historical concert record for ${e.title}${venue}${when} (completed event). Browse verified upcoming 2027 Red Rocks concert dates and private group transportation.`;
  }
  if (isRedRocksSlug(e.venue?.siteSlug)) {
    const suv = PARR_2027_OPTION_B_PRICING_AUTHORITY.suv;
    const van = PARR_2027_OPTION_B_PRICING_AUTHORITY.van;
    return `Private transportation for ${e.title}${venue}${when}. Reserve a ${suv.allInTotalFormatted} total Private Suburban (${suv.itemizedSummary}, up to 6) or ${van.allInTotalFormatted} total Private Van (${van.itemizedSummary}, up to 10) with Upper North Lot tailgating setup and a waiting driver.`;
  }
  return `Transportation planning for ${e.title}${venue}${when}. Plan your group ride and post-show return before show night.`;
}

function breadcrumbJsonLd(e: ShowEvent | null, id: string) {
  const showName = e?.title || `Show ${id}`;
  const venueName = e?.venue?.siteName || "Venue";
  const venueSlug = e?.venue?.siteSlug;
  const isRedRocks = isRedRocksSlug(venueSlug);
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: isRedRocks ? "Red Rocks Concerts" : "Venues",
      item: isRedRocks ? `${SITE}/red-rocks/concerts` : `${SITE}/venues`,
    },
  ];
  if (venueSlug && !isRedRocks) {
    items.push({ "@type": "ListItem", position: 3, name: venueName, item: `${SITE}/venues/${venueSlug}` });
    items.push({ "@type": "ListItem", position: 4, name: showName, item: `${SITE}/shows/${id}` });
  } else {
    items.push({ "@type": "ListItem", position: 3, name: showName, item: `${SITE}/shows/${id}` });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function buildVenuePlaceNode(e: ShowEvent) {
  const venueName = e.venue?.siteName || "Venue";
  const venueSlug = e.venue?.siteSlug;
  const isRedRocks = isRedRocksSlug(venueSlug);
  const venueUrl = venueSlug ? `${SITE}/venues/${venueSlug}` : undefined;
  return {
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
}

/**
 * Factual historical WebPage JSON-LD for completed past concerts (Requirement 7).
 * Never emits `EventScheduled`, never invents `EventCompleted`, and never attaches
 * an active transportation `Offer` to a completed concert.
 */
function historicalShowWebPageJsonLd(e: ShowEvent, id: string, image?: string | null) {
  const performers = cleanPerformerNames(e.performers)
    .slice(0, 6)
    .map((name) => ({ "@type": "MusicGroup", name }));

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/shows/${id}#historical-webpage`,
    url: `${SITE}/shows/${id}`,
    name: `${e.title} at ${e.venue?.siteName || "Red Rocks Amphitheatre"} (${fmtDate(e.datetime_local)} — Completed Concert)`,
    description: pickDescription(e, true),
    image: image ? (image.startsWith("http") ? image : `${SITE}${image}`) : undefined,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: "Party at Red Rocks",
      url: SITE,
    },
    about: [
      buildVenuePlaceNode(e),
      ...performers,
    ],
  };
}

/**
 * Future show JSON-LD:
 * 1) Factual `MusicEvent` node WITHOUT $499/$699 ticket offers (avoiding ticket-price schema misuse).
 * 2) Separate transportation `Service` + `Offer` node for PARR's private vehicle service.
 */
function futureShowJsonLdNodes(e: ShowEvent, id: string, image?: string | null) {
  const venueSlug = e.venue?.siteSlug;
  const isRedRocks = isRedRocksSlug(venueSlug);
  const performers = cleanPerformerNames(e.performers)
    .slice(0, 6)
    .map((name) => ({ "@type": "MusicGroup", name }));

  const eventNode: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "@id": `${SITE}/shows/${id}#event`,
    name: e.title,
    startDate: e.datetime_local || e.dateKey,
    url: e.sourceUrl || `${SITE}/shows/${id}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: image ? (image.startsWith("http") ? image : `${SITE}${image}`) : undefined,
    description: `${e.title} live at ${e.venue?.siteName || "Red Rocks Amphitheatre"} on ${fmtDate(e.datetime_local)}.`,
    location: buildVenuePlaceNode(e),
    organizer: {
      "@type": "Organization",
      name: e.venue?.siteName || "Red Rocks Amphitheatre",
      url: e.sourceUrl || "https://www.redrocksonline.com/events/",
    },
    ...(performers.length ? { performer: performers } : {}),
    sameAs: [
      ...(e.sourceUrl ? [e.sourceUrl] : []),
      `${DCC}/shows/${id}`,
    ],
  };

  if (!isRedRocks) {
    return [eventNode];
  }

  const bookingPath = futureBookingPathForEvent(e);
  const bookingAbsoluteUrl = bookingPath.startsWith("http") ? bookingPath : `${SITE}${bookingPath}`;

  const transportationServiceNode: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/shows/${id}#transportation-service`,
    name: `Private Red Rocks Group Transportation — ${e.title} (${fmtDate(e.datetime_local)})`,
    serviceType: "Private Round-Trip Concert Transportation",
    description: pickDescription(e, false),
    provider: {
      "@id": `${SITE}/#organization`,
      "@type": "Organization",
      name: "Party at Red Rocks",
      url: SITE,
    },
    areaServed: {
      "@type": "City",
      name: "Denver",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Private Suburban (Up to 6 Guests — All-In Round-Trip Vehicle Total)",
        price: PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.schemaPriceString,
        priceCurrency: "USD",
        description: `${PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.allInTotalFormatted} total (${PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.itemizedSummary}). ${PARR_COMPLETE_TOTAL_DISCLOSURE}`,
        url: bookingAbsoluteUrl,
      },
      {
        "@type": "Offer",
        name: "Private 10-Passenger Van (Up to 10 Guests — All-In Round-Trip Vehicle Total)",
        price: PARR_2027_OPTION_B_PRICING_AUTHORITY.van.schemaPriceString,
        priceCurrency: "USD",
        description: `${PARR_2027_OPTION_B_PRICING_AUTHORITY.van.allInTotalFormatted} total (${PARR_2027_OPTION_B_PRICING_AUTHORITY.van.itemizedSummary}). ${PARR_COMPLETE_TOTAL_DISCLOSURE}`,
        url: bookingAbsoluteUrl,
      },
    ],
  };

  return [eventNode, transportationServiceNode];
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
  const row = (venuesJson as Record<string, unknown>)[slug];
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
    doorsAt?: string | null;
  };
  return {
    id: event.id,
    title: event.name,
    datetime_local: event.startLocal || event.startAt || event.dateKey,
    dateKey: event.dateKey,
    doorsAt: extEvent.doorsAt ?? null,
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
  const todayDenverKey = getDenverDateKey();
  const [data, media, allEvents] = await Promise.all([
    readShow(raw),
    getMultiYearMediaIndex(years),
    getMultiYearEventsCatalog({ scope: "all", years }),
  ]);
  const e = data?.event ?? null;

  if (!e) {
    return {
      title: `Event ${raw} | Party at Red Rocks`,
      robots: { index: false, follow: true },
    };
  }

  const isPast = Boolean(e.dateKey && e.dateKey < todayDenverKey);
  const title = pickTitle(e, raw, isPast);
  const description = pickDescription(e, isPast);
  const canonicalId = e.id;
  const url = `${SITE}/shows/${encodeURIComponent(canonicalId)}`;
  const redRocks = isRedRocksSlug(e.venue?.siteSlug);
  const cleanArtists = cleanPerformerNames(e.performers);

  const distinctBilledActs = extractDistinctBilledActs(e.title, cleanArtists);
  const baseKeys = new Set(
    [e.title, ...distinctBilledActs].map(normalizeBaseArtistKey).filter(Boolean)
  );
  const eventYear = e.dateKey.slice(0, 4);
  const companionRunShowIds =
    isPast && redRocks
      ? allEvents
          .filter(
            (ev) =>
              ev.id !== e.id &&
              ev.venueId === "red-rocks-amphitheatre" &&
              ev.dateKey.startsWith(eventYear) &&
              [ev.name, ...ev.artistNames].some((n) => baseKeys.has(normalizeBaseArtistKey(n)))
          )
          .map((ev) => ev.id)
      : [];
  const verifiedFutureShowIds =
    isPast && redRocks
      ? allEvents
          .filter(
            (ev) =>
              ev.id !== e.id &&
              ev.dateKey >= todayDenverKey &&
              [ev.name, ...ev.artistNames].some((n) => baseKeys.has(normalizeBaseArtistKey(n)))
          )
          .map((ev) => ev.id)
      : [];

  const histQual =
    isPast && redRocks
      ? evaluateHistoricalRedRocksShowQualification({
          id: canonicalId,
          title: e.title,
          performers: cleanArtists,
          companionRunShowIds,
          verifiedFutureArtistShowIds: verifiedFutureShowIds,
        })
      : null;

  const gateDecision = evaluateShowPageDisposition({
    id: canonicalId,
    title: e.title,
    venueSlug: e.venue?.siteSlug,
    dateKey: e.dateKey,
    todayDenverKey,
    performers: cleanArtists,
    officialSourceUrl: e.sourceUrl,
    ticketUrl: e.url,
    hasExplicitStartTime: hasExplicitTime(e.datetime_local),
    hasExplicitDoorTime: Boolean(e.doorsAt),
    bookingHref: isPast ? null : futureBookingPathForEvent(e),
    hasOperatorLogisticsSection: redRocks && !isPast,
    hasHonestTimeLabel: true,
    hasDistinctHistoricalContent: histQual?.qualifiesForIndex ?? false,
  });

  const mediaRow = media?.eventsById?.[e.id] || (e.sourceId ? media?.eventsById?.[e.sourceId] : null) || null;
  const venueFallback = resolveShowVenueFallback(e.venue?.siteSlug);
  const mediaImage = selectImageByPriority({
    entityType: "show",
    title: e.title,
    artistName: cleanArtists[0] ?? null,
    venueName: e.venue?.siteName ?? null,
    queryHint: `${e.title} ${e.venue?.siteName || ""} concert`,
    blobImage: mediaRow?.sources?.blobImage ?? null,
    spotifyImage: mediaRow?.sources?.spotifyImage ?? null,
    ticketmasterImage: mediaRow?.sources?.ticketmasterImage ?? null,
    seatgeekImage: mediaRow?.sources?.seatgeekImage ?? null,
    localAsset: sanitizeMediaLocalAsset(mediaRow?.sources?.localAsset),
    fallback: venueFallback,
  });

  return {
    title,
    description,
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
          alt: `${e.title} concert details`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [mediaImage.startsWith("http") ? mediaImage : `${SITE}${mediaImage}`],
    },
    robots: {
      index: gateDecision.index,
      follow: gateDecision.follow,
    },
  };
}

export default async function ShowPage({ params }: Props) {
  const { id: raw } = await params;
  const years = resolveShowYears(raw);
  const todayDenverKey = getDenverDateKey();
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
  const isRedRocksVenue = isRedRocksSlug(venueSlug);
  const isPastShow = Boolean(e.dateKey && e.dateKey < todayDenverKey);
  const updatedAt = data?.generatedAt ?? null;

  const cleanArtists = cleanPerformerNames(e.performers);
  const primaryArtist = cleanArtists[0] ?? null;

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

  // Check if any performer on this bill has verified FUTURE dates (using normalized base-artist matching)
  const distinctBilledActs = extractDistinctBilledActs(e.title, cleanArtists);
  const billBaseKeys = new Set(
    [e.title, ...distinctBilledActs].map(normalizeBaseArtistKey).filter(Boolean)
  );
  const verifiedFutureArtistDates = allEvents
    .filter(
      (ev) =>
        ev.id !== e.id &&
        ev.dateKey >= todayDenverKey &&
        [ev.name, ...ev.artistNames].some((n) => billBaseKeys.has(normalizeBaseArtistKey(n)))
    )
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(0, 6);

  const eventYear = e.dateKey.slice(0, 4);
  const companionRunShows = isRedRocksVenue
    ? allEvents
        .filter(
          (ev) =>
            ev.id !== e.id &&
            ev.venueId === "red-rocks-amphitheatre" &&
            ev.dateKey.startsWith(eventYear) &&
            [ev.name, ...ev.artistNames].some((n) => billBaseKeys.has(normalizeBaseArtistKey(n)))
        )
        .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    : [];

  const curatedHistoricalNote = CURATED_HISTORICAL_RED_ROCKS_NOTES[e.id] ?? null;

  const upcomingRedRocksShows = allEvents
    .filter(
      (ev) =>
        ev.id !== e.id &&
        ev.venueId === "red-rocks-amphitheatre" &&
        ev.dateKey >= todayDenverKey
    )
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(0, 6);

  const explicitTimeFormatted = fmtTimeOnly(e.datetime_local);
  const honestTimeBadge = explicitTimeFormatted
    ? e.doorsAt
      ? `Event Time: ${explicitTimeFormatted} MT`
      : `Listed Time: ${explicitTimeFormatted} MT · Doors/Show Split TBA`
    : "Doors & Showtime: TBA on Official Venue Listing";

  const redRocksLogistics =
    isRedRocksVenue && !isPastShow
      ? buildRedRocksShowLogisticsGuidance({
          dateKey: e.dateKey,
          startLocal: e.datetime_local,
          hasExplicitTime: hasExplicitTime(e.datetime_local),
          hasExplicitDoorTime: Boolean(e.doorsAt),
        })
      : null;

  // Never emit old-date booking links for completed past concerts!
  const futureRideHref = !isPastShow ? futureBookingPathForEvent(e) : "/book/red-rocks-amphitheatre/private";
  const servedVenueSummary = getParrVenueServiceSummary(venueSlug);

  const jsonLdNodes = isPastShow
    ? [breadcrumbJsonLd(e, e.id), historicalShowWebPageJsonLd(e, e.id, showImage)]
    : [breadcrumbJsonLd(e, e.id), ...futureShowJsonLdNodes(e, e.id, showImage)];

  return (
    <main className="brand-page mx-auto max-w-6xl px-4 py-12">
      {jsonLdNodes.map((node, idx) => (
        <script
          key={`jsonld-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}

      {isPastShow ? (
        <aside
          aria-label="Completed concert historical notice"
          data-testid="completed-show-banner"
          className="mb-6 rounded-2xl border border-[#ffb07c]/40 bg-[#ffb07c]/12 p-5 text-sm leading-6 text-white/92"
        >
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
            Completed Concert Record
          </div>
          <p className="mt-1">
            <strong>{e.title}</strong> at <strong>{venueName}</strong> took place on{" "}
            <strong>{fmtDate(e.datetime_local)}</strong> and has concluded. Existing past ride orders remain unchanged at their original booked prices.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {verifiedFutureArtistDates.length > 0 ? (
              <Link
                href={`/shows/${encodeURIComponent(verifiedFutureArtistDates[0].id)}`}
                className="inline-flex items-center rounded-full bg-[#ff6b3d] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white no-underline hover:bg-[#ff7f56]"
              >
                See {primaryArtist || "Artist"}&apos;s Upcoming {verifiedFutureArtistDates[0].dateKey.slice(0, 4)} Show →
              </Link>
            ) : null}
            <Link
              href="/red-rocks/concerts"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline hover:bg-white/15"
            >
              Browse Current 2027 Red Rocks Concert Schedule →
            </Link>
          </div>
        </aside>
      ) : null}

      <div className="rounded-[32px] border border-white/12 bg-[#0d1424] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-[#ffb07c]/35 bg-[#ffb07c]/12 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">
                {isPastShow ? `Completed Concert · ${fmtDate(e.datetime_local)}` : "Verified Concert Night"}
              </span>
              {!isPastShow ? (
                <span
                  data-testid="honest-door-show-time-label"
                  className="inline-flex items-center rounded-full border border-white/14 bg-white/6 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/78"
                >
                  {honestTimeBadge}
                </span>
              ) : null}
              {venueSlug && venueSlug !== "1stbank-center" ? (
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
              {isPastShow ? " · Event Completed" : ""}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/82">
              {isPastShow
                ? `This ${venueName} concert concluded on ${fmtDate(e.datetime_local)}. Use the links below to check setlist archives, view upcoming ${primaryArtist || "artist"} dates, or plan private group transportation for a future 2027 concert night.`
                : isRedRocksVenue
                  ? `Skip the steep lot hike and post-encore rideshare surge. Reserve one dedicated private vehicle for your group—${PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.allInTotalFormatted} total Private Suburban (${PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.itemizedSummary}, up to 6) or ${PARR_2027_OPTION_B_PRICING_AUTHORITY.van.allInTotalFormatted} total Private Van (${PARR_2027_OPTION_B_PRICING_AUTHORITY.van.itemizedSummary}, up to 10)—including Upper North Lot tailgating setup (chairs, cooler, speaker & ice) and your driver waiting on-site through the show. ${PARR_COMPLETE_TOTAL_DISCLOSURE}`
                  : servedVenueSummary
                    ? `Attending ${e.title} at ${venueName}? Request a dedicated private group charter (${servedVenueSummary}) with pre-set pickup and post-show return.`
                    : `Concert schedule and venue details for ${e.title} at ${venueName}.`}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {isPastShow ? (
                <>
                  <Link
                    href="/red-rocks/concerts"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff6b3d] px-7 text-xs font-black uppercase tracking-[0.14em] text-white no-underline shadow-[0_12px_30px_rgba(255,107,61,0.3)] transition hover:bg-[#ff7f56]"
                  >
                    See Upcoming 2027 Red Rocks Concerts →
                  </Link>
                  <Link
                    href="/book/red-rocks-amphitheatre/private"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/8 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/14"
                  >
                    Book Private Ride for Another 2027 Date
                  </Link>
                </>
              ) : (
                <>
                  {isParrServedVenue(venueSlug) ? (
                    <Link
                      href={futureRideHref}
                      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff6b3d] px-7 text-xs font-black uppercase tracking-[0.14em] text-white no-underline shadow-[0_12px_30px_rgba(255,107,61,0.3)] transition hover:bg-[#ff7f56]"
                    >
                      {isRedRocksVenue
                        ? `Book Private Ride (${PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.allInTotalFormatted} / ${PARR_2027_OPTION_B_PRICING_AUTHORITY.van.allInTotalFormatted} Total)`
                        : "Request Private Venue Charter"}
                    </Link>
                  ) : null}
                  <Link
                    href="/red-rocks/concerts"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/8 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/14"
                  >
                    2027 Red Rocks Schedule →
                  </Link>
                  {e.sourceUrl || e.url ? (
                    <a
                      href={(e.sourceUrl || e.url) ?? undefined}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-black/30 px-5 text-xs font-bold uppercase tracking-[0.14em] text-white/85 no-underline transition hover:bg-white/10"
                    >
                      Official Event Source ↗
                    </a>
                  ) : null}
                </>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/55">
              {isRedRocksVenue ? (
                <span>
                  Official venue reference:{" "}
                  <a
                    href={e.sourceUrl || "https://www.redrocksonline.com/events/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/75 underline"
                  >
                    {e.sourceUrl ? "redrocksonline.com event listing" : "redrocksonline.com/events"}
                  </a>
                </span>
              ) : null}
              <span>
                Snapshot verified:{" "}
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

      {isPastShow && isRedRocksVenue ? (
        <section
          aria-labelledby="historical-rr-archive-heading"
          data-testid="historical-red-rocks-archive"
          className="mt-8 rounded-3xl border border-white/12 bg-[#0d1424] p-6 sm:p-8"
        >
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Red Rocks Concert Archive · {e.dateKey.slice(0, 4)} Season Record
          </div>
          <h2 id="historical-rr-archive-heading" className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Historical Show Summary: {e.title} ({fmtDate(e.datetime_local)})
          </h2>
          {curatedHistoricalNote ? (
            <p className="mt-3 text-base leading-7 text-white/84">
              {curatedHistoricalNote}
            </p>
          ) : null}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Billed Lineup &amp; Schedule Record
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/78">
                Performed at Red Rocks Amphitheatre (18300 W Alameda Pkwy, Morrison, CO · 6,450 ft) on{" "}
                <strong>{fmtDate(e.datetime_local)}</strong>
                {explicitTimeFormatted ? ` (${explicitTimeFormatted} MT listed start)` : ""}.
                {distinctBilledActs.length >= 2
                  ? ` Full billed lineup (${distinctBilledActs.length} acts): ${distinctBilledActs.join(", ")}.`
                  : primaryArtist
                    ? ` Headlined by ${primaryArtist}.`
                    : ""}
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                {companionRunShows.length > 0 ? "Multi-Night Red Rocks Run" : "Planning Future Red Rocks Nights"}
              </h3>
              {companionRunShows.length > 0 ? (
                <div className="mt-2 text-sm leading-6 text-white/78">
                  <p>
                    Part of a {companionRunShows.length + 1}-night {eventYear} Red Rocks run. Companion date
                    {companionRunShows.length > 1 ? "s" : ""}:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {companionRunShows.map((sib) => (
                      <li key={sib.id}>
                        <Link
                          href={`/shows/${encodeURIComponent(sib.id)}`}
                          className="font-semibold text-[#8fd0ff] underline hover:text-white"
                        >
                          {sib.name} — {fmtDate(sib.dateKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-2 text-sm leading-6 text-white/78">
                  Researching future {primaryArtist || "Red Rocks"} nights? Check{" "}
                  <Link href="/red-rocks/concerts" className="text-[#8fd0ff] underline hover:text-white">
                    upcoming 2027 Red Rocks concerts
                  </Link>{" "}
                  and{" "}
                  <Link href="/guide/tailgating" className="text-[#8fd0ff] underline hover:text-white">
                    Upper North Lot tailgating logistics
                  </Link>{" "}
                  before booking your group vehicle.
                </p>
              )}
            </article>
          </div>
        </section>
      ) : null}

      {isPastShow && verifiedFutureArtistDates.length > 0 ? (
        <section className="mt-8 rounded-3xl border border-[#8fd0ff]/30 bg-[#0d182d] p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Verified Future Dates for This Artist
          </div>
          <h2 className="mt-2 text-2xl font-black text-white">
            Upcoming {primaryArtist} Colorado Concerts
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {verifiedFutureArtistDates.map((ev) => (
              <article key={ev.id} className="rounded-2xl border border-white/12 bg-black/25 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#ffb07c]">{fmtDate(ev.dateKey)}</div>
                <h3 className="mt-1 text-base font-extrabold text-white">{ev.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`/shows/${encodeURIComponent(ev.id)}`} className="comic-btn comic-btn-secondary">
                    Upcoming Show Details
                  </Link>
                  {isRedRocksSlug(ev.venueId) ? (
                    <Link
                      href={buildBookingHref({
                        target: "private",
                        venue: "red-rocks-amphitheatre",
                        overrides: { event: ev.id, date: ev.dateKey, artist: ev.artistNames[0] ?? ev.name },
                      })}
                      className="comic-btn comic-btn-primary"
                    >
                      Book {ev.dateKey.slice(0, 4)} Private Ride
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {redRocksLogistics ? (
        <section
          aria-labelledby="parr-show-logistics-heading"
          data-testid="parr-show-logistics-guide"
          className="mt-8 rounded-3xl border border-white/12 bg-[#0d1424] p-6 sm:p-8"
        >
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Operator Show-Night Plan · Upper North Lot
          </div>
          <h2 id="parr-show-logistics-heading" className="mt-2 text-2xl font-black text-white sm:text-3xl">
            How Private Red Rocks Transportation Works for {e.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            {redRocksLogistics.timeGuidance}
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                1. Pickup & Tailgate Timing
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/78">
                {redRocksLogistics.pickupWindowGuidance}
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                2. Upper North Lot Setup
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/78">
                {redRocksLogistics.upperNorthTailgateGuidance}
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                3. Weather & Post-Encore Exit
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/78">
                {redRocksLogistics.weatherNote} {redRocksLogistics.postEncoreExitGuidance}
              </p>
            </article>
          </div>
          <p className="mt-4 text-xs text-white/55">
            Published all-in vehicle totals ({PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.allInTotalFormatted} Private Suburban: {PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.itemizedSummary}, up to 6 / {PARR_2027_OPTION_B_PRICING_AUTHORITY.van.allInTotalFormatted} Private Van: {PARR_2027_OPTION_B_PRICING_AUTHORITY.van.itemizedSummary}, up to 10) cover round-trip private service from Denver/Golden/Morrison. {PARR_COMPLETE_TOTAL_DISCLOSURE} Concert admission tickets, optional en-route purchases, and driver gratuity are not included.
          </p>
        </section>
      ) : null}

      {cleanArtists.length > 0 ? (
        <div className="mt-8 rounded-3xl border border-soft panel-soft p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Performers</div>
          <div className="mt-3 text-sm text-white/80">
            {cleanArtists.slice(0, 10).map((name, idx, arr) => (
              <span key={`${e.id}-${name}`}>
                <Link
                  href={`/artists/${encodeURIComponent(slugify(name))}`}
                  className="underline text-white/90 hover:text-white"
                >
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
                    {isPastShow ? "Historical Performance" : "Live Stage Bill"}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    {primaryArtist} {isPastShow ? "performed at" : "is scheduled at"}{" "}
                    <strong className="text-white">{venueName}</strong> on{" "}
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
              <h3 className="mt-2 text-xl font-black">
                {isPastShow ? "Archived Setlist" : "Recent Tour Setlist Reference"}
              </h3>
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
                <p className="mt-4 text-white/70">
                  {isPastShow
                    ? "No verified setlist was returned from Setlist.fm for this date."
                    : "Setlist will be posted after the performance concludes."}
                </p>
              )}
              <a
                href={setlistSearchUrl}
                target="_blank"
                rel="nofollow noopener"
                className="mt-4 inline-block underline text-white/80 hover:text-white"
              >
                Check Setlist.fm →
              </a>
            </article>
          </div>
        </section>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <section className="rounded-3xl border border-soft panel-soft p-6 md:col-span-2">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
            Red Rocks & Venue Planning Guides
          </div>
          <p className="mt-3 text-sm text-white/75">
            Planning an upcoming Red Rocks or Front Range concert night? Review arrival windows, bag rules, tailgating setup, and post-encore exit strategy ahead of time.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {venueSlug && venueSlug !== "1stbank-center" ? (
              <Link href={`/venues/${encodeURIComponent(venueSlug)}`} className="comic-btn comic-btn-secondary">
                Venue Guide
              </Link>
            ) : null}
            <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary">
              Red Rocks Transportation Hub
            </Link>
            <Link href="/guide/tailgating" className="comic-btn comic-btn-secondary">
              Upper North Tailgating Guide
            </Link>
            <Link href="/red-rocks/what-to-wear" className="comic-btn comic-btn-secondary">
              What to Wear by Month
            </Link>
            <Link href="/red-rocks/post-concert-exit-guide" className="comic-btn comic-btn-secondary">
              Post-Encore Exit Guide
            </Link>
          </div>
        </section>
        <section className="rounded-3xl border border-soft panel p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
            {isPastShow ? "Planning a 2027 Show?" : "Heading To This Show?"}
          </div>
          <p className="mt-3 text-sm text-white/75">
            {isPastShow
              ? `This concert date has passed—choose a verified 2027 Red Rocks show date to reserve a Private Suburban (${PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.allInTotalFormatted} total) or Van (${PARR_2027_OPTION_B_PRICING_AUTHORITY.van.allInTotalFormatted} total).`
              : isRedRocksVenue
                ? `Reserve your group's Private Suburban (${PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.allInTotalFormatted} total: ${PARR_2027_OPTION_B_PRICING_AUTHORITY.suv.itemizedSummary}) or 10-Passenger Van (${PARR_2027_OPTION_B_PRICING_AUTHORITY.van.allInTotalFormatted} total: ${PARR_2027_OPTION_B_PRICING_AUTHORITY.van.itemizedSummary}) before concert night.`
                : "Request private group transportation for an upcoming venue date."}
          </p>
          <div className="mt-4">
            <Link
              href={isPastShow ? "/book/red-rocks-amphitheatre/private" : futureRideHref}
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-cyan)] px-6 py-3 text-[12px] font-black uppercase tracking-[0.18em] text-[var(--brand-accent-text)] transition hover:bg-[var(--brand-cyan-hover)]"
            >
              {isPastShow
                ? "Book a Current 2027 Date"
                : isRedRocksVenue
                  ? "Book Private Ride"
                  : "Request Venue Ride"}
            </Link>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-soft panel-soft p-6">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
          Upcoming 2027 Red Rocks Concerts
        </div>
        {upcomingRedRocksShows.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {upcomingRedRocksShows.map((event) => (
              <article key={event.id} className="rounded-2xl border border-soft panel p-4">
                <p className="text-xs text-white/55">{fmtDate(event.dateKey)}</p>
                <h3 className="mt-1 text-sm font-extrabold text-white">{event.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                    Show Details
                  </Link>
                  <Link
                    href={buildBookingHref({
                      target: "private",
                      venue: "red-rocks-amphitheatre",
                      overrides: { event: event.id, date: event.dateKey, artist: event.artistNames[0] ?? event.name },
                    })}
                    className="comic-btn comic-btn-primary"
                  >
                    Book 2027 Ride
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-white/70">
            Browse the full{" "}
            <Link href="/red-rocks/concerts" className="underline text-white">
              2027 Red Rocks Concert Schedule
            </Link>{" "}
            for newly announced shows.
          </p>
        )}
      </section>

      {!isPastShow ? (
        <div className="mt-10">
          <TicketButtons />
        </div>
      ) : null}
    </main>
  );
}
