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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  return `${displayName(slug, v)} | Venue Guide + Ride Options | Party at Red Rocks`;
}

function venueDescription(slug: string, v: VenueRec) {
  const name = displayName(slug, v);
  const city = cityLine(v);
  const cap = v?.capacity ? `Capacity ~${v.capacity.toLocaleString()}. ` : "";
  return `${name} in ${city}. ${cap}Upcoming shows, venue details, and ride options across Denver, Boulder, and Colorado venues — book your ride before show night.`;
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
          name: "Ride Options",
          url: `${SITE}/book?venue=${encodeURIComponent(slug)}&date=${encodeURIComponent(e.dateKey)}&qty=2`,
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
        "Denver, Boulder, and Colorado concert shuttles, venue guides, and weekly show details.",
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
          alt: `${displayName(slug, withIdentityName)} venue guide`,
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
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
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
      <div className="comic-hero rounded-[32px] border border-white/10 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Venue Guide
          </div>

          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/72">
            {city}
          </div>

          {v?.kind ? (
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/72">
              {v.kind}
            </div>
          ) : null}

          {v?.capacity ? (
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/72">
              ~{v.capacity.toLocaleString()} cap
            </div>
          ) : null}
        </div>

        <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
          {name}
        </h1>

        <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/74 sm:text-lg">
          Upcoming shows, venue details, and ride options for a smoother concert night from pickup to the ride home.
        </p>
        <div className="mt-5">
          <img
            src={venueImage}
            alt={`${name} venue – ${reference.whatItIs || "live music venue overview"}`}
            width={760}
            height={428}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", maxWidth: 760, borderRadius: 18, border: "1px solid rgba(255,255,255,.14)" }}
          />
        </div>
        <div className="mt-4">
          <MusicWave bars={22} />
        </div>

        <div className="mt-7 flex w-full flex-col flex-wrap items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href={`/book?venue=${slug}`}
            className="inline-flex min-h-12 w-full min-w-[180px] items-center justify-center rounded-full bg-[#ff5b2e] px-7 py-3 text-center text-[12px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#ff7148] sm:w-auto"
          >
            Book this venue
          </Link>

          <Link
            href="/week"
            className="inline-flex min-h-12 w-full min-w-[180px] items-center justify-center rounded-full border border-white/14 bg-white/6 px-7 py-3 text-center text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:bg-white/10 sm:w-auto"
          >
            This Week →
          </Link>

          <a
            href={dccVenueUrl}
            target="_blank"
            rel="nofollow noopener"
            className="inline-flex min-h-12 w-full min-w-[180px] items-center justify-center rounded-full border border-white/14 bg-white/6 px-7 py-3 text-center text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:bg-white/10 sm:w-auto"
            title="Open venue details on DCC"
          >
            More Venue Details →
          </a>
        </div>

        <div className="mt-4 text-xs text-white/45">
          Feed updated:{" "}
          {updatedAt ? (
            <time dateTime={updatedAt}>{updatedAt}</time>
          ) : (
            "Update pending"
          )}
        </div>
      </div>

      {/* 3-CARD INTEL */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Arrival Flow
          </div>
          <p className="mt-3 text-sm leading-6 text-white/75">
            Dial in the arrival window, dropoff plan, and meetup timing so the night starts clean and on pace.
          </p>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Return Plan
          </div>
          <p className="mt-3 text-sm leading-6 text-white/75">
            Know where to regroup, when to move, and how the ride back home is handled after the encore.
          </p>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Options
          </div>
          <p className="mt-3 text-sm leading-6 text-white/75">
            Shared seats and private upgrades depending on the night. Pick the ride style that fits your crew.
          </p>
          <Link href="/venues" className="mt-4 inline-flex text-sm font-bold text-[#ffb07c] hover:text-white">
            Browse all venues →
          </Link>
        </div>
      </div>

      {/* VENUE REFERENCE */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[-0.03em]">Venue Reference</h2>
          <div className="text-xs uppercase tracking-[0.18em] text-white/50">Info-first venue brief</div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">What It Is</div>
            <p className="mt-3 text-sm leading-6 text-white/75">{reference.whatItIs}</p>

            <div className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Capacity & Area</div>
            <p className="mt-3 text-sm leading-6 text-white/75">
              {v?.capacity ? `Capacity ~${v.capacity.toLocaleString()}. ` : ""}
              {v?.neighborhood ? `${v.neighborhood} · ` : ""}
              {city}
            </p>

            <div className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Ride Options</div>
            <p className="mt-3 text-sm leading-6 text-white/75">{reference.rideOptions}</p>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Parking</div>
            <p className="mt-3 text-sm leading-6 text-white/75">{reference.parking}</p>

            <div className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Pickup / Dropoff</div>
            <p className="mt-3 text-sm leading-6 text-white/75">{reference.pickupDropoff}</p>

            <div className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Nearby</div>
            <p className="mt-3 text-sm leading-6 text-white/75">{reference.nearby.join(" · ")}</p>
          </div>
        </div>
      </section>

      {slug === "mission-ballroom" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Mission Ballroom Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/mission-ballroom/concerts" className="comic-btn comic-btn-secondary">
              Concert Schedule
            </Link>
            <Link href="/venues/mission-ballroom/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/mission-ballroom/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/mission-ballroom/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/mission-ballroom/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            Plan your night at Denver&apos;s premier indoor venue with fast entry and cleaner post-show exits.
          </p>
        </section>
      ) : null}

      {slug === "fiddlers-green-amphitheatre" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Fiddler&apos;s Green Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/fiddlers-green-amphitheatre/concerts" className="comic-btn comic-btn-secondary">
              Concert Schedule
            </Link>
            <Link href="/venues/fiddlers-green-amphitheatre/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/fiddlers-green-amphitheatre/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/fiddlers-green-amphitheatre/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/fiddlers-green-amphitheatre/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            Large outdoor amphitheatre in Greenwood Village with lawn plus reserved seating and major Denver metro draw.
          </p>
        </section>
      ) : null}

      {slug === "ogden-theatre" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Ogden Theatre Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/ogden-theatre/concerts" className="comic-btn comic-btn-secondary">
              Concert Schedule
            </Link>
            <Link href="/venues/ogden-theatre/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/ogden-theatre/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/ogden-theatre/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/ogden-theatre/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            Historic Colfax venue with high turnover exits and strong transit adjacency.
          </p>
        </section>
      ) : null}

      {slug === "fillmore-auditorium" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Fillmore Auditorium Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/fillmore-auditorium/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/fillmore-auditorium/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/fillmore-auditorium/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/fillmore-auditorium/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            Historic Denver venue - 3,900 capacity, GA floor + balcony, strong local legacy.
          </p>
        </section>
      ) : null}

      {slug === "bluebird-theater" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Bluebird Theater Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/bluebird-theater/concerts" className="comic-btn comic-btn-secondary">
              Concert Schedule
            </Link>
            <Link href="/venues/bluebird-theater/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/bluebird-theater/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/bluebird-theater/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/bluebird-theater/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            East Colfax venue with fast door windows and high curb competition at close.
          </p>
        </section>
      ) : null}

      {slug === "paramount-theatre" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Paramount Theatre Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/paramount-theatre/concerts" className="comic-btn comic-btn-secondary">
              Concert Schedule
            </Link>
            <Link href="/venues/paramount-theatre/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/paramount-theatre/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/paramount-theatre/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/paramount-theatre/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            Downtown theatre with larger exit waves and strong post-show rideshare pressure.
          </p>
        </section>
      ) : null}

      {slug === "summit-music-hall" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Summit Music Hall Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/summit-music-hall/concerts" className="comic-btn comic-btn-secondary">
              Concert Schedule
            </Link>
            <Link href="/venues/summit-music-hall/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/summit-music-hall/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/summit-music-hall/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/summit-music-hall/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            LoDo room with quick crowd turnover and curb competition after headliners.
          </p>
        </section>
      ) : null}

      {slug === "levitt-pavilion-denver" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Levitt Pavilion Denver Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/levitt-pavilion-denver/concerts" className="comic-btn comic-btn-secondary">
              Concert Schedule
            </Link>
            <Link href="/venues/levitt-pavilion-denver/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/levitt-pavilion-denver/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/levitt-pavilion-denver/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/levitt-pavilion-denver/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            Outdoor Denver amphitheatre where post-show exit timing heavily affects pickup ease.
          </p>
        </section>
      ) : null}

      {slug === "1stbank-center" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">1stBank Center Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/1stbank-center/concerts" className="comic-btn comic-btn-secondary">
              Concert Schedule
            </Link>
            <Link href="/venues/1stbank-center/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/1stbank-center/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/1stbank-center/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/1stbank-center/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            Large Broomfield arena with major tours, ample parking, and strong post-show traffic peaks.
          </p>
        </section>
      ) : null}

      {slug === "ball-arena" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Ball Arena Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/ball-arena/concerts" className="comic-btn comic-btn-secondary">
              Concert Schedule
            </Link>
            <Link href="/venues/ball-arena/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/ball-arena/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/ball-arena/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/ball-arena/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            Downtown Denver mega-arena with major tours, huge entries, and heavy post-show traffic peaks.
          </p>
        </section>
      ) : null}

      {slug === "gothic-theatre" ? (
        <section className="comic-panel" style={{ marginTop: 32 }}>
          <div className="comic-tag">Gothic Theatre Quick Guides</div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Link href="/venues/gothic-theatre/concerts" className="comic-btn comic-btn-secondary">
              Concert Schedule
            </Link>
            <Link href="/venues/gothic-theatre/best-time-to-arrive" className="comic-btn comic-btn-secondary">
              Best Time to Arrive
            </Link>
            <Link href="/venues/gothic-theatre/parking" className="comic-btn comic-btn-secondary">
              Parking Strategy
            </Link>
            <Link href="/venues/gothic-theatre/transportation" className="comic-btn comic-btn-secondary">
              Transportation & Rides
            </Link>
            <Link href="/venues/gothic-theatre/map" className="comic-btn comic-btn-secondary">
              Venue Map
            </Link>
          </div>
          <p className="comic-copy text-center mt-4 opacity-80">
            South Broadway classic with dense door windows and fast post-show curb competition.
          </p>
        </section>
      ) : null}

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
                className="rounded-[26px] border border-white/10 bg-[#0b1224] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
              >
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                  {new Date(e.datetime_local).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>

                <div className="mt-2 text-lg font-black text-white">{e.title}</div>

                <div className="mt-2 text-sm leading-6 text-white/70">
                  {(e.performers ?? [])
                    .map((p) => p?.name)
                    .filter((name): name is string => Boolean(name))
                    .map((name, idx, arr) => (
                      <span key={`${e.id}-${name}`}>
                        <Link href={`/artists/${encodeURIComponent(slugify(name))}`} className="text-white/80 underline hover:text-white">
                          {name}
                        </Link>
                        {idx < arr.length - 1 ? ", " : ""}
                      </span>
                    ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link className="font-bold text-[#ffb07c] hover:text-white" href={`/shows/${encodeURIComponent(e.id)}`}>
                    Full Intel →
                  </Link>
                  <Link className="text-white/70 underline hover:text-white" href={`/book?venue=${encodeURIComponent(slug)}`}>
                    Ride Options
                  </Link>
                  {e.url ? (
                    <a className="text-white/70 underline hover:text-white" href={e.url} target="_blank" rel="nofollow noopener">
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
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:bg-white/10"
            >
              All-Venue Shuttle
            </Link>
            <Link
              href={`/book?venue=${slug}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 py-3 text-[12px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#ff7148]"
            >
              Book Now
            </Link>
          </div>
        </section>
      ) : (
        <div className="mt-10 rounded-[26px] border border-white/10 bg-[#0b1224] p-6 text-white/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
          <span className="font-black">Upcoming at {name}:</span> No upcoming events found in the current snapshot.
        </div>
      )}

      <section className="mt-10 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,24,0.98),rgba(6,9,18,0.98))] p-6">
        <h2 className="text-2xl font-black uppercase tracking-[-0.03em]">Venue FAQ</h2>
        <div className="mt-4 space-y-3">
          {reference.faq.map((row) => (
            <details key={row.q} className="rounded-[22px] border border-white/10 bg-[#0b1224] p-4">
              <summary className="cursor-pointer font-black">{row.q}</summary>
              <p className="mt-2 text-sm leading-6 text-white/75">{row.a}</p>
            </details>
          ))}
        </div>
      </section>
      </section>
    </main>
  );
}
