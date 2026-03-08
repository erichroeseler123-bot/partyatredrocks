import Link from "next/link";
import { getEventsCatalog } from "@/lib/events/getCatalog";

export const revalidate = 3600;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function RedRocks2026ConcertsPage() {
  const events = (await getEventsCatalog(2026, "redrocks")).sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Freshness Engine</div>
          <h1 className="comic-title">2026 Red Rocks Concerts</h1>
          <p className="comic-copy">
            Full-season Red Rocks lineup for 2026 from snapshot truth data. Use this archive surface for annual planning,
            discovery, and booking flow into /find.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks">
              Red Rocks Hub
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/month/red-rocks">
              Monthly View
            </Link>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Book Ride
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Season List</div>
          <p className="comic-copy" style={{ marginTop: 8 }}>
            {events.length} show{events.length === 1 ? "" : "s"} in the 2026 Red Rocks ledger.
          </p>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {events.map((event) => (
              <article key={event.id} className="comic-panel">
                <div className="comic-h3">{event.name}</div>
                <p className="comic-copy" style={{ marginTop: 6 }}>
                  {event.dateKey}
                </p>
                {event.artistNames.length ? (
                  <p className="comic-copy" style={{ marginTop: 6 }}>
                    {event.artistNames.map((name, idx) => (
                      <span key={`${event.id}-${name}`}>
                        <Link href={`/artists/${encodeURIComponent(slugify(name))}`} className="underline">
                          {name}
                        </Link>
                        {idx < event.artistNames.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                ) : null}
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
      </section>
    </main>
  );
}
