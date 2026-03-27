import Link from "next/link";
import { ArrowRight, CalendarDays, MapPinned, Sparkles } from "lucide-react";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

export const revalidate = 3600;

type VenueSchedule = {
  venueId: string;
  venueName: string;
  total: number;
  nextDate: string | null;
};

function buildVenueSchedules(events: Awaited<ReturnType<typeof getEventsCatalog>>): VenueSchedule[] {
  const counts = new Map<string, VenueSchedule>();

  for (const event of events) {
    const row = counts.get(event.venueId) ?? {
      venueId: event.venueId,
      venueName: VENUE_LEDGER_BY_SLUG.get(event.venueId)?.name ?? event.venueId,
      total: 0,
      nextDate: null,
    };
    row.total += 1;
    if (!row.nextDate || event.dateKey < row.nextDate) row.nextDate = event.dateKey;
    counts.set(event.venueId, row);
  }

  return Array.from(counts.values()).sort((a, b) => a.venueName.localeCompare(b.venueName));
}

function nextDateLabel(raw: string | null) {
  if (!raw) return "Dates updating";
  return new Date(`${raw}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function WeekPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const events = await getEventsCatalog(2026, "all");
  const schedules = buildVenueSchedules(events);
  const faqRows = await getFaqRowsWithGlobal("week/index.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  return (
    <main className="brand-page bg-[radial-gradient(circle_at_top,rgba(255,91,46,0.15),transparent_26%),radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.14),transparent_18%),linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_100%)] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}

        <section className="brand-panel relative overflow-hidden rounded-[32px] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
              <Sparkles className="h-3.5 w-3.5" />
              Upcoming Shows
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              This Week
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Browse venues and upcoming shows, then move into the right ride for the night.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="brand-button-primary inline-flex min-h-12 items-center justify-center px-6 text-sm font-black uppercase tracking-[0.16em]"
              >
                Book a Ride
              </Link>
              <Link
                href="/week/red-rocks"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Red Rocks Lineup
              </Link>
              <Link
                href="/guide"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Guides
              </Link>
            </div>
          </div>
        </section>

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
            Venue Schedules
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
            Pick a venue and plan your ride.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            Open a venue, check the lineup, and move into ride options when you are ready.
          </p>

          {schedules.length === 0 ? (
            <div className="brand-card mt-6 rounded-[24px] p-6 text-white/68">
              No venue schedules found yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {schedules.map((schedule) => (
                <article
                  key={schedule.venueId}
                  className="brand-card rounded-[26px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
                >
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Next {nextDateLabel(schedule.nextDate)}
                  </div>
                  <h3 className="mt-3 text-2xl font-black text-white">{schedule.venueName}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {schedule.total} show{schedule.total === 1 ? "" : "s"} on the board right now.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={buildBookingHref({
                        target: "book",
                        venue: schedule.venueId,
                        searchParams: sp,
                      })}
                      className="brand-button-primary inline-flex min-h-11 items-center px-4 text-xs font-black uppercase tracking-[0.16em]"
                    >
                      Get a Ride
                    </Link>
                    <Link
                      href={`/venues/${encodeURIComponent(schedule.venueId)}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
                    >
                      Venue Details
                    </Link>
                    {schedule.venueId === "red-rocks-amphitheatre" ? (
                      <Link
                        href="/week/red-rocks"
                        className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
                      >
                        Red Rocks Lineup
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="brand-card rounded-[30px] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-orange)]">
            High-Intent Links
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { href: "/venues/red-rocks-amphitheatre", label: "Red Rocks" },
              { href: "/venues/mission-ballroom", label: "Mission Ballroom" },
              { href: "/venues/fiddlers-green-amphitheatre", label: "Fiddler's Green" },
              { href: "/guide/transportation/shuttle-vs-uber", label: "Shuttle vs Uber" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <FAQBlock title="Week Schedule FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
