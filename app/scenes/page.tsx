import type { Metadata } from "next";
import Link from "next/link";
import { getMediaIndex } from "@/lib/media/getMediaIndex";
import { selectImageByPriority } from "@/lib/media/selectImage";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import { SCENES } from "@/data/scenes";
import { DISPLAY } from "@/lib/display";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import { eventMatchesGenre } from "@/lib/genres/artistGenres";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Denver & Colorado Music Scenes 2026 | Concerts & Shuttle Rides",
  description:
    "Explore Denver's top music scenes: metal, hip-hop, EDM, jam, bluegrass, indie, country, reggae and more. See featured upcoming shows and book shuttle rides.",
  alternates: { canonical: `${SITE}/scenes` },
};

function slugifyArtist(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sceneLabel(slug: string): string {
  if (slug === "hiphop") return "Hip-Hop / Rap";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function venueName(venueId: string): string {
  return VENUE_LEDGER_BY_SLUG.get(venueId)?.name ?? venueId;
}

export default async function ScenesLandingPage() {
  const [media, allEvents] = await Promise.all([getMediaIndex(2026), getEventsCatalog(2026, "all")]);
  const scenes = SCENES.slice().sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Music Scenes</div>
          <h1 className="comic-title">Explore Colorado&apos;s Music Scenes 2026</h1>
          <p className="comic-copy">
            From heavy riffs at Red Rocks to hip-hop at Mission Ballroom, jam nights at Ogden, and bluegrass across Denver, find your scene and book shuttle rides to beat post-show chaos.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Find Shuttle Ride →
            </Link>
          </div>
        </div>

        <section className="comic-panel mt-6">
          <div className="comic-tag">Featured Event</div>
          <h2 className="comic-h3 mt-3">Phish at Folsom Field: Annual Colorado Run</h2>
          <p className="comic-copy mt-2">
            Dedicated planning page for the Boulder run: timing, transport demand spikes, and direct booking flow.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full px-4">
            <Link href="/phish-folsom" className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[220px] text-center">
              Open Phish Guide
            </Link>
            <Link href="/find?venue=ball-arena&qty=2" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[220px] text-center">
              Book Shuttle
            </Link>
          </div>
        </section>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          {scenes.map((scene) => {
            const featured = allEvents
              .filter((event) => eventMatchesGenre(event, scene.slug))
              .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
              .slice(0, 3);
            const tileImage = selectImageByPriority({
              spotifyImage: (media as any)?.genres?.[scene.slug]?.sources?.spotifyImage ?? null,
              ticketmasterImage: (media as any)?.genres?.[scene.slug]?.sources?.ticketmasterImage ?? null,
              seatgeekImage: (media as any)?.genres?.[scene.slug]?.sources?.seatgeekImage ?? null,
              localAsset: (media as any)?.genres?.[scene.slug]?.sources?.localAsset ?? null,
              fallback: (DISPLAY.images.sceneTiles as Record<string, string>)[scene.slug] ?? `/images/scenes/${scene.slug}.jpg`,
            });

            return (
              <article key={scene.slug} className="comic-panel flex flex-col">
                <img
                  src={tileImage}
                  alt={`${scene.title} scene — upcoming Denver and Colorado concerts`}
                  width={640}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-48 object-cover rounded-xl border border-white/20"
                />

                <h2 className="comic-h3 mt-4">{scene.title}</h2>
                <p className="comic-copy mt-2">{scene.description}</p>

                <div className="mt-4">
                  <div className="comic-tag">Featured Upcoming {sceneLabel(scene.slug)} Shows</div>
                  {featured.length ? (
                    <div className="mt-3 space-y-3">
                      {featured.map((event) => (
                        <div key={event.id} className="border-t border-white/20 pt-3">
                          <p className="comic-copy font-semibold">
                            {event.dateKey} - {event.name}
                          </p>
                          {event.artistNames.length ? (
                            <p className="comic-copy text-white/75">
                              {event.artistNames.map((name, idx) => (
                                <span key={`${event.id}-${name}`}>
                                  <Link href={`/artists/${encodeURIComponent(slugifyArtist(name))}`} className="underline">
                                    {name}
                                  </Link>
                                  {idx < event.artistNames.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </p>
                          ) : null}
                          <p className="comic-copy text-white/60">{venueName(event.venueId)}</p>
                          <div className="mt-2 flex gap-3 flex-wrap">
                            <Link href={`/shows/${encodeURIComponent(event.id)}`} className="comic-btn comic-btn-secondary">
                              Show Intel
                            </Link>
                            <Link
                              href={`/find?date=${encodeURIComponent(event.dateKey)}&venue=${encodeURIComponent(event.venueId)}&qty=2`}
                              className="comic-btn comic-btn-primary"
                            >
                              Book Ride
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="comic-copy mt-2 text-white/70">
                      No upcoming matches in the current snapshot.
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  <Link href={`/scene/${scene.slug}`} className="comic-btn comic-btn-secondary w-full text-center">
                    Explore {sceneLabel(scene.slug)} →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <section className="comic-panel mt-12">
          <div className="comic-tag">Why Shuttle for Your Scene Night?</div>
          <p className="comic-copy mt-4">
            No parking hunt, no surge pricing, guaranteed return. Whether it&apos;s metal at Red Rocks, hip-hop at Mission, jam at Ogden, or bluegrass across Denver, book round-trip shuttle rides that beat the chaos.
          </p>
          <div className="flex justify-center mt-6">
            <Link href="/find" className="comic-btn comic-btn-primary">
              Find Your Ride Now →
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
