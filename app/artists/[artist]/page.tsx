import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtistsCatalog, getEventsCatalog } from "@/lib/events/getCatalog";
import { getMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import { normalizeVenueSlug } from "@/lib/parrHandoff";

export const revalidate = 3600;
const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

type Props = {
  params: Promise<{ artist: string }>;
  searchParams: Promise<HandoffSearchParams>;
};

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
  return normalizeVenueSlug(venueId) === "red-rocks-amphitheatre";
}

function dateLabel(dateKey: string): string {
  const dt = new Date(`${dateKey}T19:00:00`);
  if (Number.isNaN(dt.getTime())) return dateKey;
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function todayInDenver(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return year && month && day ? `${year}-${month}-${day}` : new Date().toISOString().slice(0, 10);
}

async function resolveArtistPageData(slug: string) {
  const [artists, events, media] = await Promise.all([getArtistsCatalog(2026, "all"), getEventsCatalog(2026, "all"), getMediaIndex(2026)]);
  const artist = artists.find((row) => slugify(row.name) === slug) ?? null;
  if (!artist) return null;

  const matches = events
    .filter((event) => event.artistNames.some((name) => slugify(name) === slug))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  const mediaSources = media?.artistsById?.[artist.id]?.sources;

  const heroImage = selectImageByPriority({
    entityType: "artist",
    title: artist.name,
    artistName: artist.name,
    queryHint: `${artist.name} live music artist portrait`,
    alt: `${artist.name} artist photo`,
    spotifyImage: mediaSources?.spotifyImage ?? null,
    ticketmasterImage: mediaSources?.ticketmasterImage ?? null,
    seatgeekImage: mediaSources?.seatgeekImage ?? artist.image ?? null,
    localAsset: mediaSources?.localAsset ?? null,
    fallback: mediaSources?.fallback ?? "/images/shows/fallback.jpg",
  });

  return { artist, matches, heroImage };
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
    description: `See ${data.artist.name} concert dates, Red Rocks history, venue details, and private ride planning options.`,
    alternates: { canonical: `${SITE}/artists/${artist}` },
  };
}

export default async function ArtistPage({ params, searchParams }: Props) {
  const { artist } = await params;
  const sp = await searchParams;
  const data = await resolveArtistPageData(artist);
  if (!data) notFound();

  const { artist: artistRow, matches, heroImage } = data;
  const todayKey = todayInDenver();
  const upcomingShows = matches.filter((event) => event.dateKey >= todayKey);
  const pastShows = matches.filter((event) => event.dateKey < todayKey).reverse();
  const upcomingRedRocksShows = upcomingShows.filter((event) => isRedRocksVenue(event.venueId));
  const hasUpcomingRedRocks = upcomingRedRocksShows.length > 0;

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Artist Guide</div>
          <h1 className="comic-title">{artistRow.name}</h1>
          <p className="comic-copy">
            Colorado concert dates, venue details, Red Rocks history, and private ride planning for upcoming show nights.
          </p>
          <div style={{ marginTop: 10 }}>
            <img
              src={heroImage}
              alt={`${artistRow.name} artist photo`}
              width={320}
              height={320}
              loading="lazy"
              decoding="async"
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
            {hasUpcomingRedRocks ? (
              <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary">
                Transportation Guide
              </Link>
            ) : null}
            {hasUpcomingRedRocks ? (
              <Link
                href={buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre", searchParams: sp })}
                className="comic-btn comic-btn-primary"
              >
                View Private Red Rocks Rides
              </Link>
            ) : null}
          </div>
        </div>

        {hasUpcomingRedRocks ? (
          <section className="comic-panel" style={{ marginTop: 16 }}>
            <div className="comic-tag">Upcoming Red Rocks Shows</div>
            <div className="comic-grid" style={{ marginTop: 10 }}>
              {upcomingRedRocksShows.slice(0, 8).map((event) => (
                <article key={event.id} className="comic-panel">
                  <div className="comic-tag">{dateLabel(event.dateKey)}</div>
                  <h2 className="comic-h3" style={{ marginTop: 8 }}>{event.name}</h2>
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                      Show Details
                    </Link>
                    <Link
                      href={buildBookingHref({
                        target: "private",
                        venue: "red-rocks-amphitheatre",
                        searchParams: sp,
                        overrides: { artist: artistRow.name, event: event.name, date: event.dateKey },
                      })}
                      className="comic-btn comic-btn-primary"
                    >
                      View Private Rides
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Upcoming Shows</div>
          {upcomingShows.length ? (
            <div className="comic-grid" style={{ marginTop: 10 }}>
              {upcomingShows.slice(0, 18).map((event) => {
                const venueName =
                  VENUE_LEDGER_BY_SLUG.get?.(event.venueId)?.name ||
                  (VENUE_LEDGER_BY_SLUG as unknown as Record<string, { name?: string }>)[event.venueId]?.name ||
                  prettySlug(event.venueId);
                return (
                  <article key={event.id} className="comic-panel">
                    <div className="comic-tag">{dateLabel(event.dateKey)}</div>
                    <h2 className="comic-h3" style={{ marginTop: 8 }}>{event.name}</h2>
                    <p className="comic-copy">{venueName}</p>
                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                        Show Details
                      </Link>
                      {isRedRocksVenue(event.venueId) ? (
                        <Link
                          href={buildBookingHref({
                            target: "private",
                            venue: "red-rocks-amphitheatre",
                            searchParams: sp,
                            overrides: { artist: artistRow.name, event: event.name, date: event.dateKey },
                          })}
                          className="comic-btn comic-btn-primary"
                        >
                          View Private Rides
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="comic-copy" style={{ marginTop: 8 }}>
              No upcoming Colorado shows are listed in the current 2026 snapshot.
            </p>
          )}
        </section>

        {pastShows.length ? (
          <section className="comic-panel" style={{ marginTop: 16 }}>
            <div className="comic-tag">Past 2026 Shows</div>
            <p className="comic-copy" style={{ marginTop: 8 }}>
              These dates are kept as concert-history pages; they are not presented as upcoming events.
            </p>
            <div className="comic-grid" style={{ marginTop: 10 }}>
              {pastShows.slice(0, 8).map((event) => (
                <article key={event.id} className="comic-panel">
                  <div className="comic-tag">{dateLabel(event.dateKey)}</div>
                  <h2 className="comic-h3" style={{ marginTop: 8 }}>{event.name}</h2>
                  <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary" style={{ marginTop: 10 }}>
                    Show Details
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
