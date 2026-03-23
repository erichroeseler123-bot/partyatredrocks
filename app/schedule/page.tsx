import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, Clock3, PhoneCall } from "lucide-react";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import { buildBookingHref } from "@/lib/parrHandoff";
import { getDynamicImage } from "@/lib/getDynamicImage";

export const revalidate = 3600;

const SITE = "https://www.partyatredrocks.com";

type CatalogEvent = Awaited<ReturnType<typeof getEventsCatalog>>[number];

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

export default async function SchedulePage() {
  const events = (await getEventsCatalog(2026, "redrocks"))
    .filter((event) => event.venueId === "red-rocks-amphitheatre")
    .sort((a, b) => {
      if (a.dateKey !== b.dateKey) return a.dateKey.localeCompare(b.dateKey);
      return a.name.localeCompare(b.name);
    });
  const eventImageMap = Object.fromEntries(
    await Promise.all(
      events.map(async (event) => [
        event.id,
        await getDynamicImage("artist", event.artistNames[0] || event.name, "/venues/rrsite.jpg"),
      ]),
    ),
  ) as Record<string, string>;

  const grouped = events.reduce<Record<string, CatalogEvent[]>>((acc, event) => {
    const key = monthLabel(event.dateKey);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <main className="bg-[#090909] text-[#f8f4ed]">
      <section className="mx-auto w-full max-w-[1500px] px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-[#f5c66c]/20 bg-[#12100e] shadow-[0_40px_120px_rgba(0,0,0,0.58)]">
          <div className="absolute inset-0">
            <Image
              src="/hero/hero-home.jpg"
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
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#f5c66c] backdrop-blur">
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
            Showing <span className="font-black text-white">{events.length}</span> Red Rocks concerts currently in the 2026 schedule feed.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/78">
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Fixed $59 Shared Seats</div>
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Private SUVs, Vans, Sprinters</div>
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Guaranteed Return Ride</div>
          </div>
        </div>

        <div className="mt-8 space-y-10">
          {Object.entries(grouped).map(([month, monthEvents]) => (
            <section key={month}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#f5c66c]/26 pb-3">
                <h2 className="text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">{month}</h2>
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/56">{monthEvents.length} shows</div>
              </div>

              <div className="mt-5 grid gap-4">
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

                  return (
                    <article
                      key={event.id}
                      className="rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(14,20,38,0.96),rgba(8,12,24,0.98))] shadow-[0_22px_70px_rgba(0,0,0,0.38)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(0,0,0,0.46)]"
                    >
                      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-white/12">
                            <Image
                              src={eventImageMap[event.id] || "/venues/rrsite.jpg"}
                              alt={`${event.name} artist photo`}
                              fill
                              className="object-cover"
                              sizes="128px"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,20,0.08),rgba(5,8,20,0.46))]" />
                          </div>
                          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/16 bg-white/8">
                            <CalendarDays className="h-4 w-4 text-[#f5c66c]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-black uppercase tracking-[-0.02em] text-white sm:text-xl">{event.name}</h3>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[#8fd0ff]">
                              <span>{dateLabel(event.dateKey)}</span>
                              {time ? (
                                <span className="inline-flex items-center gap-1 text-white/72">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {time}
                                </span>
                              ) : null}
                            </div>
                            {support ? (
                              <p className="mt-3 text-sm leading-6 text-white/74">
                                <span className="font-semibold text-white/84">Support:</span> {support}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-[250px]">
                          <Link
                            href={shuttleHref}
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ffd6a3]/26 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-4 text-xs font-black uppercase tracking-[0.16em] text-[#fff4de] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
                          >
                            Book Shuttle
                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={showHref}
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 bg-black/20 px-4 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
                          >
                            Open Show Page
                          </Link>
                        </div>
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
