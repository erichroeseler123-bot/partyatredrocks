import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Music2, CalendarDays, MapPin, BadgeCheck, PhoneCall } from "lucide-react";
import { getEventsCatalog } from "@/lib/events/getCatalog";
import { SCENES } from "@/data/scenes";
import { VENUE_LEDGER_BY_SLUG } from "@/lib/venues/ledgerRegistry";
import { eventMatchesGenre } from "@/lib/genres/artistGenres";
import { getDynamicImage } from "@/lib/getDynamicImage";
import { buildUnsplashImageSrc } from "@/lib/unsplash";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";
export const revalidate = 1800;
const SCENES_SHARE_IMAGE = buildUnsplashImageSrc({
  query: "colorado live music scenes concert crowd denver",
  src: "/images/scenes/jam.webp",
  alt: "Colorado music scenes",
  width: 1200,
  height: 630,
});

export const metadata: Metadata = {
  title: "Denver & Colorado Music Scenes 2026 | Concerts & Shuttle Rides",
  description:
    "Explore Denver's top music scenes with upcoming shows and direct ride-booking links across Colorado venues.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: `${SITE}/scenes` },
  openGraph: {
    title: "Colorado Music Scenes 2026",
    description:
      "Find upcoming shows by scene and jump straight into show pages and ride booking.",
    url: `${SITE}/scenes`,
    siteName: "Party at Red Rocks",
    images: [
      {
        url: SCENES_SHARE_IMAGE,
        width: 1200,
        height: 630,
        alt: "Colorado music scenes",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Colorado Music Scenes 2026",
    description: "Upcoming Colorado concerts by genre with direct booking links.",
    images: [SCENES_SHARE_IMAGE],
  },
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

function sceneIcon(slug: string): string {
  if (slug === "jam") return "🎸";
  if (slug === "edm") return "🔊";
  if (slug === "hiphop") return "🎤";
  if (slug === "country") return "🤠";
  if (slug === "bluegrass") return "🪕";
  return "🎵";
}

function venueName(venueId: string): string {
  return VENUE_LEDGER_BY_SLUG.get(venueId)?.name ?? venueId;
}

function formatDate(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function ScenesLandingPage() {
  const allEvents = await getEventsCatalog(2026, "all");
  const scenes = SCENES.slice().sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
  const [heroImage, sceneImageMap] = await Promise.all([
    getDynamicImage("genre", "colorado live music scenes concert crowd denver", "/hero/hero-home.jpg"),
    Promise.all(
      scenes.map(async (scene) => [
        scene.slug,
        await getDynamicImage("genre", `${scene.title} live music`, `${scene.slug} scene`),
      ]),
    ).then((entries) => Object.fromEntries(entries) as Record<string, string>),
  ]);

  const totalShows = scenes.reduce((count, scene) => {
    return count + allEvents.filter((event) => eventMatchesGenre(event, scene.slug)).length;
  }, 0);

  return (
    <main className="brand-page min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,91,46,0.15),transparent_26%),radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.14),transparent_18%),linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_100%)] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-[var(--brand-orange)]/20 bg-[var(--brand-bg-dark)] shadow-[0_40px_120px_rgba(0,0,0,0.46)]">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Colorado concert night crowd"
              fill
              className="object-cover object-center opacity-35"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(10,18,56,0.88)_0%,rgba(10,18,56,0.56)_44%,rgba(9,9,9,0.9)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,91,46,0.12),transparent_24%)]" />
          </div>

          <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
              <Music2 className="h-3.5 w-3.5" />
              Scene Finder
            </div>
            <h1 className="mt-5 max-w-5xl text-[2.2rem] font-black uppercase leading-[0.92] tracking-[-0.04em] sm:text-[3.3rem] lg:text-[4.4rem]">
              Colorado Music Scenes, Rebuilt
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 sm:text-[15px]">
              Browse each scene with cleaner visuals, upcoming shows, and direct links into show pages and booking flow.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/14 bg-white/7 px-4 text-[11px] font-black uppercase tracking-[0.16em] text-white/88">
                <BadgeCheck className="h-3.5 w-3.5 text-[var(--brand-cyan)]" />
                Secure Booking
              </div>
              <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/14 bg-white/7 px-4 text-[11px] font-black uppercase tracking-[0.16em] text-white/88">
                <PhoneCall className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
                720-369-6292
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/14 bg-black/25 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Scenes</div>
                <div className="mt-1 text-2xl font-black text-white">{scenes.length}</div>
              </div>
              <div className="rounded-2xl border border-white/14 bg-black/25 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Shows Matched</div>
                <div className="mt-1 text-2xl font-black text-white">{totalShows}</div>
              </div>
              <div className="rounded-2xl border border-white/14 bg-black/25 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-orange)]">Booking Path</div>
                <div className="mt-1 text-sm font-black uppercase tracking-[0.14em] text-white">Red Rocks Wizard</div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/book/red-rocks-amphitheatre"
                className="brand-button-primary inline-flex min-h-12 items-center justify-center px-6 text-xs font-black uppercase tracking-[0.16em]"
              >
                Find Your Ride Now
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          {scenes.map((scene) => {
            const featured = allEvents
              .filter((event) => eventMatchesGenre(event, scene.slug))
              .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
              .slice(0, 3);
            const image = sceneImageMap[scene.slug] || buildUnsplashImageSrc({
              query: `${scene.title} live music scene denver colorado`,
              src: `${scene.slug} scene`,
              alt: `${scene.title} scene image`,
            });

            return (
              <article
                key={scene.slug}
                className="brand-card overflow-hidden rounded-[28px]"
              >
                <div className="grid gap-0 lg:grid-cols-[360px_minmax(0,1fr)]">
                  <div className="relative h-56 border-b border-white/10 lg:h-full lg:border-b-0 lg:border-r">
                    <Image
                      src={image}
                      alt={`${scene.title} scene image`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 360px, 100vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,20,0.08),rgba(5,8,20,0.56))]" />
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--brand-cyan)]">
                      <span aria-hidden="true">{sceneIcon(scene.slug)}</span>
                      {sceneLabel(scene.slug)}
                    </div>
                    <h2 className="mt-2 text-[1.8rem] font-black uppercase tracking-[-0.03em] text-white sm:text-[2.2rem]">
                      {scene.title}
                    </h2>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-white/74">{scene.description}</p>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      {featured.length ? (
                        featured.map((event) => (
                          <div key={event.id} className="rounded-2xl border border-white/12 bg-white/5 p-4">
                            <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--brand-orange)]">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {formatDate(event.dateKey)}
                            </div>
                            <p className="mt-2 text-sm font-black text-white">{event.name}</p>
                            <p className="mt-1 inline-flex items-center gap-1 text-xs text-white/62">
                              <MapPin className="h-3.5 w-3.5" />
                              {venueName(event.venueId)}
                            </p>
                            {event.artistNames.length ? (
                              <p className="mt-2 text-xs leading-5 text-white/70">
                                {event.artistNames.slice(0, 2).map((name, idx) => (
                                  <span key={`${event.id}-${name}`}>
                                    <Link href={`/artists/${encodeURIComponent(slugifyArtist(name))}`} className="underline">
                                      {name}
                                    </Link>
                                    {idx < Math.min(event.artistNames.length, 2) - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </p>
                            ) : null}
                            <div className="mt-3">
                              <Link href={`/shows/${encodeURIComponent(event.id)}`} className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand-cyan)] underline">
                                Show Intel
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="md:col-span-3 rounded-2xl border border-white/12 bg-white/5 p-4 text-sm text-white/70">
                          No upcoming matches in the current snapshot.
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={`/scene/${scene.slug}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 bg-white/6 px-5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
                      >
                        Explore {sceneLabel(scene.slug)} →
                      </Link>
                      <Link
                        href="/book/red-rocks-amphitheatre"
                        className="brand-button-primary inline-flex min-h-11 items-center justify-center px-5 text-xs font-black uppercase tracking-[0.16em]"
                      >
                        Start Booking
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-10 rounded-[26px] border border-white/12 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:p-7">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffb07c]">Ride Planning</div>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">
            Shared Seats Or Private Ride, Same Clean Path
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-white/74">
            Fixed pricing, return ride coverage, and one booking flow for any scene night at Red Rocks.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/82">
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Fixed $59 Shared Seats</div>
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Private SUVs/Sprinters/Buses</div>
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Guaranteed Return Ride</div>
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Beat Surge Chaos</div>
          </div>
          <div className="mt-5">
            <Link
              href="/book/red-rocks-amphitheatre"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffd6a3]/26 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-6 text-xs font-black uppercase tracking-[0.16em] text-[#120f0b] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
            >
              Find Your Ride Now
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
