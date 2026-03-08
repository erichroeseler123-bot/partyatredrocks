import Link from "next/link";
import { getEventsCatalog } from "@/lib/events/getCatalog";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const revalidate = 1800;

export const metadata = {
  title: "Ogden Theatre Concert Schedule 2026 | Dates, Lineup, Ride Planning",
  description:
    "Ogden Theatre concerts for 2026. Browse upcoming shows, artist links, and transportation planning in one master schedule page.",
  alternates: { canonical: `${SITE}/venues/ogden-theatre/concerts` },
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MONTH_LINKS: Array<{ month: number; label: string; href: string }> = [
  { month: 6, label: "June", href: "/venues/ogden-theatre/concerts/june" },
  { month: 7, label: "July", href: "/venues/ogden-theatre/concerts/july" },
  { month: 8, label: "August", href: "/venues/ogden-theatre/concerts/august" },
];

export default async function OgdenConcertsPage() {
  const allEvents = await getEventsCatalog(2026, "all");
  const events = allEvents
    .filter((event) => event.venueId === "ogden-theatre")
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  const upcoming = events.slice(0, 48);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Venues", item: `${SITE}/venues` },
      { "@type": "ListItem", position: 3, name: "Ogden Theatre", item: `${SITE}/venues/ogden-theatre` },
      { "@type": "ListItem", position: 4, name: "Concerts", item: `${SITE}/venues/ogden-theatre/concerts` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Ogden Theatre</div>
          <h1 className="comic-title">Ogden Theatre Concert Schedule 2026</h1>
          <p className="comic-copy">
            Master schedule for upcoming Ogden Theatre shows with artist drill-down and direct ride-booking links.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/venues/ogden-theatre" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Venue Hub
            </Link>
            <Link href="/venues/ogden-theatre/parking" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Parking Guide
            </Link>
            <Link href="/venues/ogden-theatre/transportation" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Transportation
            </Link>
            <Link href="/find?venue=ogden-theatre&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center">
              Find a Ride
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
                          <Link
                            href={`/artists/${encodeURIComponent(slugify(name))}`}
                            className="underline text-white/90 hover:text-white"
                          >
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
                    <Link
                      href={`/find?date=${encodeURIComponent(event.dateKey)}&venue=ogden-theatre&qty=2`}
                      className="comic-btn comic-btn-primary"
                    >
                      Ride Options
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="comic-copy" style={{ marginTop: 8 }}>
              No upcoming Ogden Theatre concerts were found in the current snapshot.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
