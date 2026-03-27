import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, Clock3, PhoneCall } from "lucide-react";
import { getEnrichedArtistsCatalog, getEventsCatalog } from "@/lib/events/getCatalog";
import { buildBookingHref } from "@/lib/parrHandoff";
import { ANNOUNCED_RED_ROCKS_2026 } from "@/data/red-rocks-2026-announced";
import ScheduleExplorer, { type ScheduleExplorerEvent } from "@/components/schedule/ScheduleExplorer";
import { getDynamicImage } from "@/lib/getDynamicImage";
import { selectImageByPriority } from "@/lib/media/selectImage";

export const revalidate = 3600;

const SITE = "https://www.partyatredrocks.com";
const CURATED_SCHEDULE_IMAGES = [
  "/hero/hero-home.jpg",
  "/hero/hero-guides.jpg",
  "/images/marketing/shuttle.jpg",
  "/images/marketing/vip-suv.jpg",
  "/images/marketing/fleet.jpg",
  "/venues/rrsite.jpg",
] as const;

type CatalogEvent = Awaited<ReturnType<typeof getEventsCatalog>>[number];
type ScheduleEvent = {
  id: string;
  showId: string | null;
  name: string;
  dateKey: string;
  artistNames: string[];
  startAt: string | null;
  startLocal: string | null;
  image: string | null;
  source: "catalog" | "announced";
};

export const metadata: Metadata = {
  title: "Red Rocks Amphitheatre 2026 Full Concert Schedule | Party at Red Rocks Shuttle",
  description:
    "Red Rocks 2026 concert schedule with month-by-month listings, show pages, and direct shuttle booking links.",
  alternates: { canonical: `${SITE}/schedule` },
  openGraph: {
    title: "Red Rocks Amphitheatre 2026 Full Concert Schedule | Party at Red Rocks Shuttle",
    description:
      "Scan the 2026 Red Rocks concert calendar by month and book shared or private rides for your show night.",
    url: `${SITE}/schedule`,
    type: "website",
  },
};

function toTimeLabel(event: ScheduleEvent) {
  const raw = event.startLocal || event.startAt;
  if (!raw) return null;
  const date = new Date(raw);
  if (!Number.isFinite(date.getTime())) return null;
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function monthLabel(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function dateLabel(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeComparable(value: string | null | undefined) {
  return (value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function getCuratedScheduleImage(event: ScheduleEvent) {
  const index = hashString(event.id) % CURATED_SCHEDULE_IMAGES.length;
  return CURATED_SCHEDULE_IMAGES[index];
}

export default async function SchedulePage() {
  const catalogEvents = (await getEventsCatalog(2026, "redrocks"))
    .filter((event) => event.venueId === "red-rocks-amphitheatre")
    .sort((a, b) => {
      if (a.dateKey !== b.dateKey) return a.dateKey.localeCompare(b.dateKey);
      return a.name.localeCompare(b.name);
    });

  const normalizedEventKey = (dateKey: string, name: string) =>
    `${dateKey}::${normalizeComparable(name)}`;

  const mergedByKey = new Map<string, ScheduleEvent>();

  for (const announced of ANNOUNCED_RED_ROCKS_2026) {
    const key = normalizedEventKey(announced.dateKey, announced.name);
    mergedByKey.set(key, {
      id: announced.id,
      showId: null,
      name: announced.name,
      dateKey: announced.dateKey,
      artistNames: [announced.headliner],
      startAt: null,
      startLocal: null,
      image: null,
      source: "announced",
    });
  }

  for (const event of catalogEvents) {
    const key = normalizedEventKey(event.dateKey, event.name);
    mergedByKey.set(key, {
      id: event.id,
      showId: event.id,
      name: event.name,
      dateKey: event.dateKey,
      artistNames: event.artistNames.length ? event.artistNames : [event.name],
      startAt: event.startAt,
      startLocal: event.startLocal,
      image: event.image,
      source: "catalog",
    });
  }

  const events = Array.from(mergedByKey.values())
    .filter((event) => event.dateKey >= "2026-03-01")
    .sort((a, b) => {
      if (a.dateKey !== b.dateKey) return a.dateKey.localeCompare(b.dateKey);
      return a.name.localeCompare(b.name);
    });

  const [heroImage, enrichedArtists, eventImageMap] = await Promise.all([
    getDynamicImage("venue", "Red Rocks Amphitheatre concert night", "/hero/hero-home.jpg"),
    getEnrichedArtistsCatalog(2026, "all"),
    Promise.all(
      events.map(async (event) => [
        event.id,
        await getDynamicImage(
          "concert",
          `${event.artistNames[0] || event.name} red rocks concert`,
          getCuratedScheduleImage(event),
        ),
      ]),
    ).then((entries) => Object.fromEntries(entries) as Record<string, string>),
  ]);
  const artistSpotifyImageMap = Object.fromEntries(
    enrichedArtists
      .filter((row) => row.name && row.spotifyImage)
      .map((row) => [row.name.trim().toLowerCase(), row.spotifyImage as string]),
  );

  const grouped = events.reduce<Record<string, ScheduleEvent[]>>((acc, event) => {
    const key = monthLabel(event.dateKey);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});
  const scheduleEvents: ScheduleExplorerEvent[] = Object.entries(grouped).flatMap(([month, monthEvents]) =>
    monthEvents.map((event) => {
      const support = event.artistNames.slice(1).join(", ") || null;
      const showHref = event.showId ? `/shows/${event.showId}` : "https://www.redrocksonline.com/events/";
      const shuttleHref = buildBookingHref({
        target: "shared",
        venue: "red-rocks-amphitheatre",
        overrides: {
          artist: event.artistNames[0] || event.name,
          date: event.dateKey,
          ...(event.showId ? { event: event.showId } : {}),
        },
      });

      return {
        id: event.id,
        month,
        name: event.name,
        dateLabel: dateLabel(event.dateKey),
        timeLabel: toTimeLabel(event),
        support,
        image: selectImageByPriority({
          entityType: "artist",
          title: event.name,
          artistName: event.artistNames[0] || event.name,
          queryHint: `${event.artistNames[0] || event.name} live music artist portrait`,
          alt: `${event.artistNames[0] || event.name} artist image`,
          spotifyImage: artistSpotifyImageMap[(event.artistNames[0] || "").trim().toLowerCase()] ?? null,
          fallback: eventImageMap[event.id] || "/venues/rrsite.jpg",
        }),
        shuttleHref,
        showHref,
        showLabel: event.showId ? "Open Show Page" : "Official Listing",
        showExternal: !event.showId,
      };
    }),
  );

  return (
    <main className="bg-[#090909] text-[#f8f4ed]">
      <section className="mx-auto w-full max-w-[1500px] px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-[#f5c66c]/20 bg-[#12100e] shadow-[0_40px_120px_rgba(0,0,0,0.58)]">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Red Rocks Amphitheatre at night"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(9,9,9,0.88)_0%,rgba(9,9,9,0.62)_46%,rgba(9,9,9,0.9)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,198,108,0.26),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
          </div>

          <div className="relative px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <div className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#f5c66c] backdrop-blur">
              <CalendarDays className="h-3.5 w-3.5" />
              Red Rocks 2026
            </div>

            <h1 className="mt-4 max-w-5xl text-[2.5rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white sm:text-[4rem] lg:text-[5.2rem]">
              Full 2026 Concert Schedule
              <span className="block text-[#f5c66c]">Book Your Shuttle Ride</span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
              Browse every announced Red Rocks date, open the show page, and lock transportation in one clean flow.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/14 bg-white/7 px-4 text-[11px] font-black uppercase tracking-[0.16em] text-white/88">
                <BadgeCheck className="h-3.5 w-3.5 text-[#8fd0ff]" />
                Secure Booking
              </div>
              <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/14 bg-white/7 px-4 text-[11px] font-black uppercase tracking-[0.16em] text-white/88">
                <PhoneCall className="h-3.5 w-3.5 text-[#f5c66c]" />
                Call 720-369-6292
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 rounded-[26px] border border-white/12 bg-[linear-gradient(180deg,rgba(12,18,36,0.96),rgba(8,12,24,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">Schedule Summary</div>
          <p className="mt-2 text-sm leading-6 text-white/82 sm:text-[15px]">
            Showing <span className="font-black text-white">{events.length}</span> Red Rocks concerts from March 2026 forward.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/78">
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Fixed $59 Shared Seats</div>
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Private SUVs, Vans, Sprinters</div>
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Guaranteed Return Ride</div>
          </div>
        </div>

        <ScheduleExplorer events={scheduleEvents} />

        <div className="mt-12 rounded-2xl border border-white/12 bg-white/5 p-5 text-sm leading-6 text-white/72 sm:p-6">
          More events are added regularly. For official updates, check{" "}
          <a
            href="https://www.redrocksonline.com/events/"
            target="_blank"
            rel="noreferrer noopener"
            className="font-semibold text-[#8fd0ff] underline underline-offset-2"
          >
            redrocksonline.com/events
          </a>{" "}
          and{" "}
          <a
            href="https://www.axs.com/venues/101164/red-rocks-amphitheatre-morrison-tickets"
            target="_blank"
            rel="noreferrer noopener"
            className="font-semibold text-[#8fd0ff] underline underline-offset-2"
          >
            AXS Red Rocks listings
          </a>
          .
        </div>
      </section>
    </main>
  );
}
