import type { Metadata } from "next";
import Link from "next/link";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
const DEFAULT_OG_IMAGE =
  `${SITE}/api/unsplash-image?q=red+rocks+amphitheatre+concert+night+denver+colorado&src=%2Fhero%2Fhero-home.jpg&alt=Red+Rocks+shuttle+transportation&w=1200&h=630`;
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Red Rocks Concert Schedule 2026 | Lineup, Dates, Ride Planning",
  description:
    "Red Rocks concerts and lineup for 2026. Browse upcoming shows, monthly schedules, show details, and ride options in one place.",
  alternates: { canonical: `${SITE}/red-rocks/concerts` },
  openGraph: {
    title: "Red Rocks Concert Schedule 2026 | Lineup, Dates, Ride Planning",
    description:
      "Red Rocks concerts and lineup for 2026. Browse upcoming shows, monthly schedules, show details, and ride options in one place.",
    url: `${SITE}/red-rocks/concerts`,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: "Red Rocks concert schedule and ride planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Concert Schedule 2026 | Lineup, Dates, Ride Planning",
    description:
      "Red Rocks concerts and lineup for 2026. Browse upcoming shows, monthly schedules, show details, and ride options in one place.",
    images: [DEFAULT_OG_IMAGE],
  },
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

export default async function RedRocksConcertsPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
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
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Red Rocks concert schedule 2026",
    description: "Upcoming Red Rocks concerts, monthly calendars, show details, and ride planning links.",
    url: `${SITE}/red-rocks/concerts`,
    about: {
      "@type": "Place",
      name: "Red Rocks Amphitheatre",
      url: `${SITE}/venues/red-rocks-amphitheatre`,
    },
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Upcoming Red Rocks concerts",
    itemListElement: upcoming.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE}/shows/${encodeURIComponent(event.id)}`,
      name: event.name,
      item: {
        "@type": "MusicEvent",
        name: event.name,
        startDate: `${event.dateKey}T19:00:00`,
        url: `${SITE}/shows/${encodeURIComponent(event.id)}`,
        location: {
          "@type": "Place",
          name: "Red Rocks Amphitheatre",
          url: `${SITE}/venues/red-rocks-amphitheatre`,
        },
      },
    })),
  };

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

        <div className="comic-hero">
          <div className="comic-kicker">Concert Calendar</div>
          <h1 className="comic-title">Red Rocks Concert Schedule 2026</h1>
          <p className="comic-copy">
            Browse upcoming Red Rocks shows, monthly schedules, and ride options for concert nights.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-4">
            {MONTH_LINKS.map((row) => (
              <Link key={row.href} href={row.href} className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
                {row.label}
              </Link>
            ))}
            <Link
              href={buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              })}
              className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center"
            >
              Book a Ride →
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
                      Show Details
                    </Link>
                    <Link
                      href={buildBookingHref({
                        target: "book",
                        venue: "red-rocks-amphitheatre",
                        searchParams: sp,
                        overrides: {
                          event: event.name,
                          date: event.dateKey,
                          qty: 2,
                        },
                      })}
                      className="comic-btn comic-btn-primary"
                    >
                      Get a Ride
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
            <Link
              href={buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              })}
              className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center"
            >
              Book a Ride →
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
