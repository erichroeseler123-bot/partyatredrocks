import Link from "next/link";
import { getEventsCatalog } from "@/lib/events/getCatalog";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const revalidate = 1800;

export const metadata = {
  title: "Paramount Theatre Concert Schedule 2026 | Denver Shows & Rides",
  description:
    "Full 2026 lineup at Paramount Theatre. Browse upcoming dates, show details, and ride options for the night.",
  alternates: { canonical: `${SITE}/venues/paramount-theatre/concerts` },
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MONTH_LINKS: Array<{ month: number; label: string; href: string }> = [
  { month: 6, label: "June", href: "/venues/paramount-theatre/concerts/june" },
  { month: 7, label: "July", href: "/venues/paramount-theatre/concerts/july" },
  { month: 8, label: "August", href: "/venues/paramount-theatre/concerts/august" },
  { month: 9, label: "September", href: "/venues/paramount-theatre/concerts/september" },
  { month: 10, label: "October", href: "/venues/paramount-theatre/concerts/october" },
  { month: 11, label: "November", href: "/venues/paramount-theatre/concerts/november" },
  { month: 12, label: "December", href: "/venues/paramount-theatre/concerts/december" },
];

export default async function ParamountConcertsPage() {
  const allEvents = await getEventsCatalog(2026, "all");
  const events = allEvents
    .filter((event) => event.venueId === "paramount-theatre")
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  const upcoming = events.slice(0, 48);

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Venue Guide</div>
          <h1 className="comic-title">Paramount Theatre Concert Schedule 2026</h1>
          <p className="comic-copy">
            Historic downtown Denver lineup for 2026. Browse upcoming shows, open show details, and plan your ride before show night.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/book?venue=paramount-theatre" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center">
              Book a Ride
            </Link>
            <Link href="/venues/paramount-theatre/best-time-to-arrive" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Best Arrival Time
            </Link>
            <Link href="/venues/paramount-theatre/transportation" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Transportation
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Browse by Month</div>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-4">
            {MONTH_LINKS.map((row) => (
              <Link key={row.href} href={row.href} className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
                {row.label}
              </Link>
            ))}
          </div>
        </section>

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
                      Show Details
                    </Link>
                    <Link href="/book?venue=paramount-theatre" className="comic-btn comic-btn-primary">
                      Get a Ride
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="comic-copy" style={{ marginTop: 8 }}>
              No upcoming Paramount Theatre concerts were found in the current snapshot.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
