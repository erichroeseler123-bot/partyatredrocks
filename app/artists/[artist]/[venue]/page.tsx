import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getDenverDateKey,
  getMultiYearEventsCatalog,
  getUpcomingEventsCatalog,
} from "@/lib/events/getCatalog";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref, normalizeVenueSlug } from "@/lib/parrHandoff";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import {
  evaluateArtistVenuePageDisposition,
  isManualReviewProtectedPath,
  isParrServedVenue,
} from "@/lib/seo/indexationGate";

export const revalidate = 3600;
const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

type Props = {
  params: Promise<{ artist: string; venue: string }>;
  searchParams: Promise<HandoffSearchParams>;
};

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

async function resolveArtistVenueContext(artist: string, venue: string) {
  const todayKey = getDenverDateKey();
  const allEvents = await getMultiYearEventsCatalog({ scope: "all" });
  const artistEvents = allEvents.filter((event) =>
    event.artistNames.some((name) => slugify(name) === artist)
  );
  const matching = artistEvents
    .filter((event) => event.venueId === venue)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  const distinctVenues = new Set(artistEvents.map((e) => e.venueId));
  const artistHasRedRocksShow = artistEvents.some(
    (e) => normalizeVenueSlug(e.venueId) === "red-rocks-amphitheatre"
  );
  const upcomingAtVenueCount = matching.filter((e) => e.dateKey >= todayKey).length;

  const decision = evaluateArtistVenuePageDisposition({
    artistSlug: artist,
    venueSlug: venue,
    distinctVenueCountForArtist: distinctVenues.size,
    artistHasRedRocksShow,
    upcomingAtVenueCount,
  });

  return { matching, upcomingAtVenueCount, decision };
}

/**
 * Only pre-build manual-review protected artist×venue pages at build time;
 * all other artist×venue permutations remain dynamically handled via ISR.
 */
export async function generateStaticParams() {
  const events = await getMultiYearEventsCatalog({ scope: "all" });
  const out: Array<{ artist: string; venue: string }> = [];
  const seen = new Set<string>();

  for (const event of events) {
    for (const name of event.artistNames) {
      const artistSlug = slugify(name);
      if (!artistSlug) continue;
      const key = `${artistSlug}::${event.venueId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (isManualReviewProtectedPath(`/artists/${artistSlug}/${event.venueId}`)) {
        out.push({ artist: artistSlug, venue: event.venueId });
      }
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { artist, venue } = await params;
  const { matching, decision } = await resolveArtistVenueContext(artist, venue);

  if (!matching.length || decision.action === "not_found_404" || decision.action === "gone_410") {
    return {
      title: "Artist Venue Guide | Party at Red Rocks",
      robots: { index: false, follow: false },
    };
  }

  const artistName = matching[0].artistNames.find((name) => slugify(name) === artist) ?? titleCaseSlug(artist);
  const venueName = VENUE_LEDGER_BY_SLUG.get(venue)?.name ?? titleCaseSlug(venue);

  return {
    title: `${artistName} at ${venueName} | Show Details & Ride Options`,
    description: `Concert dates and venue transportation guide for ${artistName} at ${venueName}.`,
    alternates: { canonical: `${SITE}/artists/${encodeURIComponent(artist)}/${encodeURIComponent(venue)}` },
    robots: {
      index: decision.index,
      follow: decision.follow,
    },
  };
}

export default async function ArtistVenuePage({ params, searchParams }: Props) {
  const { artist, venue } = await params;
  const sp = await searchParams;
  const [{ matching, decision }, upcomingEvents] = await Promise.all([
    resolveArtistVenueContext(artist, venue),
    getUpcomingEventsCatalog({ scope: "all", venueId: venue }),
  ]);

  if (decision.action === "redirect_308" && decision.redirectDestination) {
    permanentRedirect(decision.redirectDestination);
  }
  if (decision.action === "not_found_404" || decision.action === "gone_410" || !matching.length) {
    return notFound();
  }

  const upcomingShows = upcomingEvents
    .filter((event) => event.artistNames.some((name) => slugify(name) === artist))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  const hasUpcoming = upcomingShows.length > 0;
  const shows = hasUpcoming ? upcomingShows : matching;

  const artistName = shows[0].artistNames.find((name) => slugify(name) === artist) ?? titleCaseSlug(artist);
  const venueName = VENUE_LEDGER_BY_SLUG.get(venue)?.name ?? titleCaseSlug(venue);
  const isRedRocks = normalizeVenueSlug(venue) === "red-rocks-amphitheatre";
  const isServed = isParrServedVenue(venue);

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Artist × Venue</div>
          <h1 className="comic-title">
            {artistName} at {venueName}
          </h1>
          <p className="comic-copy">
            {hasUpcoming
              ? "Upcoming dates, venue details, and private transportation planning for show night."
              : `Historical concert dates for ${artistName} at ${venueName}, plus links to current schedules.`}
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href={`/artists/${encodeURIComponent(artist)}`} className="comic-btn comic-btn-secondary">
              Artist Page
            </Link>
            <Link href={`/venues/${encodeURIComponent(venue)}`} className="comic-btn comic-btn-secondary">
              Venue Page
            </Link>
            {isRedRocks ? (
              <Link href="/red-rocks/concerts" className="comic-btn comic-btn-primary">
                2027 Red Rocks Schedule
              </Link>
            ) : null}
          </div>
        </div>

        <section className="comic-panel" style={{ marginTop: 16 }}>
          <div className="comic-tag">{hasUpcoming ? "Upcoming Shows" : "Completed Shows"}</div>
          <div className="comic-grid" style={{ marginTop: 10 }}>
            {shows.map((show) => (
              <article key={show.id} className="comic-panel">
                <div className="comic-tag">{show.dateKey}</div>
                <h2 className="comic-h3" style={{ marginTop: 8 }}>
                  {show.name}
                </h2>
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link href={`/shows/${encodeURIComponent(show.id)}`} className="comic-btn comic-btn-secondary">
                    {hasUpcoming ? "Show Details" : "Historical Show Record"}
                  </Link>
                  {hasUpcoming && isServed ? (
                    <Link
                      href={buildBookingHref({
                        target: isRedRocks ? "private" : "book",
                        venue,
                        searchParams: sp,
                        overrides: {
                          artist: artistName,
                          event: show.name,
                          date: show.dateKey,
                        },
                      })}
                      className="comic-btn comic-btn-primary"
                    >
                      {isRedRocks ? "Book Private Ride" : "Request Private Charter"}
                    </Link>
                  ) : null}
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
            <Link href={isRedRocks ? "/red-rocks/map" : "/red-rocks/concerts"} className="comic-btn comic-btn-secondary">
              {isRedRocks ? "Venue Map" : "Red Rocks Concerts"}
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
