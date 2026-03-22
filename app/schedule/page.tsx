import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Ticket } from "lucide-react";
import { getBookingVenueImage } from "@/data/media";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import { buildBookingHref } from "@/lib/parrHandoff";
import { seatgeekEventsByVenueId } from "@/lib/seatgeek";
import { getMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";

export const revalidate = 3600;

const SITE = "https://www.partyatredrocks.com";
const RED_ROCKS_SEATGEEK_VENUE_ID = 196;
const SHOW_FALLBACK = "/images/shows/fallback.webp";
const FALLBACK_IMAGE_SET = new Set([
  "/images/shows/fallback.jpg",
  "/images/shows/fallback.webp",
  SHOW_FALLBACK,
]);
const CURATED_SCHEDULE_IMAGES = [
  "/assets/venue/red-rocks/red-rocks-hero.webp",
  "/assets/venue/red-rocks/red-rocks-arrival.webp",
  "/venues/rrsite.jpg",
  "/hero/afterdark.jpg",
  "/images/marketing/shuttle.webp",
  "/fleet/fleet-sprinter.webp",
  "/fleet/fleet-suburban.jpg",
  "/hero/arrival.jpg",
] as const;

type CatalogEvent = Awaited<ReturnType<typeof getEventsCatalog>>[number];
type SeatGeekEvent = Awaited<ReturnType<typeof seatgeekEventsByVenueId>>[number];

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

function toTimeLabel(event: CatalogEvent) {
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

function getCuratedScheduleImage(event: CatalogEvent) {
  const index = hashString(event.id) % CURATED_SCHEDULE_IMAGES.length;
  return CURATED_SCHEDULE_IMAGES[index];
}

function isMeaningfulImage(imageUrl: string | null | undefined) {
  if (!imageUrl) return false;
  return !FALLBACK_IMAGE_SET.has(imageUrl);
}

function buildSeatGeekByDate(events: SeatGeekEvent[]) {
  const map = new Map<string, SeatGeekEvent[]>();
  for (const event of events) {
    const dateKey = event.datetime_local?.slice(0, 10);
    if (!dateKey) continue;
    const list = map.get(dateKey) || [];
    list.push(event);
    map.set(dateKey, list);
  }
  return map;
}

function scoreSeatGeekMatch(event: CatalogEvent, seatGeekEvent: SeatGeekEvent) {
  const catalogName = normalizeComparable(event.name);
  const catalogHeadliner = normalizeComparable(event.artistNames[0] || "");
  const sgTitle = normalizeComparable(seatGeekEvent.title);
  const sgHeadliner = normalizeComparable(seatGeekEvent.performers?.[0]?.name || "");

  let score = 0;

  if (catalogName && sgTitle && catalogName === sgTitle) score += 8;
  if (catalogName && sgTitle && (catalogName.includes(sgTitle) || sgTitle.includes(catalogName))) score += 5;

  if (catalogHeadliner && sgHeadliner && catalogHeadliner === sgHeadliner) score += 6;
  if (
    catalogHeadliner &&
    (catalogHeadliner === sgTitle || sgTitle.includes(catalogHeadliner) || catalogHeadliner.includes(sgTitle))
  ) {
    score += 4;
  }

  if (event.dateKey === seatGeekEvent.datetime_local?.slice(0, 10)) score += 2;

  return score;
}

function findSeatGeekMatch(event: CatalogEvent, byDate: Map<string, SeatGeekEvent[]>) {
  const candidates = byDate.get(event.dateKey) || [];
  if (!candidates.length) return null;

  let best: SeatGeekEvent | null = null;
  let bestScore = -1;

  for (const candidate of candidates) {
    const score = scoreSeatGeekMatch(event, candidate);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return bestScore >= 6 ? best : null;
}

export default async function SchedulePage() {
  const hero = getBookingVenueImage("red-rocks-amphitheatre");
  const events = (await getEventsCatalog(2026, "redrocks"))
    .filter((event) => event.venueId === "red-rocks-amphitheatre")
    .sort((a, b) => {
      if (a.dateKey !== b.dateKey) return a.dateKey.localeCompare(b.dateKey);
      return a.name.localeCompare(b.name);
    });

  const mediaIndex = await getMediaIndex(2026);

  let seatGeekByDate = new Map<string, SeatGeekEvent[]>();
  try {
    const seatGeekEvents = await seatgeekEventsByVenueId(RED_ROCKS_SEATGEEK_VENUE_ID);
    seatGeekByDate = buildSeatGeekByDate(seatGeekEvents);
  } catch {
    // Keep schedule rendering if SeatGeek key is missing or API is unavailable.
  }

  const grouped = events.reduce<Record<string, CatalogEvent[]>>((acc, event) => {
    const key = monthLabel(event.dateKey);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="relative h-[340px] overflow-hidden border-b border-white/12 sm:h-[420px]">
        <Image
          src={hero.hero}
          alt={hero.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,18,0.42),rgba(6,9,18,0.9))]" />
        <div className="relative mx-auto flex h-full w-full max-w-[1240px] flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/14 bg-black/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#8fd0ff]">
            <CalendarDays className="h-3.5 w-3.5" />
            Red Rocks 2026
          </div>
          <h1 className="mt-4 max-w-4xl text-[2.2rem] font-black uppercase leading-[0.92] tracking-[-0.04em] sm:text-[3.5rem]">
            Full Concert Schedule
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/78 sm:text-[15px]">
            Month-by-month Red Rocks listings with direct show pages and shuttle booking links.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-white/12 bg-white/5 p-5 sm:p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">Schedule summary</div>
          <p className="mt-2 text-sm leading-6 text-white/82 sm:text-[15px]">
            Showing <span className="font-black text-white">{events.length}</span> Red Rocks concerts currently in the 2026 schedule feed.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/book/red-rocks-amphitheatre"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ffd6a3]/28 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-5 text-xs font-black uppercase tracking-[0.16em] text-[#fff4de] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
            >
              Start Booking
            </Link>
            <Link
              href="/quick-red-rocks"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 bg-black/20 px-5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Open Ride Wizard
            </Link>
          </div>
        </div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([month, monthEvents]) => (
            <section key={month}>
              <h2 className="border-b border-[#f5c66c]/32 pb-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
                {month}
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {monthEvents.map((event) => {
                  const support = event.artistNames.slice(1).join(", ");
                  const time = toTimeLabel(event);
                  const showHref = `/shows/${event.id}`;
                  const shuttleHref = buildBookingHref({
                    target: "shared",
                    venue: "red-rocks-amphitheatre",
                    overrides: {
                      event: event.id,
                      artist: event.artistNames[0] || event.name,
                      date: event.dateKey,
                    },
                  });

                  const mediaRow = mediaIndex?.eventsById?.[event.id];
                  const mediaSnapshotCandidate = mediaRow
                    ? selectImageByPriority({
                        seatgeekImage: mediaRow.sources?.seatgeekImage,
                        ticketmasterImage: mediaRow.sources?.ticketmasterImage,
                        blobImage: mediaRow.sources?.blobImage,
                        localAsset: mediaRow.sources?.localAsset,
                        fallback: mediaRow.sources?.fallback,
                      })
                    : null;
                  const mediaSnapshotImage = isMeaningfulImage(mediaSnapshotCandidate) ? mediaSnapshotCandidate : null;

                  const seatGeekMatch = findSeatGeekMatch(event, seatGeekByDate);
                  const seatGeekImage = seatGeekMatch?.performers?.find((performer) => performer.image)?.image || null;
                  const eventImage =
                    seatGeekImage ||
                    (isMeaningfulImage(event.image) ? event.image : null) ||
                    mediaSnapshotImage ||
                    getCuratedScheduleImage(event);

                  return (
                    <article
                      key={event.id}
                      className="overflow-hidden rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(14,20,38,0.96),rgba(8,12,24,0.98))] shadow-[0_22px_70px_rgba(0,0,0,0.38)]"
                    >
                      <Link href={showHref} className="no-underline">
                        <div className="relative h-44 w-full border-b border-white/10 bg-black/20">
                          <Image
                            src={eventImage}
                            alt={`${event.name} at Red Rocks`}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,20,0.08),rgba(5,8,20,0.65))]" />
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-black uppercase tracking-[-0.02em] text-white sm:text-xl">{event.name}</h3>
                          <p className="mt-2 text-sm font-semibold text-[#8fd0ff]">{dateLabel(event.dateKey)}</p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/64">
                            {time ? (
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-3.5 w-3.5" />
                                {time}
                              </span>
                            ) : null}
                            <span className="inline-flex items-center gap-1">
                              <Ticket className="h-3.5 w-3.5" />
                              Show page
                            </span>
                          </div>
                          {support ? (
                            <p className="mt-3 text-sm leading-6 text-white/70">
                              <span className="font-semibold text-white/82">Support:</span> {support}
                            </p>
                          ) : null}
                        </div>
                      </Link>

                      <div className="px-5 pb-5">
                        <Link
                          href={shuttleHref}
                          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#ffd6a3]/26 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-4 text-xs font-black uppercase tracking-[0.16em] text-[#fff4de] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
                        >
                          Book Shuttle To This Show
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

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
