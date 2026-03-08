import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtistsCatalog, getEventsCatalog } from "@/lib/events/getCatalog";
import { getMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";

export const revalidate = 3600;

type Props = { params: Promise<{ artist: string }> };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function prettySlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isRedRocksVenue(venueId: string): boolean {
  return venueId === "red-rocks-amphitheatre" || venueId === "redrocks";
}

function dateLabel(dateKey: string): string {
  const dt = new Date(`${dateKey}T19:00:00`);
  if (Number.isNaN(dt.getTime())) return dateKey;
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

async function resolveArtistPageData(slug: string) {
  const [artists, events, media] = await Promise.all([getArtistsCatalog(2026, "all"), getEventsCatalog(2026, "all"), getMediaIndex(2026)]);
  const artist = artists.find((row) => slugify(row.name) === slug) ?? null;
  if (!artist) return null;

  const matches = events
    .filter((event) => event.artistNames.some((name) => slugify(name) === slug))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  const redRocksShows = matches.filter((event) => isRedRocksVenue(event.venueId));
  const mediaSources = media?.artistsById?.[artist.id]?.sources;

  const heroImage = selectImageByPriority({
    spotifyImage: mediaSources?.spotifyImage ?? null,
    ticketmasterImage: mediaSources?.ticketmasterImage ?? null,
    seatgeekImage: mediaSources?.seatgeekImage ?? artist.image ?? null,
    localAsset: mediaSources?.localAsset ?? null,
    fallback: mediaSources?.fallback ?? "/images/shows/fallback.jpg",
  });

  return { artist, matches, redRocksShows, heroImage };
}

export async function generateStaticParams() {
  const [artists, events] = await Promise.all([getArtistsCatalog(2026, "all"), getEventsCatalog(2026, "all")]);
  const activeArtists = new Set(events.flatMap((event) => event.artistNames.map((name) => slugify(name))));

  return artists
    .filter((artist) => activeArtists.has(slugify(artist.name)))
    .map((artist) => ({ artist: slugify(artist.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { artist } = await params;
  const data = await resolveArtistPageData(artist);
  if (!data) return { title: "Artist | Party At Red Rocks", robots: { index: false, follow: false } };

  return {
    title: `${data.artist.name} Concerts in Colorado | Shows, Venues, Ride Planning`,
    description: `See upcoming ${data.artist.name} shows, Red Rocks dates, venue intelligence, and ride booking options.`,
    alternates: { canonical: `/artists/${artist}` },
  };
}

export default async function ArtistPage({ params }: Props) {
  const { artist } = await params;
  const data = await resolveArtistPageData(artist);
  if (!data) notFound();

  const { artist: artistRow, matches, redRocksShows, heroImage } = data;
  const nextShows = matches.slice(0, 18);
  const hasRedRocks = redRocksShows.length > 0;

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Artist Intelligence</div>
          <h1 className="comic-title">{artistRow.name}</h1>
          <p className="comic-copy">
            Upcoming Colorado shows, venue context, and direct transportation planning for concert nights.
          </p>
          <div style={{ marginTop: 10 }}>
            <img
              src={heroImage}
              alt={`${artistRow.name} artist photo`}
              width={320}
              height={320}
              style={{ borderRadius: 16, objectFit: "cover", border: "1px solid rgba(255,255,255,.2)", maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href={`/bands/${encodeURIComponent(artistRow.id)}`} className="comic-btn comic-btn-secondary">
              Artist Profile
            </Link>
            <Link href="/red-rocks/concerts" className="comic-btn comic-btn-secondary">
              Red Rocks Schedule
            </Link>
            <Link href="/find" className="comic-btn comic-btn-primary">
              Find a Ride
            </Link>
          </div>
        </div>

        {hasRedRocks ? (
          <section className="comic-panel" style={{ marginTop: 16 }}>
            <div className="comic-tag">Red Rocks Shows</div>
            <div className="comic-grid" style={{ marginTop: 10 }}>
              {redRocksShows.slice(0, 8).map((event) => (
                <article key={event.id} className="comic-panel">
                  <div className="comic-tag">{dateLabel(event.dateKey)}</div>
                  <h2 className="comic-h3" style={{ marginTop: 8 }}>
                    {event.name}
                  </h2>
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                      Show Intel
                    </Link>
                    <Link
                      href={`/find?date=${encodeURIComponent(event.dateKey)}&venue=red-rocks-amphitheatre&qty=2`}
                      className="comic-btn comic-btn-primary"
                    >
                      Book Ride
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Upcoming Shows</div>
          {nextShows.length ? (
            <div className="comic-grid" style={{ marginTop: 10 }}>
              {nextShows.map((event) => {
                const venueName =
                  VENUE_LEDGER_BY_SLUG.get?.(event.venueId)?.name ||
                  (VENUE_LEDGER_BY_SLUG as unknown as Record<string, { name?: string }>)[event.venueId]?.name ||
                  prettySlug(event.venueId);
                return (
                  <article key={event.id} className="comic-panel">
                    <div className="comic-tag">{dateLabel(event.dateKey)}</div>
                    <h2 className="comic-h3" style={{ marginTop: 8 }}>
                      {event.name}
                    </h2>
                    <p className="comic-copy">{venueName}</p>
                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link href={`/artists/${encodeURIComponent(artist)}/${encodeURIComponent(event.venueId)}`} className="comic-btn comic-btn-secondary">
                        Artist x Venue
                      </Link>
                      <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                        Show Page
                      </Link>
                      <Link href={`/find?date=${encodeURIComponent(event.dateKey)}&venue=${encodeURIComponent(event.venueId)}&qty=2`} className="comic-btn comic-btn-primary">
                        Ride Options
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="comic-copy" style={{ marginTop: 8 }}>
              No upcoming shows found in the current snapshot.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
