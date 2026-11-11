import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDenverDateKey,
  getMultiYearArtistsCatalog,
  getMultiYearEventsCatalog,
} from "@/lib/events/getCatalog";
import { getMultiYearMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref, normalizeVenueSlug } from "@/lib/parrHandoff";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";

export const runtime = "nodejs";
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

function publicFileExists(relPath?: string | null): boolean {
  if (!relPath || !relPath.startsWith("/")) return false;
  const clean = relPath.split("?")[0]?.replace(/^\/+/, "");
  if (!clean) return false;
  return existsSync(path.join(process.cwd(), "public", clean));
}

function resolveVenuePhoto(venueId?: string | null): string {
  if (!venueId || isRedRocksVenue(venueId)) {
    return "/venues/rrsite.webp";
  }
  const webpCandidate = `/images/venues/${venueId}.webp`;
  if (publicFileExists(webpCandidate)) return webpCandidate;
  const jpgCandidate = `/images/venues/${venueId}.jpg`;
  if (publicFileExists(jpgCandidate)) return jpgCandidate;
  if (venueId === "mishawaka-amphitheatre" && publicFileExists("/venues/mishsite.webp")) {
    return "/venues/mishsite.webp";
  }
  return "/venues/rrsite.webp";
}

function dateLabel(dateKey: string): string {
  const dt = new Date(`${dateKey}T19:00:00`);
  if (Number.isNaN(dt.getTime())) return dateKey;
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function activeCatalogYears(): number[] {
  const currentYear = Number(getDenverDateKey().slice(0, 4));
  return Array.from(new Set([2026, currentYear, currentYear + 1])).sort((a, b) => a - b);
}

async function resolveArtistPageData(slug: string) {
  const years = activeCatalogYears();
  const [artists, events, media] = await Promise.all([
    getMultiYearArtistsCatalog({ scope: "all", years }),
    getMultiYearEventsCatalog({ scope: "all", years }),
    getMultiYearMediaIndex(years),
  ]);
  const matches = events
    .filter((event) => event.artistNames.some((name) => slugify(name) === slug))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  const artist =
    artists.find((row) => slugify(row.name) === slug) ??
    (matches.length
      ? {
          id: slug,
          name: matches[0].artistNames.find((n) => slugify(n) === slug) || prettySlug(slug),
          image: matches[0].image ?? undefined,
        }
      : null);
  if (!artist) return null;

  const mediaSources = media?.artistsById?.[artist.id]?.sources;
  const primaryVenueId =
    matches.find((e) => isRedRocksVenue(e.venueId))?.venueId || matches[0]?.venueId || "red-rocks-amphitheatre";
  const venueBanner = resolveVenuePhoto(primaryVenueId);

  const localPortraitCandidate = `/images/artists/${slug}.jpg`;
  const verifiedLocalAsset =
    mediaSources?.localAsset &&
    !/^\/images\/(shows|venues)\/fallback\./i.test(mediaSources.localAsset) &&
    (!mediaSources.localAsset.startsWith("/") || publicFileExists(mediaSources.localAsset))
      ? mediaSources.localAsset
      : publicFileExists(localPortraitCandidate)
        ? localPortraitCandidate
        : null;

  const hasPortrait = Boolean(
    mediaSources?.spotifyImage ||
      mediaSources?.ticketmasterImage ||
      mediaSources?.seatgeekImage ||
      artist.image ||
      verifiedLocalAsset
  );

  const portraitImage = hasPortrait
    ? selectImageByPriority({
        entityType: "artist",
        title: artist.name,
        artistName: artist.name,
        queryHint: `${artist.name} live music artist portrait`,
        alt: `${artist.name} artist photo`,
        spotifyImage: mediaSources?.spotifyImage ?? null,
        ticketmasterImage: mediaSources?.ticketmasterImage ?? null,
        seatgeekImage: mediaSources?.seatgeekImage ?? artist.image ?? null,
        localAsset: verifiedLocalAsset,
        fallback: venueBanner,
      })
    : null;

  const heroImage = portraitImage || venueBanner;

  return { artist, matches, heroImage, portraitImage, venueBanner };
}

export async function generateStaticParams() {
  const years = activeCatalogYears();
  const [artists, events] = await Promise.all([
    getMultiYearArtistsCatalog({ scope: "all", years }),
    getMultiYearEventsCatalog({ scope: "all", years }),
  ]);
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

  const { artist: artistRow, matches, heroImage, portraitImage, venueBanner } = data;
  const todayKey = getDenverDateKey();
  const upcomingShows = matches.filter((event) => event.dateKey >= todayKey);
  const pastShows = matches.filter((event) => event.dateKey < todayKey).reverse();
  const upcomingRedRocksShows = upcomingShows.filter((event) => isRedRocksVenue(event.venueId));
  const hasUpcomingRedRocks = upcomingRedRocksShows.length > 0;

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#0b0f1c] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[240px] sm:h-[320px] md:inset-0 md:h-full">
            <img
              src={venueBanner}
              alt={`${artistRow.name} Colorado concert venue backdrop`}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-center opacity-45"
            />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(8,12,24,0.88)_0%,rgba(8,12,24,0.62)_52%,rgba(8,12,24,0.92)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0b0f1c] md:hidden" />
          </div>

          <div className="relative grid gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_240px] md:items-center lg:p-10">
            <div>
              <div className="comic-kicker">Artist Guide</div>
              <h1 className="comic-title">{artistRow.name}</h1>
              <p className="comic-copy">
                Colorado concert dates, venue details, Red Rocks history, and private ride planning for upcoming show nights.
              </p>
              <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
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

            <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/30 aspect-[16/10] md:aspect-square">
              <img
                src={portraitImage || heroImage}
                alt={portraitImage ? `${artistRow.name} artist photo` : `${artistRow.name} Colorado venue highlight`}
                width={320}
                height={320}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
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
              No upcoming Colorado shows are listed in the current 2026–2027 concert calendar.
            </p>
          )}
        </section>

        {pastShows.length ? (
          <section className="comic-panel" style={{ marginTop: 16 }}>
            <div className="comic-tag">Past Colorado Shows</div>
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
