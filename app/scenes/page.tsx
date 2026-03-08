import type { Metadata } from "next";
import Link from "next/link";
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
    "Explore Colorado music scenes with featured upcoming shows and direct ride options across Red Rocks, Mission Ballroom, Ogden, Fillmore, Gothic, Bluebird, and more.",
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
  const allEvents = await getEventsCatalog(2026, "all");
  const scenes = SCENES.slice().sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <div className="comic-kicker">Denver Music Scenes</div>
          <h1 className="comic-title">Explore Colorado Music Scenes</h1>
          <p className="comic-copy">
            Browse scene hubs, see featured upcoming shows, and book your ride before post-show surge and parking chaos.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4">
            <Link href="/find" className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[200px] text-center">
              Find Shuttle Ride →
            </Link>
          </div>
        </div>

        <div className="comic-grid" style={{ marginTop: 32 }}>
          {scenes.map((scene) => {
            const featured = allEvents
              .filter((event) => eventMatchesGenre(event, scene.slug))
              .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
              .slice(0, 3);
            const tileImage =
              (DISPLAY.images.sceneTiles as Record<string, string>)[scene.slug] ?? DISPLAY.images.showFallback;

            return (
              <article key={scene.slug} className="comic-panel">
                <img
                  src={tileImage}
                  alt={`${scene.title} scene in Colorado`}
                  width={640}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-44 object-cover rounded-xl border border-white/20"
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
                  <Link href={`/scenes/${scene.slug}`} className="comic-btn comic-btn-secondary w-full text-center">
                    Explore {sceneLabel(scene.slug)} →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
