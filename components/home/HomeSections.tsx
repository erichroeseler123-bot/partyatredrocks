"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  DollarSign,
  Headphones,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";
import { DISPLAY } from "@/lib/display";

type EventPreview = {
  id: number;
  title: string;
  datetime_local: string;
  performers?: Array<{ name?: string; image?: string }>;
  venue?: { siteSlug?: string; siteName?: string };
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
    body: "Pay what you see with clear pricing from the start.",
    icon: DollarSign,
  },
  {
    title: "Guaranteed Return",
    body: "Clear meetup point, clean exit, and your ride back handled.",
    icon: Clock3,
  },
  {
    title: "Pro Drivers + Group Rides",
    body: "Friendly, experienced drivers and a better fit for the whole crew.",
    icon: ShieldCheck,
  },
  {
    title: "Real-Time Support",
    body: "Text or call anytime and get help from people who know the flow.",
    icon: Headphones,
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

export default function HomeSections({
  events = [],
}: {
  events?: EventPreview[];
}) {
  const featuredEvents = (events ?? []).slice(0, 3);

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

          <div className="relative flex min-h-[58vh] flex-col justify-center px-5 py-8 text-center sm:min-h-[64vh] sm:px-8 sm:py-10 lg:min-h-[68vh] lg:px-12 lg:py-14">
            <div className="mx-auto max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-[#ff8a3d]" />
                {DISPLAY.ui.home.badge}
              </div>

              <h1 className="mt-5 text-[2.35rem] font-black uppercase leading-[0.94] tracking-[-0.04em] text-white sm:text-[3.9rem] lg:text-[5.35rem]">
                The Best Way to Red Rocks
              </h1>

              <p className="mt-5 text-[15px] leading-7 text-white/78 sm:text-lg">
                Fixed $59 shuttle seats from Denver. No surge. Guaranteed return. Professional drivers and real text support on show night.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/book"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb07c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1020]"
                >
                  Start Booking
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
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
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] px-5 py-7 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Why Riders Trust It</div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                The basics should be obvious.
              </h2>
            </div>
            <Link href="/about" className="hidden text-sm font-bold text-[#8fd0ff] md:inline-flex">
              Why trust GoSno LLC? <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-[24px] border border-white/10 bg-[#0b1224] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
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

          <Link href="/about" className="mt-5 inline-flex text-sm font-bold text-[#8fd0ff] md:hidden">
            Why trust GoSno LLC? <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,10,24,0.98),rgba(9,14,28,0.95))] px-5 py-7 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                This Week
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Upcoming Shows. Tap In Fast.
              </h2>
            </div>
            <Link href="/week" className="hidden text-sm font-bold text-[#8fd0ff] md:inline-flex">
              See All Upcoming <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,11,18,0.96),rgba(10,9,20,0.96))] px-5 py-7 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
                Get Ready for Show Night
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Three guides, then the rest lives in the hub.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
                Parking reality, ride comparisons, and show-night rules without turning the homepage into a wall of logistics.
              </p>
            </div>
            <Link href="/guide" className="hidden text-sm font-bold text-[#ffb07c] md:inline-flex">
              Open Full Guides Hub <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {guideCards.slice(0, 3).map((guide) => (
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
                Final Check
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Ready for your Red Rocks night?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
                Operated by GoSno LLC with hosted secure checkout, real support, and a booking flow that gets you from venue choice to final product fast.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Colorado-Based Operator",
                    body: "A real transportation brand, not just a generic lead form dropped on a concert page.",
                  },
                  {
                    title: "Hosted Secure Checkout",
                    body: "Rezdy powers the final booking pages so payment and availability stay stable.",
                  },
                  {
                    title: "Support + Policies",
                    body: "Read how it works, then book with the right expectations before show night starts.",
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
                  Book Your Shuttle Now
                </Link>
                <Link
                  href="/about"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
                >
                  About GoSno
                </Link>
              </div>
            </div>
        </section>
      </section>
    </main>
  );
}
