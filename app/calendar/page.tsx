import Link from "next/link";
import { getArtistsCatalog, getEventsCatalog, readByDateIndex, readByMonthIndex } from "@/lib/events/getCatalog";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";

export const revalidate = 3600;

type SP = {
  month?: string;
  day?: string;
  venue?: string;
  artist?: string;
};

type Props = { searchParams: Promise<SP> };

function dateLabel(dateKey: string) {
  const dt = new Date(`${dateKey}T19:00:00`);
  if (Number.isNaN(dt.getTime())) return dateKey;
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default async function CalendarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const monthFilter = sp.month || "";
  const dayFilter = sp.day || "";
  const venueFilter = sp.venue || "";
  const artistFilter = sp.artist || "";

  const [events, artists, byDate, byMonth] = await Promise.all([
    getEventsCatalog(2026, "all"),
    getArtistsCatalog(2026, "all"),
    readByDateIndex(2026, "all"),
    readByMonthIndex(2026, "all"),
  ]);

  const eventById = new Map(events.map((ev) => [ev.id, ev]));
  const artistById = new Map(artists.map((a) => [a.id, a]));
  const months = Object.keys(byMonth).sort();
  const activeMonth = monthFilter && byMonth[monthFilter] ? monthFilter : months[0] || "";

  const eventsForMonth = (byMonth[activeMonth] || [])
    .map((id) => eventById.get(id))
    .filter((ev): ev is NonNullable<typeof ev> => Boolean(ev))
    .filter((ev) => (venueFilter ? ev.venueId === venueFilter : true))
    .filter((ev) => (artistFilter ? ev.artists.includes(artistFilter) : true));

  const dayKeys = Array.from(new Set(eventsForMonth.map((ev) => ev.dateKey))).sort();
  const activeDay = dayFilter && byDate[dayFilter] ? dayFilter : dayKeys[0] || "";
  const eventsForDay = eventsForMonth.filter((ev) => (activeDay ? ev.dateKey === activeDay : true));

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Calendar</div>
          <h1 className="comic-title">2026 Concert Calendar</h1>
          <p className="comic-copy">Built from snapshot indexes (`byMonth`, `byDate`) with venue and artist filters.</p>
        </div>

        <section className="comic-panel" style={{ marginTop: 14 }}>
          <div className="comic-tag">Filters</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {months.map((month) => (
              <Link
                key={month}
                className="comic-btn comic-btn-secondary"
                href={`/calendar?month=${encodeURIComponent(month)}${venueFilter ? `&venue=${encodeURIComponent(venueFilter)}` : ""}${artistFilter ? `&artist=${encodeURIComponent(artistFilter)}` : ""}`}
              >
                {month}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Array.from(VENUE_LEDGER_BY_SLUG.keys()).sort().map((venueId) => (
              <Link
                key={venueId}
                className="comic-btn comic-btn-secondary"
                href={`/calendar?month=${encodeURIComponent(activeMonth)}&venue=${encodeURIComponent(venueId)}${artistFilter ? `&artist=${encodeURIComponent(artistFilter)}` : ""}`}
              >
                {VENUE_LEDGER_BY_SLUG.get(venueId)?.name || venueId}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {artists.slice(0, 40).map((artist) => (
              <Link
                key={artist.id}
                className="comic-btn comic-btn-secondary"
                href={`/calendar?month=${encodeURIComponent(activeMonth)}${venueFilter ? `&venue=${encodeURIComponent(venueFilter)}` : ""}&artist=${encodeURIComponent(artist.id)}`}
              >
                {artist.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 14 }}>
          <div className="comic-tag">Day Grid</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {dayKeys.map((day) => (
              <Link
                key={day}
                className="comic-btn comic-btn-secondary"
                href={`/calendar?month=${encodeURIComponent(activeMonth)}&day=${encodeURIComponent(day)}${venueFilter ? `&venue=${encodeURIComponent(venueFilter)}` : ""}${artistFilter ? `&artist=${encodeURIComponent(artistFilter)}` : ""}`}
              >
                {day}
              </Link>
            ))}
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 14 }}>
          <div className="comic-tag">Shows {activeDay ? `• ${dateLabel(activeDay)}` : ""}</div>
          <div className="comic-grid" style={{ marginTop: 12 }}>
            {eventsForDay.map((event) => (
              <article key={event.id} className="comic-panel">
                <div className="comic-h3">{event.name}</div>
                <p className="comic-copy">{event.dateKey}</p>
                <p className="comic-copy">{VENUE_LEDGER_BY_SLUG.get(event.venueId)?.name || event.venueId}</p>
                <p className="comic-copy">{event.artistNames.join(", ")}</p>
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link className="comic-btn comic-btn-secondary" href={`/shows/${encodeURIComponent(event.id)}`}>
                    Show
                  </Link>
                  <Link className="comic-btn comic-btn-secondary" href={`/venues/${encodeURIComponent(event.venueId)}`}>
                    Venue
                  </Link>
                  {event.artists[0] ? (
                    <Link className="comic-btn comic-btn-secondary" href={`/bands/${encodeURIComponent(event.artists[0])}`}>
                      Band
                    </Link>
                  ) : null}
                  <Link className="comic-btn comic-btn-primary" href={`/find?date=${encodeURIComponent(event.dateKey)}&qty=2`}>
                    Ride
                  </Link>
                </div>
              </article>
            ))}
            {eventsForDay.length === 0 ? <p className="comic-copy">No events in this view.</p> : null}
          </div>
        </section>
      </section>
    </main>
  );
}
