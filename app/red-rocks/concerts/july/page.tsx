import Link from "next/link";
import { getEventsCatalog } from "@/lib/events/getCatalog";

export const revalidate = 1800;

export const metadata = {
  title: "Red Rocks Concerts in July 2026",
  description: "July 2026 lineup at Red Rocks with direct links to show intel and ride booking.",
  alternates: { canonical: "/red-rocks/concerts/july" },
};

function monthOf(dateKey: string): number {
  const month = Number.parseInt(dateKey.split("-")[1] ?? "0", 10);
  return Number.isFinite(month) ? month : 0;
}

export default async function RedRocksConcertsJulyPage() {
  const events = (await getEventsCatalog(2026, "redrocks"))
    .filter((event) => monthOf(event.dateKey) === 7)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Concert Calendar</div>
          <h1 className="comic-title">Red Rocks Concerts: July 2026</h1>
          <p className="comic-copy">
            Full July event view for Red Rocks. Open show intel pages, then lock transport before high-demand nights.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/red-rocks/concerts/june" className="comic-btn comic-btn-secondary">
              June
            </Link>
            <Link href="/red-rocks/concerts/august" className="comic-btn comic-btn-secondary">
              August
            </Link>
            <Link href="/find" className="comic-btn comic-btn-primary">
              Find a Ride
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">July Lineup</div>
          {events.length ? (
            <div className="comic-grid" style={{ marginTop: 10 }}>
              {events.map((event) => (
                <article key={event.id} className="comic-panel">
                  <div className="comic-tag">{event.dateKey}</div>
                  <h2 className="comic-h3" style={{ marginTop: 8 }}>
                    {event.name}
                  </h2>
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                      Show Intel
                    </Link>
                    <Link href={`/find?date=${encodeURIComponent(event.dateKey)}&venue=red-rocks-amphitheatre&qty=2`} className="comic-btn comic-btn-primary">
                      Book Ride
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="comic-copy" style={{ marginTop: 8 }}>
              No July events found in the current Red Rocks snapshot.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
