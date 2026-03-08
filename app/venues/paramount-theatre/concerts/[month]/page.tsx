import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventsCatalog } from "@/lib/events/getCatalog";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

const MONTHS = [
  { slug: "january", num: 1, label: "January" },
  { slug: "february", num: 2, label: "February" },
  { slug: "march", num: 3, label: "March" },
  { slug: "april", num: 4, label: "April" },
  { slug: "may", num: 5, label: "May" },
  { slug: "june", num: 6, label: "June" },
  { slug: "july", num: 7, label: "July" },
  { slug: "august", num: 8, label: "August" },
  { slug: "september", num: 9, label: "September" },
  { slug: "october", num: 10, label: "October" },
  { slug: "november", num: 11, label: "November" },
  { slug: "december", num: 12, label: "December" },
] as const;

function monthBySlug(slug: string) {
  return MONTHS.find((m) => m.slug === slug);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateStaticParams() {
  return MONTHS.map((m) => ({ month: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ month: string }>;
}): Promise<Metadata> {
  const { month: monthSlug } = await params;
  const month = monthBySlug(monthSlug);
  if (!month) return {};

  return {
    title: `Paramount Theatre ${month.label} 2026 Concerts | Denver Show Schedule`,
    description: `Paramount Theatre ${month.label} 2026 schedule with artist links, show intel, and direct ride booking options.`,
    alternates: { canonical: `${SITE}/venues/paramount-theatre/concerts/${month.slug}` },
  };
}

export default async function ParamountMonthPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month: monthSlug } = await params;
  const month = monthBySlug(monthSlug);
  if (!month) return notFound();

  const allEvents = await getEventsCatalog(2026, "all");
  const events = allEvents
    .filter((event) => event.venueId === "paramount-theatre" && Number.parseInt(event.dateKey.split("-")[1] ?? "0", 10) === month.num)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Paramount Theatre Month View</div>
          <h1 className="comic-title">Paramount Theatre {month.label} 2026 Concerts</h1>
          <p className="comic-copy">Monthly schedule for Paramount Theatre in {month.label}. Drill into artist pages and book rides per show date.</p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/venues/paramount-theatre/concerts" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center">
              Full 2026 Schedule
            </Link>
            <Link href="/find?venue=paramount-theatre&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center">
              Find a Ride
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">{month.label} Shows</div>
          {events.length ? (
            <div className="comic-grid" style={{ marginTop: 10 }}>
              {events.map((event) => (
                <article key={event.id} className="comic-panel">
                  <div className="comic-tag">{event.dateKey}</div>
                  <h2 className="comic-h3" style={{ marginTop: 8 }}>{event.name}</h2>
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
                  ) : null}
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                      Show Intel
                    </Link>
                    <Link href={`/find?date=${encodeURIComponent(event.dateKey)}&venue=paramount-theatre&qty=2`} className="comic-btn comic-btn-primary">
                      Ride Options
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="comic-copy" style={{ marginTop: 8 }}>
              No Paramount Theatre concerts were found for {month.label} 2026 in the current snapshot.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
