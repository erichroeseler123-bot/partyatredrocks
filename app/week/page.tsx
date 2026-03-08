import Link from "next/link";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import FAQBlock from "@/components/FAQBlock";
import { getFaqRowsWithGlobal } from "@/lib/faqs/getFaqs";
import { buildFaqPageJsonLd } from "@/lib/faqs/schema";

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

export default async function WeekPage() {
  const events = await getEventsCatalog(2026, "all");
  const schedules = buildVenueSchedules(events);
  const faqRows = await getFaqRowsWithGlobal("week/index.json");
  const faqJsonLd = buildFaqPageJsonLd(faqRows);

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        {faqRows.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}
        <div className="comic-hero">
          <div className="comic-kicker">Weekly Radar</div>
          <h1 className="comic-title">Venue Schedules</h1>
          <p className="comic-copy">Compiled schedules from snapshot data. Add venue ledgers under <code>data/shows/&lt;venue&gt;/2026.json</code> to expand coverage.</p>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">What This Page Does</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            This page is the weekly venue discovery layer. It helps you decide where to go first, then route into venue
            pages, lineup pages, and ride booking.
          </p>
          <p className="comic-copy">
            Booking flow: pick venue schedule → open venue/event context → finalize pickup strategy on <code>/find</code>.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Find Ride Options
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              Red Rocks Lineup
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide">
              Guide Hub
            </Link>
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">All Venues</div>
          {schedules.length === 0 ? (
            <p className="comic-copy" style={{ marginTop: 10 }}>
              No venue schedules found yet.
            </p>
          ) : (
            <div className="comic-grid" style={{ marginTop: 12 }}>
              {schedules.map((schedule) => (
                <article key={schedule.venueId} className="comic-panel">
                  <div className="comic-h3">{schedule.venueName}</div>
                  <p className="comic-copy" style={{ marginTop: 8 }}>
                    {schedule.total} show{schedule.total === 1 ? "" : "s"}
                  </p>
                  {schedule.nextDate ? <p className="comic-copy">Next: {schedule.nextDate}</p> : null}
                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link className="comic-btn comic-btn-primary" href={`/venues/${encodeURIComponent(schedule.venueId)}`}>
                      Venue Page
                    </Link>
                    {schedule.venueId === "red-rocks-amphitheatre" ? (
                      <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
                        Red Rocks Lineup
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">High-Intent Venue Links</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            Use venue reference pages for parking, pickup logistics, and local context before booking.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/venues/red-rocks-amphitheatre">
              Red Rocks
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/venues/mission-ballroom">
              Mission Ballroom
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/venues/fiddlers-green-amphitheatre">
              Fiddler&apos;s Green
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/guide/transportation/shuttle-vs-uber">
              Shuttle vs Uber
            </Link>
          </div>
        </section>

        <FAQBlock title="Week Schedule FAQ" rows={faqRows} />
      </section>
    </main>
  );
}
