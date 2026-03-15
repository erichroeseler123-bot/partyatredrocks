import Link from "next/link";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

export const revalidate = 1800;

export const metadata = {
  title: "Red Rocks Concerts in August 2026",
  description: "August 2026 lineup at Red Rocks with direct links to show details and ride booking.",
  alternates: { canonical: "/red-rocks/concerts/august" },
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

export default async function RedRocksConcertsAugustPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  const events = (await getEventsCatalog(2026, "redrocks"))
    .filter((event) => monthOf(event.dateKey) === 8)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Concert Calendar</div>
          <h1 className="comic-title">Red Rocks Concerts: August 2026</h1>
          <p className="comic-copy">
            Full August event view for Red Rocks. See show details, then book your ride before high-demand nights.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/red-rocks/concerts/june" className="comic-btn comic-btn-secondary">
              June
            </Link>
            <Link href="/red-rocks/concerts/july" className="comic-btn comic-btn-secondary">
              July
            </Link>
            <Link
              href={buildBookingHref({
                target: "book",
                venue: "red-rocks-amphitheatre",
                searchParams: sp,
              })}
              className="comic-btn comic-btn-primary"
            >
              Book a Ride
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">August Lineup</div>
          {events.length ? (
            <div className="comic-grid" style={{ marginTop: 10 }}>
              {events.map((event) => (
                <article key={event.id} className="comic-panel">
                  <div className="comic-tag">{event.dateKey}</div>
                  <h2 className="comic-h3" style={{ marginTop: 8 }}>
                    {event.name}
                  </h2>
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
              No August events found in the current Red Rocks snapshot.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
