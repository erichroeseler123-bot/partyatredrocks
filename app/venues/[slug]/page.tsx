// app/venues/[slug]/page.tsx
import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import { VENUE_LEDGER_BY_SLUG, VENUE_LEDGER_REGISTRY } from "@/lib/venues/ledgerRegistry";
import MusicWave from "@/components/MusicWave";
import { getMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";

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

type VenueReference = {
  whatItIs: string;
  parking: string;
  pickupDropoff: string;
  nearby: string[];
  rideOptions: string;
  faq: Array<{ q: string; a: string }>;
};

type VenueCache = {
  generatedAt?: string;
  events: Array<{
    id: string;
    title: string;
    datetime_local: string;
    dateKey: string;
    sourceId: string | null;
    url?: string;
    performers?: Array<{ name?: string; image?: string }>;
    venue?: { siteSlug?: string; siteName?: string };
  }>;
};

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const DCC = process.env.NEXT_PUBLIC_DCC_ORIGIN || "https://destinationcommandcenter.com";
const EVENTS_SNAPSHOT_DIR = path.join(process.cwd(), "data", "snapshots", "events");

const SITE_KEYWORDS = [
  "Red Rocks shuttle",
  "Red Rocks transportation",
  "Red Rocks shuttle from Denver",
  "Red Rocks concert shuttle",
  "Denver concert shuttle",
  "concert transportation Denver",
  "party at red rocks",
];

const VENUE_REFERENCE_OVERRIDES: Record<string, Partial<VenueReference>> = {
  "mission-ballroom": {
    whatItIs:
      "Mission Ballroom is a large indoor Denver concert room with heavy event-night rideshare pressure and concentrated entry windows.",
    parking:
      "Expect paid lots/garages and variable event-night pricing. If you drive, lock in your lot plan early and assume slower outbound movement after sold-out shows.",
    pickupDropoff:
      "Use a single, specific meetup point and set it before doors. For groups, pre-assign a fallback point in case cellular service is delayed at close.",
    nearby: ["RiNo bars and breweries", "Five Points hotels", "Downtown Denver rail/light rail access"],
    faq: [
      {
        q: "How early should I arrive at Mission Ballroom?",
        a: "Arrive with a buffer for security, ticket scan, and event-night street congestion around the venue.",
      },
      {
        q: "Is rideshare easy after Mission Ballroom shows?",
        a: "It can compress quickly at close. A clear meetup point and fallback location reduces confusion.",
      },
    ],
  },
  "fiddlers-green-amphitheatre": {
    whatItIs:
      "Fiddler's Green is a high-capacity outdoor amphitheatre in the Greenwood Village corridor with large ingress/egress swings.",
    parking:
      "Parking and nearby traffic can bottleneck around show start and finale. Build extra arrival and exit buffer, especially for sold-out nights.",
    pickupDropoff:
      "Set your post-show pickup instructions before the encore. Keep one exact meet point and one backup location to avoid post-show drift.",
    nearby: ["DTC hotels", "Greenwood Village dining", "Belleview transit corridor"],
    faq: [
      {
        q: "What is the biggest mistake at Fiddler's Green?",
        a: "Waiting until the show ends to coordinate pickup details.",
      },
      {
        q: "Should groups pre-book transportation for Fiddler's Green?",
        a: "Yes. Pre-booking removes most post-show uncertainty and surge risk.",
      },
    ],
  },
  "fillmore-auditorium": {
    whatItIs:
      "Fillmore Auditorium is a historic Colfax corridor room with dense pre-show arrival windows and fast post-show curb competition.",
    parking:
      "Colfax-area lots and nearby garages fill quickly on stacked event nights. If driving, set your exact lot target before departure and expect slower egress after close.",
    pickupDropoff:
      "Use one named meetup point off Fillmore's front-door flow and share it with your full group before doors. Keep one backup block in case final-out crowds compress.",
    nearby: ["Capitol Hill hotels", "East Colfax bars", "16th Street and downtown transit links"],
    rideOptions:
      "Shared rides are efficient for standard Fillmore nights; private SUV/van options are better for groups that need tighter timing and single-party control.",
    faq: [
      {
        q: "Is pickup chaotic after Fillmore shows?",
        a: "It can be if pickup is decided at close on Colfax. Lock your meetup point in before the headliner starts.",
      },
      {
        q: "Should I pre-book transportation to Fillmore?",
        a: "Yes. Pre-booking removes post-show surge guessing and keeps your group on one exit plan.",
      },
    ],
  },
  "gothic-theatre": {
    whatItIs:
      "Gothic Theatre is a South Broadway anchor venue where event-night curb space is limited and timing discipline matters.",
    parking:
      "Street parking around South Broadway and Englewood side streets varies by show size. Build extra arrival time and avoid relying on last-minute circling.",
    pickupDropoff:
      "Choose a clear block-level pickup location off South Broadway's busiest curb zone and set a backup point before encore.",
    nearby: ["South Broadway bars", "Englewood hotels", "light rail + Broadway corridor transit"],
    rideOptions:
      "Shared rides work well for Gothic nights with flexible timing; private SUV/van rides reduce uncertainty for coordinated exits.",
    faq: [
      {
        q: "What is the best pickup strategy for Gothic Theatre?",
        a: "Pre-select a low-friction South Broadway side-street meetup point and send it to everyone before show close.",
      },
      {
        q: "When should we finalize our ride plan for Gothic?",
        a: "Finalize before doors or at least before encore to avoid post-show drift and split groups.",
      },
    ],
  },
  "cervantes-masterpiece": {
    whatItIs:
      "Cervantes' Masterpiece Ballroom is a multi-room Denver venue where staggered crowd release can create uneven pickup pressure.",
    parking:
      "Five Points lot and street conditions shift by lineup and neighboring events. Plan your arrival buffer and avoid improvising parking at the last minute.",
    pickupDropoff:
      "Set one designated meetup location and one fallback cross-street, especially for groups splitting between Cervantes and The Other Side.",
    nearby: ["Five Points nightlife", "RiNo corridor bars", "downtown lodging"],
    rideOptions:
      "Shared options fit most Cervantes nights; private rides are strongest when your group needs a hard departure window.",
    faq: [
      {
        q: "Why do groups get split after Cervantes shows?",
        a: "Different room schedules between Cervantes and The Other Side plus unplanned pickup points cause drift. Use one pre-agreed meetup protocol.",
      },
      {
        q: "Is private transportation better for late Cervantes nights?",
        a: "For groups prioritizing speed and cohesion, private SUV/van service is usually the cleaner exit.",
      },
    ],
  },
  "ogden-theatre": {
    whatItIs:
      "Ogden Theatre is a Colfax corridor venue with concentrated door times and heavy rideshare competition at close.",
    parking:
      "Nearby East Colfax street and paid parking can tighten quickly on sold nights. Plan your lot/garage decision before arriving in the corridor.",
    pickupDropoff:
      "Use a single East Colfax meetup block and backup instruction set before the encore to prevent split-party confusion.",
    nearby: ["Capitol Hill dining", "East Colfax venues", "downtown hotel access"],
    rideOptions:
      "Shared rides are efficient for most Ogden showgoers; private rides are ideal for groups that want one vehicle and one timeline.",
    faq: [
      {
        q: "Is post-show rideshare difficult at Ogden Theatre?",
        a: "It can spike quickly. Pre-booked transportation with a defined meetup point is more reliable.",
      },
      {
        q: "How early should I arrive for Ogden Theatre nights?",
        a: "Arrive with extra buffer for security line, East Colfax parking friction, and corridor traffic.",
      },
    ],
  },
  "ball-arena": {
    whatItIs:
      "Ball Arena is Denver's major downtown arena where ingress and egress patterns swing dramatically on Nuggets, Avs, and major concert nights.",
    parking:
      "Ball Arena lots and downtown garages can bottleneck before and after events. If driving, pre-select your lot and expect phased outbound traffic.",
    pickupDropoff:
      "Set exact post-event meetup instructions before the event starts, including a backup point outside peak curb compression near the arena exits.",
    nearby: ["LoDo hotels", "Union Station rail/transit", "downtown dining and bars"],
    rideOptions:
      "Shared options help reduce surge exposure on arena nights; private SUV/van rides are best for larger groups and strict timing needs.",
    faq: [
      {
        q: "What is the biggest transportation risk at Ball Arena?",
        a: "Waiting until event end to decide pickup. Arena exits compress fast; pre-plan the meetup.",
      },
      {
        q: "Should large groups use private rides for Ball Arena events?",
        a: "Yes. Private options usually provide cleaner coordination and faster regrouping after high-capacity arena events.",
      },
    ],
  },
};

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

function eventDateTimeLocal(e: { datetime_local: string }) {
  return e.datetime_local;
}

function parseNumericId(s: string | null | undefined): number | null {
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
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
          url: `${SITE}/find?date=${encodeURIComponent(e.dateKey)}&qty=2`,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

function toVenueEvents(
  allEvents: Awaited<ReturnType<typeof getEventsCatalog>>,
  venueSlug: string
): VenueCache["events"] {
  const now = new Date();
  const rows = allEvents
    .filter((event) => event.venueId === venueSlug)
    .map((event) => {
      const datetime_local = event.startLocal ?? event.startAt ?? `${event.dateKey}T19:00:00`;
      return {
        id: event.id,
        title: event.name,
        datetime_local,
        dateKey: event.dateKey,
        sourceId: event.sourceId,
        url: event.ticketUrl ?? undefined,
        performers: event.artistNames.map((name) => ({ name })),
        venue: { siteSlug: venueSlug, siteName: venueSlug },
      };
    })
    .filter((event) => {
      const dt = safeDate(event.datetime_local);
      return dt && dt >= now;
    })
    .sort((a, b) => eventDateTimeLocal(a).localeCompare(eventDateTimeLocal(b)));

  return rows.slice(0, 24);
}

async function readSnapshotGeneratedAt(year = 2026): Promise<string | null> {
  try {
    const raw = await readFile(path.join(EVENTS_SNAPSHOT_DIR, `all-${year}.json`), "utf8");
    const parsed = JSON.parse(raw) as { generatedAt?: string };
    return typeof parsed.generatedAt === "string" ? parsed.generatedAt : null;
  } catch {
    return null;
  }
}

function venueFaqJsonLd(slug: string, v: VenueRec) {
  const name = displayName(slug, v);
  const ref = getVenueReference(slug, v, name);
  const overrideFaq = ref.faq.slice(0, 2).map((row) => ({
    "@type": "Question",
    name: row.q,
    acceptedAnswer: { "@type": "Answer", text: row.a },
  }));
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
      ...overrideFaq,
    ],
  };
}

function getVenueReference(slug: string, v: VenueRec, name: string): VenueReference {
  const base: VenueReference = {
    whatItIs: `${name} is a core Front Range music venue with show-night ingress and exit patterns that reward early planning.`,
    parking:
      "Parking conditions vary by demand and event type. Plan arrival buffer and avoid deciding your lot strategy at the last minute.",
    pickupDropoff:
      "Set one exact pickup point and a fallback point before the show. Send instructions to your group before encore.",
    nearby: [`${v.city || "Denver"} hotels`, `${v.city || "Denver"} bars`, "Primary transit/arterial corridors"],
    rideOptions:
      "Shared shuttles reduce post-show uncertainty; private SUVs/vans are best for groups that need tighter timing and control.",
    faq: [
      {
        q: `What is the best transportation strategy for ${name}?`,
        a: "Pre-plan arrival and pickup timing. Build a clear meetup protocol before show close.",
      },
      {
        q: `When should I finalize pickup for ${name}?`,
        a: "Before encore. Last-minute pickup decisions are the most common failure point.",
      },
    ],
  };

  const override = VENUE_REFERENCE_OVERRIDES[slug];
  if (!override) return base;
  return {
    ...base,
    ...override,
    nearby: override.nearby ?? base.nearby,
    faq: override.faq ?? base.faq,
  };
}

export async function generateStaticParams() {
  const fromVenueData = Object.keys(venuesJson as Record<string, any>);
  const fromLedgerRegistry = VENUE_LEDGER_REGISTRY.map((venue) => venue.slug);
  const slugs = Array.from(new Set([...fromVenueData, ...fromLedgerRegistry]));
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normSlug(rawSlug);
  const identity = VENUE_LEDGER_BY_SLUG.get(slug);
  const v = getVenue(slug) ?? {};

  if (!identity && !getVenue(slug)) {
    return {
      title: "Venue | Party at Red Rocks",
      description:
        "Denver, Boulder & Colorado Springs concert shuttles, venue guides, and weekly show intel.",
      robots: { index: true, follow: true },
    };
  }

  const withIdentityName = {
    ...v,
    name: identity?.name ?? v.name,
  };
  const title = venueTitle(slug, withIdentityName);
  const description = venueDescription(slug, withIdentityName);
  const url = `${SITE}/venues/${slug}`;
  const media = await getMediaIndex(2026);
  const venueImage = selectImageByPriority({
    spotifyImage: media?.venuesById?.[slug]?.sources?.spotifyImage ?? null,
    ticketmasterImage: media?.venuesById?.[slug]?.sources?.ticketmasterImage ?? null,
    seatgeekImage: media?.venuesById?.[slug]?.sources?.seatgeekImage ?? null,
    localAsset: media?.venuesById?.[slug]?.sources?.localAsset ?? null,
    fallback: media?.venuesById?.[slug]?.sources?.fallback ?? "/og-default.jpg",
  });
  const venueImageUrl = venueImage.startsWith("http") ? venueImage : `${SITE}${venueImage}`;

  return {
    title,
    description,
    keywords: venueKeywords(slug, withIdentityName),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Party at Red Rocks",
      type: "website",
      images: [
        {
          url: venueImageUrl,
          width: 1200,
          height: 630,
          alt: `${displayName(slug, withIdentityName)} venue intel`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [venueImageUrl],
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
  const identity = VENUE_LEDGER_BY_SLUG.get(slug);
  if (!identity) return notFound();
  const v = getVenue(slug) ?? {};
  const name = identity.name;
  const city = cityLine(v);
  const reference = getVenueReference(slug, v, name);
  const dccVenueUrl = `${DCC}/venues/${slug}`;
  const [allEvents, updatedAt, media] = await Promise.all([
    getEventsCatalog(2026, "all"),
    readSnapshotGeneratedAt(2026),
    getMediaIndex(2026),
  ]);
  const events = toVenueEvents(allEvents, slug);
  const venueImage = selectImageByPriority({
    spotifyImage: media?.venuesById?.[slug]?.sources?.spotifyImage ?? null,
    ticketmasterImage: media?.venuesById?.[slug]?.sources?.ticketmasterImage ?? null,
    seatgeekImage: media?.venuesById?.[slug]?.sources?.seatgeekImage ?? null,
    localAsset: media?.venuesById?.[slug]?.sources?.localAsset ?? null,
    fallback: media?.venuesById?.[slug]?.sources?.fallback ?? "/images/venues/fallback.jpg",
  });

  return (
    <main className="comic-page pt-24 pb-10">
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
      <section className="comic-wrap">

      {/* HERO */}
      <div className="comic-hero rounded-[32px] border border-soft panel p-8 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
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
        <div className="mt-5">
          <img
            src={venueImage}
            alt={`${name} venue image`}
            style={{ width: "100%", maxWidth: 760, borderRadius: 18, border: "1px solid rgba(255,255,255,.14)" }}
          />
        </div>
        <div className="mt-4">
          <MusicWave bars={22} />
        </div>

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

      {/* VENUE REFERENCE */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-black">Venue Reference</h2>
          <div className="text-xs text-white/50">Info-first venue brief</div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-soft panel-soft p-6">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">What It Is</div>
            <p className="mt-3 text-sm text-white/75">{reference.whatItIs}</p>

            <div className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Capacity & Area</div>
            <p className="mt-3 text-sm text-white/75">
              {v?.capacity ? `Capacity ~${v.capacity.toLocaleString()}. ` : ""}
              {v?.neighborhood ? `${v.neighborhood} · ` : ""}
              {city}
            </p>

            <div className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Ride Options</div>
            <p className="mt-3 text-sm text-white/75">{reference.rideOptions}</p>
          </div>

          <div className="rounded-3xl border border-soft panel-soft p-6">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Parking</div>
            <p className="mt-3 text-sm text-white/75">{reference.parking}</p>

            <div className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Pickup / Dropoff</div>
            <p className="mt-3 text-sm text-white/75">{reference.pickupDropoff}</p>

            <div className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Nearby</div>
            <p className="mt-3 text-sm text-white/75">{reference.nearby.join(" · ")}</p>
          </div>
        </div>
      </section>

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
                  {parseNumericId(e.sourceId) ? (
                    <Link className="text-neon-blue font-bold" href={`/shows/${parseNumericId(e.sourceId)}`}>
                      Full Intel →
                    </Link>
                  ) : null}
                  <Link className="text-white/70 underline" href={`/find?date=${encodeURIComponent(e.dateKey)}&qty=2`}>
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
          <span className="font-black">Upcoming at {name}:</span> No upcoming events found in the current snapshot.
        </div>
      )}

      <section className="mt-10 rounded-3xl border border-soft panel-soft p-6">
        <h2 className="text-2xl font-black">Venue FAQ</h2>
        <div className="mt-4 space-y-3">
          {reference.faq.map((row) => (
            <details key={row.q} className="rounded-2xl border border-soft panel p-4">
              <summary className="cursor-pointer font-black">{row.q}</summary>
              <p className="mt-2 text-sm text-white/75">{row.a}</p>
            </details>
          ))}
        </div>
      </section>
      </section>
    </main>
  );
}
