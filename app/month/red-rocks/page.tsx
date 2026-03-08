import Link from "next/link";
import { getEventsCatalog, readByMonthIndex } from "@/lib/events/getCatalog";

export const revalidate = 3600;

function monthLabel(monthKey: string): string {
  const d = new Date(`${monthKey}-01T00:00:00`);
  if (Number.isNaN(d.getTime())) return monthKey;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default async function RedRocksMonthlyPage() {
  const [events, byMonth] = await Promise.all([
    getEventsCatalog(2026, "redrocks"),
    readByMonthIndex(2026, "redrocks"),
  ]);
  const eventsById = new Map(events.map((event) => [event.id, event] as const));
  const monthKeys = Object.keys(byMonth).sort();

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Freshness Engine</div>
          <h1 className="comic-title">Red Rocks by Month</h1>
          <p className="comic-copy">
            Snapshot-driven monthly Red Rocks lineup for 2026. This page updates from the compiled ledger data and links directly
            into show discovery and booking.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks">
              Red Rocks Hub
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/week/red-rocks">
              This Week
            </Link>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Book Ride
            </Link>
          </div>
        </div>

        {monthKeys.length === 0 ? (
          <section className="comic-panel" style={{ marginTop: 16 }}>
            <p className="comic-copy">No monthly index data found yet for Red Rocks 2026.</p>
          </section>
        ) : (
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {monthKeys.map((monthKey) => {
              const ids = byMonth[monthKey] ?? [];
              const monthEvents = ids
                .map((id) => eventsById.get(id))
                .filter((row): row is NonNullable<typeof row> => !!row)
                .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

              return (
                <section key={monthKey} className="comic-panel">
                  <div className="comic-tag">{monthLabel(monthKey)}</div>
                  <p className="comic-copy" style={{ marginTop: 8 }}>
                    {monthEvents.length} show{monthEvents.length === 1 ? "" : "s"}
                  </p>
                  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                    {monthEvents.slice(0, 10).map((event) => (
                      <article key={event.id} className="comic-panel">
                        <div className="comic-h3">{event.name}</div>
                        <p className="comic-copy" style={{ marginTop: 6 }}>
                          {event.dateKey}
                        </p>
                        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <Link className="comic-btn comic-btn-secondary" href={`/shows/${encodeURIComponent(event.id)}`}>
                            Show Page
                          </Link>
                          <Link className="comic-btn comic-btn-primary" href="/find">
                            Ride Options
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
