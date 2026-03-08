import Link from "next/link";
import { getArtistsCatalog, getEventsCatalog } from "@/lib/events/getCatalog";

export const revalidate = 86400;

export const metadata = {
  title: "Bands & Artists | Party At Red Rocks",
  description: "Browse artists across venue schedules and jump straight into show dates and ride booking.",
};

export default async function BandsPage() {
  const [artists, events] = await Promise.all([getArtistsCatalog(2026, "all"), getEventsCatalog(2026, "all")]);
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
    .map((artist) => ({
      artist,
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
            <Link className="comic-btn comic-btn-primary" href="/week">
              Browse Schedules
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/find">
              Find Ride Options
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 14 }}>
          <div className="comic-tag">All Artists</div>
          <div className="comic-grid" style={{ marginTop: 12 }}>
            {rows.map(({ artist, count, nextDate }) => (
              <Link key={artist.id} className="comic-panel" href={`/bands/${encodeURIComponent(artist.id)}`}>
                <div className="comic-h3">{artist.name}</div>
                <p className="comic-copy" style={{ marginTop: 6 }}>
                  {count} show{count === 1 ? "" : "s"}
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
