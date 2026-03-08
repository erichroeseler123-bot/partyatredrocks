import Link from "next/link";
import { getEventsCatalog } from "@/lib/events/getCatalog";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const revalidate = 1800;

export const metadata = {
  title: "Summit Music Hall Concert Schedule 2026 | Denver Shows & Rides",
  description:
    "Full 2026 lineup at Summit Music Hall. Browse upcoming dates, artist links, and pre-filled ride booking options.",
  alternates: { canonical: `${SITE}/venues/summit-music-hall/concerts` },
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function SummitConcertsPage() {
  const allEvents = await getEventsCatalog(2026, "all");
  const events = allEvents
    .filter((event) => event.venueId === "summit-music-hall")
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  const upcoming = events.slice(0, 48);

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Summit Music Hall Concert Schedule 2026</h1>
          <p className="comic-copy">
            Historic LoDo lineup for 2026 with artist drill-down and direct ride-booking links.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find?venue=summit-music-hall&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center">
              Find a Ride
            </Link>
            <Link href="/venues/summit-music-hall/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Best Arrival Time
            </Link>
            <Link href="/venues/summit-music-hall/transportation" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Transportation
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Upcoming Shows</div>
          {upcoming.length ? (
            <div className="comic-grid" style={{ marginTop: 10 }}>
              {upcoming.map((event) => (
                <article key={event.id} className="comic-panel">
                  <div className="comic-tag">{event.dateKey}</div>
                  <h2 className="comic-h3" style={{ marginTop: 8 }}>
                    {event.name}
                  </h2>

                  {event.artistNames.length ? (
                    <p className="comic-copy" style={{ marginTop: 6 }}>
                      {event.artistNames.map((name, idx) => (
                        <span key={`${event.id}-${name}`}>
                          <Link href={`/artists/${encodeURIComponent(slugify(name))}`} className="underline text-white/90 hover:text-white">
                            {name}
                          </Link>
                          {idx < event.artistNames.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p className="comic-copy" style={{ marginTop: 6 }}>
                      Artists TBA
                    </p>
                  )}

                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                      Show Intel
                    </Link>
                    <Link href={`/find?date=${encodeURIComponent(event.dateKey)}&venue=summit-music-hall&qty=2`} className="comic-btn comic-btn-primary">
                      Ride Options
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="comic-copy" style={{ marginTop: 8 }}>
              No upcoming Summit Music Hall concerts were found in the current snapshot.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
