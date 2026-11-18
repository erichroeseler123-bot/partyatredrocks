import type { Metadata } from "next";
import Link from "next/link";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import { SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "2026 Red Rocks Concerts Archive | Historical Season Lineup",
  description:
    `Historical 2026 Red Rocks Amphitheatre concert lineup archive. Looking for upcoming shows? View the official 2027 Red Rocks concert calendar and book $${SUBURBAN_2027_USD} Suburban or $${VAN_2027_USD} Van transportation.`,
  alternates: { canonical: `${SITE}/2026/red-rocks-concerts` },
  openGraph: {
    title: "2026 Red Rocks Concerts Archive | Party at Red Rocks",
    description:
      "Complete 2026 Red Rocks Amphitheatre historical concert schedule archive, with links to upcoming 2027 shows and private group rides.",
    url: `${SITE}/2026/red-rocks-concerts`,
    type: "website",
  },
};

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
    <main className="comic-page pt-24 pb-12">
      <section className="comic-wrap">
        <aside
          aria-label="2026 historical season archive notice"
          className="mb-5 rounded-2xl border border-[#ffb07c]/35 bg-[#ffb07c]/10 p-4 text-sm leading-6 text-white/90 sm:p-5"
        >
          <span className="font-black uppercase tracking-[0.16em] text-[#ffb07c]">2026 Historical Archive:</span>{" "}
          You are viewing the completed 2026 Red Rocks concert ledger. Existing 2026 orders remain unchanged at their original booked pricing. Planning an upcoming concert?{" "}
          <Link href="/red-rocks/concerts" className="font-bold text-[#ffb07c] underline">
            Browse the 2027 Red Rocks Concert Schedule →
          </Link>
        </aside>

        <div className="comic-hero">
          <div className="comic-kicker">2026 Season Archive</div>
          <h1 className="comic-title">2026 Red Rocks Concerts (Historical Lineup)</h1>
          <p className="comic-copy">
            Full historical Red Rocks Amphitheatre lineup for the 2026 season ({events.length} archived concerts). For upcoming 2027 Red Rocks dates and private group vehicles (${SUBURBAN_2027_USD} Suburban / ${VAN_2027_USD} Van), visit our live 2027 concert calendar.
          </p>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/red-rocks/concerts">
              View 2027 Red Rocks Concerts
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/book/red-rocks-amphitheatre/private">
              Book 2027 Private Ride
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/red-rocks">
              Red Rocks Guide Hub
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">2026 Season Ledger</div>
          <h2 className="mt-2 text-xl font-black uppercase tracking-tight text-white">
            Archived 2026 Red Rocks Dates ({events.length} Shows)
          </h2>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {events.map((event) => (
              <article key={event.id} className="comic-panel">
                <h3 className="comic-h3">{event.name}</h3>
                <p className="comic-copy" style={{ marginTop: 6 }}>
                  2026 Event Date: {event.dateKey}
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
                    2026 Show Archive
                  </Link>
                  <Link className="comic-btn comic-btn-primary" href="/red-rocks/concerts">
                    2027 Schedule & Rides
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
