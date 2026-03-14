"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Clock3,
  DollarSign,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";
import { DISPLAY, SCENE_PILLS, VENUE_PILLS } from "@/lib/display";

type EventPreview = {
  id: number;
  title: string;
  datetime_local: string;
  performers?: Array<{ name?: string; image?: string }>;
  venue?: { siteSlug?: string; siteName?: string };
};

type VenuePreview = {
  slug: string;
  name: string;
  area?: string;
};

const venuePhotoMap: Record<string, string> = {
  "red-rocks-amphitheatre": "/hero/hero-home.jpg",
  "mission-ballroom": "/venues/missionsite.jpg",
  "fiddlers-green-amphitheatre": "/hero/hero-guides.jpg",
  "fillmore-auditorium": "/hero/hero-guides.jpg",
  "gothic-theatre": "/hero/hero-guides.jpg",
  "cervantes-masterpiece": "/hero/hero-guides.jpg",
};

const benefits = [
  {
    title: "Fixed Pricing",
    body: "No surge, no surprises, no mystery total when the encore ends.",
    icon: DollarSign,
  },
  {
    title: "Guaranteed Return",
    body: "Clear meetup point, clean post-show exit, guaranteed ride home.",
    icon: Clock3,
  },
  {
    title: "Skip Parking Hell",
    body: "No lot roulette, no stair gamble, no trying to summon a ride in chaos.",
    icon: MapPinned,
  },
  {
    title: "Group-Friendly + Safe",
    body: "Professional drivers, support on speed dial, easier nights out for the whole crew.",
    icon: ShieldCheck,
  },
];

const guideCards = [
  {
    title: "Red Rocks Concert Guide",
    href: "/red-rocks/concert-guide",
    copy: "The big-picture playbook for arrivals, timing, seats, weather, and exits.",
  },
  {
    title: "Shuttle vs Rideshare",
    href: "/guide/transportation/shuttle-vs-uber",
    copy: "The cleanest answer to cost, reliability, and post-encore pickup pain.",
  },
  {
    title: "Post-Show Pickup Plan",
    href: "/guide/show-night-strategy/post-show-pickup-plan",
    copy: "How to avoid the stranded, dead-phone, wrong-lot disaster after the show.",
  },
  {
    title: "Bag Policy + Show-Night Rules",
    href: "/guide/logistics/bag-policy",
    copy: "What to bring, what gets flagged, and how to avoid gate friction.",
  },
];

function eventDateLabel(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function eventTimeLabel(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function eventImage(event: EventPreview) {
  const performerImage = event.performers?.find((p) => p?.image)?.image;
  if (performerImage) return performerImage;
  if (event.venue?.siteSlug && venuePhotoMap[event.venue.siteSlug]) {
    return venuePhotoMap[event.venue.siteSlug];
  }
  return "/hero/hero-home.jpg";
}

function venueImage(slug: string) {
  return venuePhotoMap[slug] || "/hero/hero-guides.jpg";
}

function venueTagline(slug: string, name: string) {
  if (slug === "red-rocks-amphitheatre") return "The headline route. Biggest demand, biggest parking pain, easiest win.";
  if (slug === "mission-ballroom") return "Fast city nights without the parking search or post-show scramble.";
  if (slug === "fiddlers-green-amphitheatre") return "Large outdoor crowds, simple ride plans, cleaner exits.";
  if (slug === "fillmore-auditorium") return "Classic Denver venue with a better arrival and a guaranteed ride home.";
  if (slug === "gothic-theatre") return "Smaller-room energy without needing a designated driver.";
  return `${name} with cleaner logistics, clearer pickup, and less show-night friction.`;
}

export default function HomeSections({
  events = [],
  venues = [],
}: {
  events?: EventPreview[];
  venues?: VenuePreview[];
}) {
  const featuredEvents = (events ?? []).slice(0, 4);
  const featuredVenues = (venues ?? []).slice(0, 6);

  return (
    <main className="bg-[#050816] text-white">
      <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0a1020] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0">
            <Image
              src="/hero/hero-home.jpg"
              alt="Red Rocks concert crowd at night"
              fill
              priority
              className="object-cover object-[center_35%]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,98,0,0.28),transparent_32%),linear-gradient(120deg,rgba(5,8,22,0.2),rgba(5,8,22,0.82)_45%,rgba(5,8,22,0.96)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.15)_0%,rgba(5,8,22,0.62)_48%,rgba(5,8,22,0.94)_100%)]" />
          </div>

          <div className="relative grid min-h-[64vh] gap-8 px-5 py-8 sm:min-h-[72vh] sm:px-8 sm:py-10 lg:min-h-[80vh] lg:grid-cols-[minmax(0,1.2fr)_360px] lg:px-12 lg:py-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-[#ff8a3d]" />
                {DISPLAY.ui.home.badge}
              </div>

              <h1 className="mt-5 max-w-3xl text-[2.35rem] font-black uppercase leading-[0.94] tracking-[-0.04em] text-white sm:text-[3.9rem] lg:text-[5.35rem]">
                Stress-Free Rides to Red Rocks
              </h1>

              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/78 sm:max-w-2xl sm:text-lg">
                Fixed-price shuttles from Denver. No surge pricing. Guaranteed return ride.
                Pro drivers and real support when the night gets loud.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/find"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb07c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1020]"
                >
                  Reserve Spot Now
                </Link>
                <Link
                  href="/week"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/8 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1020]"
                >
                  Hot Shows This Week
                </Link>
                <Link
                  href="/private-suburban"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-black/20 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1020]"
                >
                  Private SUVs
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {VENUE_PILLS.map((v) => (
                  <Link
                    key={v.slug}
                    href={`/book?venue=${v.slug}`}
                    className="rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/85 transition hover:border-white/30 hover:bg-black/35"
                  >
                    {v.name}
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "$59 seats",
                  "No surge",
                  "Guaranteed return",
                  "Text support",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#ff8a3d]/30 bg-[#ff8a3d]/12 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffd0b4]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 self-end">
              <div className="rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(7,12,26,0.88),rgba(7,12,26,0.72))] p-5 backdrop-blur">
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                  Fast Booking
                </div>
                <div className="mt-3 text-2xl font-black leading-tight text-white">
                  This is the easiest way to do Red Rocks without parking hell.
                </div>
                <div className="mt-3 text-sm leading-6 text-white/72">
                  Book seats fast, go private for your group, or start with this week&apos;s lineup and
                  tap Ride Options.
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <Link
                    href="/book"
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-bold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Book Shuttle
                  </Link>
                  <Link
                    href="/week"
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-bold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Browse This Week
                  </Link>
                  <Link
                    href="/guide/transportation/shuttle-vs-uber"
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-bold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Shuttle vs Rideshare
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] px-5 py-8 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                Book in 10 Seconds
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Quick Picks for Your Night
              </h2>
            </div>
            <Link href="/find" className="hidden text-sm font-bold text-[#8fd0ff] md:inline-flex">
              Open Ride Finder <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="-mx-1 mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:px-0">
            {VENUE_PILLS.map((v) => (
              <Link
                key={v.slug}
                href={`/book?venue=${v.slug}`}
                className="inline-flex min-h-11 snap-start items-center whitespace-nowrap rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:border-white/25 hover:bg-white/12"
              >
                {v.name}
              </Link>
            ))}
            <Link
              href="/venues"
              className="inline-flex min-h-11 snap-start items-center whitespace-nowrap rounded-full border border-[#8fd0ff]/20 bg-[#8fd0ff]/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#8fd0ff] transition hover:bg-[#8fd0ff]/16"
            >
              More Venues
            </Link>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {SCENE_PILLS.map((s) => (
              <Link
                key={s.key}
                href={s.href}
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/68 transition hover:text-white/90"
              >
                {s.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 text-sm text-white/58">
            Tip: browse <Link className="font-bold text-[#8fd0ff]" href="/week">This Week</Link> and tap Ride Options on the show you want.
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,10,24,0.98),rgba(9,14,28,0.95))] px-5 py-7 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                This Week
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Upcoming This Week. Secure Your Ride.
              </h2>
            </div>
            <Link href="/week" className="hidden text-sm font-bold text-[#8fd0ff] md:inline-flex">
              See All Upcoming <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {featuredEvents.map((event) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-[26px] border border-white/10 bg-[#0b1224] shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
              >
                <div className="relative h-52 overflow-hidden sm:h-56">
                  <img
                    src={eventImage(event)}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,20,0.12),rgba(6,10,20,0.76)_78%,rgba(6,10,20,0.9)_100%)]" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/88">
                    {eventDateLabel(event.datetime_local)}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8fd0ff]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {eventTimeLabel(event.datetime_local)}
                  </div>
                  <h3 className="mt-3 text-xl font-black leading-tight text-white">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    {event.venue?.siteName ?? "Colorado venue"} ride options, fixed pricing, and a cleaner exit plan.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/book?event=${event.id}`}
                      className="inline-flex min-h-11 items-center rounded-full bg-[#ff5b2e] px-4 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
                    >
                      Ride Options
                    </Link>
                    <Link
                      href={`/shows/${event.id}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/85 transition hover:bg-white/10"
                    >
                      Show Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            {featuredEvents.length === 0 ? (
              <div className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 text-white/68">
                No event cards are available yet. The section is ready once the events feed populates.
              </div>
            ) : null}
          </div>

          <Link href="/week" className="mt-5 inline-flex text-sm font-bold text-[#8fd0ff] md:hidden">
            See All Upcoming <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,21,38,0.96),rgba(8,12,24,0.96))] px-5 py-7 sm:px-8">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Why Choose Us
            </div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
              The smoothest show-night logistics on the page.
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div className="inline-flex rounded-2xl border border-[#ff8a3d]/25 bg-[#ff8a3d]/10 p-3 text-[#ffb07c]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-lg font-black text-white">{benefit.title}</div>
                    <p className="mt-2 text-sm leading-6 text-white/68">{benefit.body}</p>
                  </div>
                );
              })}
            </div>

            <Link
              href="/guide/parking-reality"
              className="mt-6 inline-flex text-sm font-bold text-[#8fd0ff]"
            >
              Read the Full Parking Reality Guide <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#091120]">
            <div className="relative min-h-[320px] h-full">
              <Image
                src="/hero/hero-guides.jpg"
                alt="Concert crowd and Red Rocks strategy vibe"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,24,0.12),rgba(8,12,24,0.68)_54%,rgba(8,12,24,0.96)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/82">
                  <CarFront className="h-3.5 w-3.5 text-[#ff8a3d]" />
                  Why shuttle beats rideshare
                </div>
                <div className="mt-3 text-2xl font-black leading-tight text-white">
                  Fewer unknowns on the way in. Zero guessing on the way out.
                </div>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/74">
                  Skip the uncertainty, keep the energy, and leave with a cleaner plan than rideshare roulette.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,10,24,0.98),rgba(10,14,28,0.95))] px-5 py-7 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                Popular Colorado Venues
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Venue intel, rebuilt as cards instead of a wall of links.
              </h2>
            </div>
            <Link href="/venues" className="hidden text-sm font-bold text-[#8fd0ff] md:inline-flex">
              View All Venues <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredVenues.map((venue) => (
              <Link
                key={venue.slug}
                href={`/venues/${venue.slug}`}
                className="group overflow-hidden rounded-[26px] border border-white/10 bg-[#0b1224] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
              >
                <div className="relative h-44">
                  <Image
                    src={venueImage(venue.slug)}
                    alt={venue.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,18,0.08),rgba(5,8,18,0.82)_84%,rgba(5,8,18,0.94)_100%)]" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/88">
                    Venue Intel
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xl font-black text-white">{venue.name}</div>
                  {venue.area ? <div className="mt-1 text-sm text-white/58">{venue.area}</div> : null}
                  <p className="mt-3 text-sm leading-6 text-white/68">
                    {venueTagline(venue.slug, venue.name)}
                  </p>
                  <div className="mt-5 inline-flex items-center text-sm font-bold text-[#8fd0ff]">
                    Shuttle Details <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}

            {featuredVenues.length === 0 ? (
              <div className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 text-white/68">
                Venue cards will appear here when homepage venue data is available.
              </div>
            ) : null}
          </div>

          <Link href="/venues" className="mt-5 inline-flex text-sm font-bold text-[#8fd0ff] md:hidden">
            View All Venues <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,11,18,0.96),rgba(10,9,20,0.96))] px-5 py-7 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                Level Up Your Night
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Keep the zine feel. Drop the info-dump feeling.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
                Parking reality, pickup hubs, what-to-bring, and the don&apos;t-get-stranded plan, now framed as featured guide cards.
              </p>
            </div>
            <Link href="/guide" className="hidden text-sm font-bold text-[#ffb07c] md:inline-flex">
              Open Full Guides Hub <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {guideCards.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.07]"
              >
                <div className="inline-flex rounded-2xl border border-[#ffb07c]/25 bg-[#ffb07c]/10 p-3 text-[#ffd0b4]">
                  <Ticket className="h-5 w-5" />
                </div>
                <div className="mt-4 text-lg font-black text-white">{guide.title}</div>
                <p className="mt-2 text-sm leading-6 text-white/68">{guide.copy}</p>
                <div className="mt-5 inline-flex items-center text-sm font-bold text-[#ffb07c]">
                  Read Guide <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>

          <Link href="/guide" className="mt-5 inline-flex text-sm font-bold text-[#ffb07c] md:hidden">
            Open Full Guides Hub <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,24,0.98),rgba(6,9,18,0.98))] px-5 py-7 sm:px-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                Trust + Support
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Clear meetup plan. Text or call support. Real professional drivers.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
                Spots fill fast. Keep the confidence signals obvious and the booking path one tap away.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Clear Meetup Plan",
                    body: "Simple pickup instructions and a return plan that doesn&apos;t require guesswork.",
                  },
                  {
                    title: "Text / Call Support",
                    body: "Help finding the shuttle, handling changes, or getting the group back together.",
                  },
                  {
                    title: "Real Pro Drivers",
                    body: "Consistent, professional transportation instead of rolling the dice after the show.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div className="text-lg font-black text-white">{item.title}</div>
                    <p className="mt-2 text-sm leading-6 text-white/68">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:min-w-[220px]">
              <Link
                href="/book"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
              >
                Book Shuttle
              </Link>
              <Link
                href="/private-suburban"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
              >
                Private SUVs
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
