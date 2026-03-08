import Link from "next/link";
import { getEventsCatalog } from "@/lib/events/getCatalog";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
export const revalidate = 1800;

export const metadata = {
  title: "Red Rocks Concert Schedule 2026 | Lineup, Dates, Ride Planning",
  description:
    "Red Rocks concerts and lineup for 2026. Browse upcoming shows, monthly schedules, and transportation planning links in one page.",
  alternates: { canonical: "/red-rocks/concerts" },
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function monthOf(dateKey: string): number {
  const month = Number.parseInt(dateKey.split("-")[1] ?? "0", 10);
  return Number.isFinite(month) ? month : 0;
}

const MONTH_LINKS: Array<{ month: number; label: string; href: string }> = [
  { month: 6, label: "June", href: "/red-rocks/concerts/june" },
  { month: 7, label: "July", href: "/red-rocks/concerts/july" },
  { month: 8, label: "August", href: "/red-rocks/concerts/august" },
];

export default async function RedRocksConcertsPage() {
  const events = (await getEventsCatalog(2026, "redrocks")).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  const upcoming = events.slice(0, 24);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Concerts", item: `${SITE}/red-rocks/concerts` },
    ],
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Concert Calendar</div>
          <h1 className="comic-title">Red Rocks Concert Schedule 2026</h1>
          <p className="comic-copy">
            Master lineup page for Red Rocks concerts: upcoming shows, month views, and direct paths to venue planning and ride booking.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-4">
            {MONTH_LINKS.map((row) => (
              <Link key={row.href} href={row.href} className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
                {row.label}
              </Link>
            ))}
            <Link href="/find" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center">
              Find a Ride →
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Browse by Month</div>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-4">
            {MONTH_LINKS.map((row) => (
              <Link key={`month-${row.href}`} href={row.href} className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
                {row.label} Shows
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
                  <p className="comic-copy">Month: {monthOf(event.dateKey)}</p>
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                      Show Intel
                    </Link>
                    <Link href={`/find?date=${encodeURIComponent(event.dateKey)}&venue=red-rocks-amphitheatre&qty=2`} className="comic-btn comic-btn-primary">
                      Ride Options
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="comic-copy" style={{ marginTop: 8 }}>
              No Red Rocks concerts were found in the current snapshot.
            </p>
          )}
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Plan Your Visit</div>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-4">
            <Link href="/red-rocks/parking" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Parking Guide
            </Link>
            <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Transportation Guide
            </Link>
            <Link href="/red-rocks/map" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Interactive Map
            </Link>
            <Link href="/find" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center">
              Find a Ride →
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
