import Link from "next/link";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import { getEventsCatalog } from "@/lib/events/getCatalog";

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

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Weekly Radar</div>
          <h1 className="comic-title">Venue Schedules</h1>
          <p className="comic-copy">Compiled schedules from snapshot data. Add venue ledgers under <code>data/shows/&lt;venue&gt;/2026.json</code> to expand coverage.</p>
        </div>

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
      </section>
    </main>
  );
}
