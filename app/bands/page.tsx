import Link from "next/link";
import { getMultiYearArtistsCatalog, getUpcomingEventsCatalog } from "@/lib/events/getCatalog";
import { isNonArtistParserLabel } from "@/lib/seo/indexationGate";

export const revalidate = 86400;

export const metadata = {
  alternates: { canonical: "https://www.partyatredrocks.com/bands" },
  title: "Bands & Artists | Party At Red Rocks",
  description: "Browse artists across venue schedules and jump straight into show dates and ride booking.",
  robots: {
    index: false,
    follow: true,
  },
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function BandsPage() {
  const [artists, events] = await Promise.all([
    getMultiYearArtistsCatalog({ scope: "all" }),
    getUpcomingEventsCatalog({ scope: "all" }),
  ]);
  const artistStats = new Map<string, { count: number; nextDate: string | null }>();
  for (const event of events) {
    for (const artistId of event.artists) {
      const existing = artistStats.get(artistId) ?? { count: 0, nextDate: null };
      const nextDate =
        !existing.nextDate || event.dateKey < existing.nextDate ? event.dateKey : existing.nextDate;
      artistStats.set(artistId, { count: existing.count + 1, nextDate });
    }
  }

  const rows = artists
    .filter((artist) => !isNonArtistParserLabel(artist.name))
    .map((artist) => ({
      artist,
      slug: slugify(artist.name),
      count: artistStats.get(artist.id)?.count ?? 0,
      nextDate: artistStats.get(artist.id)?.nextDate ?? null,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.artist.name.localeCompare(b.artist.name);
    });

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Artist Index</div>
          <h1 className="comic-title">Bands & Artists</h1>
          <p className="comic-copy">Click an artist to see upcoming dates across venue schedules and book transportation.</p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/red-rocks/concerts">
              Browse Red Rocks Concerts
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/book/red-rocks-amphitheatre/private">
              Private Ride Options
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 14 }}>
          <div className="comic-tag">All Artists</div>
          <div className="comic-grid" style={{ marginTop: 12 }}>
            {rows.map(({ artist, slug, count, nextDate }) => (
              <Link key={artist.id} className="comic-panel" href={`/artists/${encodeURIComponent(slug)}`}>
                <div className="comic-h3">{artist.name}</div>
                <p className="comic-copy" style={{ marginTop: 6 }}>
                  {count} upcoming show{count === 1 ? "" : "s"}
                </p>
                {nextDate ? <p className="comic-copy">Next: {nextDate}</p> : null}
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
