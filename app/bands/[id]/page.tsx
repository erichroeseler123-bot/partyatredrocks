import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtistById, getArtistsCatalog, getEnrichedArtistById, getEventsCatalog } from "@/lib/events/getCatalog";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import MusicWave from "@/components/MusicWave";
import { getMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const artists = await getArtistsCatalog(2026, "all");
  return artists.map((artist) => ({ id: artist.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artist = await getArtistById(id, 2026);
  if (!artist) {
    return { title: "Artist | Party At Red Rocks" };
  }
  return {
    title: `${artist.name} | Party At Red Rocks`,
    description: `See upcoming dates for ${artist.name} across venue schedules and book transportation.`,
  };
}

function dateLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BandPage({ params }: Props) {
  const { id } = await params;
  const [artist, enriched, media] = await Promise.all([
    getArtistById(id, 2026),
    getEnrichedArtistById(id, 2026, "all"),
    getMediaIndex(2026),
  ]);
  if (!artist) notFound();

  const [events, allArtists] = await Promise.all([
    getEventsCatalog(2026, "all"),
    getArtistsCatalog(2026, "all"),
  ]);
  const eventIdSet = new Set(artist.eventIds ?? []);
  const mine = events
    .filter((event) => event.artists.includes(artist.id) || eventIdSet.has(event.id))
    .sort((a, b) => (a.startAt ?? "").localeCompare(b.startAt ?? ""));
  const coArtistNames = (artist.coArtists ?? [])
    .map((coId) => allArtists.find((candidate) => candidate.id === coId))
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate))
    .slice(0, 24);
  const showCount = artist.showCount ?? mine.length;
  const mediaSources = media?.artistsById?.[artist.id]?.sources;
  const heroImage = selectImageByPriority({
    spotifyImage: mediaSources?.spotifyImage ?? enriched?.spotifyImage ?? null,
    ticketmasterImage: mediaSources?.ticketmasterImage ?? null,
    seatgeekImage: mediaSources?.seatgeekImage ?? artist.image ?? null,
    localAsset: mediaSources?.localAsset ?? null,
    fallback: mediaSources?.fallback ?? "/images/shows/fallback.jpg",
  });
  const bio = enriched?.lastfmBio || "Enrichment bio not available yet.";
  const genres = (enriched?.genres || []).slice(0, 8);
  const topTracks = (enriched?.topTracks || []).slice(0, 8);
  const officialLinks = (enriched?.officialLinks || []).slice(0, 5);
  const venueRows = (artist.venueIds || [])
    .map((venueId) => ({ venueId, venueName: VENUE_LEDGER_BY_SLUG.get(venueId)?.name || venueId }))
    .sort((a, b) => a.venueName.localeCompare(b.venueName));

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Artist</div>
          <h1 className="comic-title">{artist.name}</h1>
          <div style={{ marginTop: 10 }}>
            <img
              src={heroImage}
              alt={artist.name}
              loading="lazy"
              decoding="async"
              width={160}
              height={160}
              style={{ width: 160, height: 160, borderRadius: 16, objectFit: "cover", border: "1px solid rgba(255,255,255,.2)" }}
            />
          </div>
          <p className="comic-copy">
            {showCount} compiled show{showCount === 1 ? "" : "s"} across {artist.venueIds?.length ?? 0} venue
            {(artist.venueIds?.length ?? 0) === 1 ? "" : "s"}.
          </p>
          <p className="comic-copy">
            First date: {artist.firstDate ?? "n/a"} • Last date: {artist.lastDate ?? "n/a"}
          </p>
          <p className="comic-copy">{bio}</p>
          {genres.length > 0 ? (
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {genres.map((genre) => (
                <span key={genre} className="comic-btn comic-btn-secondary">
                  {genre}
                </span>
              ))}
            </div>
          ) : null}
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="comic-btn comic-btn-primary" href="/find">
              Find Ride Options
            </Link>
            <Link className="comic-btn comic-btn-secondary" href="/bands">
              All Artists
            </Link>
          </div>
          <div style={{ marginTop: 18 }}>
            <MusicWave bars={22} />
          </div>
        </div>

        {topTracks.length > 0 ? (
          <section className="comic-panel" style={{ marginTop: 16 }}>
            <div className="comic-tag">Top Tracks</div>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {topTracks.map((track) => (
                <span key={track} className="comic-btn comic-btn-secondary">
                  {track}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {venueRows.length > 0 ? (
          <section className="comic-panel" style={{ marginTop: 16 }}>
            <div className="comic-tag">Venues</div>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {venueRows.map((venue) => (
                <Link key={venue.venueId} className="comic-btn comic-btn-secondary" href={`/venues/${encodeURIComponent(venue.venueId)}`}>
                  {venue.venueName}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {officialLinks.length > 0 ? (
          <section className="comic-panel" style={{ marginTop: 16 }}>
            <div className="comic-tag">Official Links</div>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {officialLinks.map((url) => (
                <a key={url} className="comic-btn comic-btn-secondary" href={url} target="_blank" rel="noreferrer">
                  {url.includes("spotify") ? "Spotify" : "Profile"}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {coArtistNames.length > 0 ? (
          <section className="comic-panel" style={{ marginTop: 16 }}>
            <div className="comic-tag">Frequent Co-Artists</div>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {coArtistNames.map((coArtist) => (
                <Link key={coArtist.id} className="comic-btn comic-btn-secondary" href={`/bands/${encodeURIComponent(coArtist.id)}`}>
                  {coArtist.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Upcoming Dates</div>
          {mine.length === 0 ? (
            <p className="comic-copy" style={{ marginTop: 10 }}>
              No dates found in the current snapshot.
            </p>
          ) : (
            <div className="comic-grid" style={{ marginTop: 12 }}>
              {mine.map((event) => {
                const dt = event.startLocal ?? event.startAt ?? `${event.dateKey}T19:00:00`;
                const bookHref = `/find?date=${encodeURIComponent(event.dateKey)}&qty=2`;
                const venueName = VENUE_LEDGER_BY_SLUG.get(event.venueId)?.name ?? event.venueId;

                return (
                  <article key={event.id} className="comic-panel">
                    <div className="comic-tag">{dateLabel(dt)}</div>
                    <div className="comic-h3">{event.name}</div>
                    <p className="comic-copy" style={{ marginTop: 6 }}>
                      {venueName}
                    </p>

                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link className="comic-btn comic-btn-primary" href={bookHref}>
                        Book Ride
                      </Link>
                      {event.ticketUrl ? (
                        <a className="comic-btn comic-btn-secondary" href={event.ticketUrl} target="_blank" rel="noreferrer">
                          Tickets
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
