import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtistsCatalog, getEventsCatalog } from "@/lib/events/getCatalog";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";

export const revalidate = 3600;
const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

type Props = { params: Promise<{ artist: string; venue: string }> };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

type ArtistVenuePair = {
  artistSlug: string;
  artistName: string;
  venueSlug: string;
};

async function getArtistVenuePairs(year = 2026): Promise<ArtistVenuePair[]> {
  const events = await getEventsCatalog(year, "all");
  const seen = new Set<string>();
  const out: ArtistVenuePair[] = [];

  for (const event of events) {
    for (const name of event.artistNames) {
      const artistSlug = slugify(name);
      if (!artistSlug) continue;
      const key = `${artistSlug}::${event.venueId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ artistSlug, artistName: name, venueSlug: event.venueId });
    }
  }

  return out.sort((a, b) => a.artistSlug.localeCompare(b.artistSlug) || a.venueSlug.localeCompare(b.venueSlug));
}

export async function generateStaticParams() {
  const pairs = await getArtistVenuePairs(2026);
  return pairs.map((pair) => ({ artist: pair.artistSlug, venue: pair.venueSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { artist, venue } = await params;
  const events = await getEventsCatalog(2026, "all");
  const matching = events.filter(
    (event) => event.venueId === venue && event.artistNames.some((name) => slugify(name) === artist)
  );

  if (!matching.length) {
    return {
      title: "Artist Venue Guide",
      robots: { index: false, follow: false },
    };
  }

  const artistName = matching[0].artistNames.find((name) => slugify(name) === artist) ?? titleCaseSlug(artist);
  const venueName = VENUE_LEDGER_BY_SLUG.get(venue)?.name ?? titleCaseSlug(venue);

  return {
    title: `${artistName} at ${venueName} | Show Intel & Transport`,
    description: `Upcoming ${artistName} shows at ${venueName}. Get venue intel and compare shuttle options for show night.`,
    alternates: { canonical: `${SITE}/artists/${artist}/${venue}` },
  };
}

export default async function ArtistVenuePage({ params }: Props) {
  const { artist, venue } = await params;
  const [events, artists] = await Promise.all([getEventsCatalog(2026, "all"), getArtistsCatalog(2026, "all")]);
  const shows = events
    .filter((event) => event.venueId === venue && event.artistNames.some((name) => slugify(name) === artist))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  if (!shows.length) return notFound();

  const artistName = shows[0].artistNames.find((name) => slugify(name) === artist) ?? titleCaseSlug(artist);
  const artistId = artists.find((row) => slugify(row.name) === artist)?.id ?? null;
  const venueName = VENUE_LEDGER_BY_SLUG.get(venue)?.name ?? titleCaseSlug(venue);
  const isRedRocks = venue === "red-rocks-amphitheatre" || venue === "redrocks";

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Artist x Venue</div>
          <h1 className="comic-title">
            {artistName} at {venueName}
          </h1>
          <p className="comic-copy">
            Upcoming dates, venue details, transportation options, and booking links for show night.
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {artistId ? (
              <Link href={`/bands/${encodeURIComponent(artistId)}`} className="comic-btn comic-btn-secondary">
                Artist Page
              </Link>
            ) : null}
            <Link href={`/venues/${encodeURIComponent(venue)}`} className="comic-btn comic-btn-secondary">
              Venue Page
            </Link>
            <Link href={`/find?venue=${encodeURIComponent(venue)}&qty=2`} className="comic-btn comic-btn-primary">
              Find a Ride
            </Link>
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Upcoming Shows</div>
          <div className="comic-grid" style={{ marginTop: 10 }}>
            {shows.map((show) => (
              <article key={show.id} className="comic-panel">
                <div className="comic-tag">{show.dateKey}</div>
                <h2 className="comic-h3" style={{ marginTop: 8 }}>
                  {show.name}
                </h2>
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link href={`/shows/${encodeURIComponent(show.id)}`} className="comic-btn comic-btn-secondary">
                    Show Page
                  </Link>
                  <Link href={`/find?date=${encodeURIComponent(show.dateKey)}&venue=${encodeURIComponent(venue)}&qty=2`} className="comic-btn comic-btn-primary">
                    Book Ride
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">Getting To {venueName}</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href={isRedRocks ? "/red-rocks/transportation" : "/guide/transportation"} className="comic-btn comic-btn-secondary">
              Transportation Guide
            </Link>
            <Link href={isRedRocks ? "/red-rocks/parking" : "/guide/parking"} className="comic-btn comic-btn-secondary">
              Parking Guide
            </Link>
            <Link href={isRedRocks ? "/red-rocks/map" : "/week"} className="comic-btn comic-btn-secondary">
              {isRedRocks ? "Venue Map" : "Week View"}
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
