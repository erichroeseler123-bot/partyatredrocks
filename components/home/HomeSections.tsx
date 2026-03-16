"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bus,
  Clock3,
  Headphones,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Stars,
} from "lucide-react";
import { DISPLAY } from "@/lib/display";
import { ReviewBlock } from "@/components/ReviewBlock";
import { buildBookingHref } from "@/lib/parrHandoff";

const heroMoments = [
  {
    src: "/hero/hero-home.jpg",
    alt: "Red Rocks at night packed with concert energy",
    label: "Red Rocks after dark",
  },
  {
    src: "/images/marketing/shuttle.jpg",
    alt: "Concert crowd smiling on a shuttle ride",
    label: "Fixed-price shuttle energy",
  },
  {
    src: "/images/marketing/vip-suv.jpg",
    alt: "Private SUV setup for a premium concert ride",
    label: "Private arrival, clean exit",
  },
];

const rideCards = [
  {
    title: "Shared Shuttle",
    subtitle: "$59 fixed per seat",
    copy: "For couples, friend pairs, and solo riders who want the easiest Red Rocks plan without surge pricing.",
    bullets: [
      "Denver + Golden departures",
      "Guaranteed return ride after the show",
      "Best value for most concert nights",
    ],
    href: buildBookingHref({ target: "shared", venue: "red-rocks-amphitheatre" }),
    cta: "Secure Shared Seats",
    image: "/images/marketing/shuttle.jpg",
    alt: "Concert shuttle with riders heading to Red Rocks",
  },
  {
    title: "Private Fleet",
    subtitle: "$499 SUV to $1199 party bus",
    copy: "For groups who want one vehicle, tailgate time, and a premium concert-night experience from pickup to dropoff.",
    bullets: [
      "SUV, van, sprinter, and party bus options",
      "Upper North limo-lane access on qualifying rides",
      "One driver and one group plan all night",
    ],
    href: buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre" }),
    cta: "View Private Fleet",
    image: "/fleet/fleet-sprinter.jpg",
    alt: "Premium sprinter and private fleet option for Red Rocks",
  },
];

const premiumSignals = [
  {
    title: "No Surge Pricing",
    body: "The fixed-rate promise people wish Uber made after the encore.",
    icon: Stars,
  },
  {
    title: "Guaranteed Return",
    body: "Your ride home is already handled before the show starts.",
    icon: Clock3,
  },
  {
    title: "Colorado-Based Team",
    body: "Local operator, venue-aware planning, and actual Red Rocks experience.",
    icon: MapPinned,
  },
  {
    title: "Real Text Support",
    body: "Show-night help from humans who know the venue flow and pickup reality.",
    icon: Headphones,
  },
];

const fleetTiles = [
  {
    title: "Private SUV",
    detail: "Up to 6 guests",
    image: "/images/marketing/vip-suv.jpg",
    alt: "Private SUV option for Red Rocks transportation",
  },
  {
    title: "10 Passenger Van",
    detail: "Cleaner group logistics",
    image: "/images/marketing/shuttle.jpg",
    alt: "Passenger van option for Red Rocks group transportation",
  },
  {
    title: "14 Passenger Sprinter",
    detail: "Ambient, roomy, premium",
    image: "/fleet/fleet-sprinter.jpg",
    alt: "Sprinter van option for premium Red Rocks transportation",
  },
  {
    title: "24 Passenger Party Bus",
    detail: "Rolling lounge energy",
    image: "/hero/hero-home.jpg",
    alt: "Party bus concert-night energy for Red Rocks groups",
  },
];

export default function HomeSections() {
  return (
    <main className="bg-[#090909] text-[#f8f4ed]">
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-[#f5c66c]/20 bg-[#12100e] shadow-[0_40px_120px_rgba(0,0,0,0.58)]">
          <div className="absolute inset-0">
            <Image
              src="/hero/hero-home.jpg"
              alt="Nighttime Red Rocks crowd and venue lights"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(9,9,9,0.86)_0%,rgba(9,9,9,0.58)_45%,rgba(9,9,9,0.88)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,198,108,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_22%)]" />
          </div>

          <div className="relative grid gap-8 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1.15fr)_420px] lg:px-12 lg:py-14">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#f5c66c] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {DISPLAY.ui.home.badge}
              </div>

              <p className="mt-6 font-accent text-xl italic text-[#efe5d3] sm:text-2xl">
                Colorado concert transport with a premium, no-chaos finish.
              </p>

              <h1 className="mt-4 max-w-5xl text-[2.7rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white sm:text-[4.3rem] lg:text-[5.8rem]">
                Elevate Your
                <span className="block text-[#f5c66c]">Red Rocks Night</span>
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
                Fixed $59 shuttle seats, private SUVs, sprinters, and party buses for groups that want a cleaner arrival, a guaranteed return, and less post-show chaos.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/book"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#f5c66c] px-8 text-base font-black uppercase tracking-[0.16em] text-[#120f0b] transition hover:bg-[#ffd989] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Secure Your Ride Now
                </Link>
                <Link
                  href="/shuttles"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/16 bg-black/20 px-8 text-base font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
                >
                  Explore Fleet Options
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Shared Seats", value: "$59 fixed" },
                  { label: "Private Fleet", value: "$499-$1199" },
                  { label: "Return Promise", value: "Always handled" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[24px] border border-white/10 bg-black/28 px-5 py-4 backdrop-blur"
                  >
                    <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/52">{stat.label}</div>
                    <div className="mt-2 text-xl font-black text-[#f5c66c]">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:self-end">
              {heroMoments.map((moment, index) => (
                <article
                  key={moment.label}
                  className={`gold-ring relative overflow-hidden rounded-[28px] border border-white/10 bg-[#181512] ${index === 1 ? "premium-float" : ""}`}
                >
                  <div className="relative h-44">
                    <Image
                      src={moment.src}
                      alt={moment.alt}
                      fill
                      className="object-cover"
                      sizes="420px"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.08),rgba(9,9,9,0.84)_100%)]" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f5c66c]">{moment.label}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {premiumSignals.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[28px] border border-[#f5c66c]/14 bg-[linear-gradient(180deg,rgba(25,21,18,0.95),rgba(13,13,13,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
              >
                <div className="inline-flex rounded-2xl border border-[#f5c66c]/22 bg-[#f5c66c]/10 p-3 text-[#f5c66c]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-black uppercase tracking-[-0.03em] text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/68">{item.body}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          {rideCards.map((ride) => (
            <article
              key={ride.title}
              className="overflow-hidden rounded-[32px] border border-[#f5c66c]/14 bg-[linear-gradient(180deg,rgba(19,17,15,0.98),rgba(10,10,10,0.98))] shadow-[0_30px_100px_rgba(0,0,0,0.48)]"
            >
              <div className="relative h-72">
                <Image src={ride.image} alt={ride.alt} fill className="object-cover" sizes="(min-width: 1280px) 720px, 100vw" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.12),rgba(9,9,9,0.84)_100%)]" />
                <div className="absolute left-6 top-6 rounded-full border border-white/12 bg-black/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#f5c66c] backdrop-blur">
                  {ride.subtitle}
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-[2rem] font-black uppercase tracking-[-0.04em] text-white sm:text-[2.4rem]">{ride.title}</h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/74">{ride.copy}</p>
                <ul className="mt-5 space-y-3">
                  {ride.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-white/82">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#f5c66c]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={ride.href}
                  className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-[#f5c66c] px-8 text-sm font-black uppercase tracking-[0.16em] text-[#120f0b] transition hover:bg-[#ffd989]"
                >
                  {ride.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[34px] border border-[#f5c66c]/14 bg-[linear-gradient(180deg,rgba(17,15,14,0.98),rgba(10,10,10,0.98))] px-6 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.48)] sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f5c66c]">Fleet Showcase</div>
              <h2 className="mt-3 text-[2.2rem] font-black uppercase tracking-[-0.04em] text-white sm:text-[3rem]">
                Premium fleet, party-night mindset
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/70 sm:text-[15px]">
                The fleet mix is built around the actual Red Rocks night: cooler space, group coordination, cleaner arrival, and less friction after the encore.
              </p>
            </div>
            <Link
              href={buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre" })}
              className="inline-flex min-h-12 items-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Compare Private Options
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {fleetTiles.map((tile) => (
              <article
                key={tile.title}
                className="overflow-hidden rounded-[26px] border border-white/10 bg-[#171412] shadow-[0_20px_70px_rgba(0,0,0,0.4)]"
              >
                <div className="relative h-56">
                  <Image src={tile.image} alt={tile.alt} fill className="object-cover" sizes="(min-width: 1280px) 25vw, 50vw" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.08),rgba(10,10,10,0.84)_100%)]" />
                </div>
                <div className="p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f5c66c]">{tile.detail}</div>
                  <div className="mt-2 text-lg font-black uppercase tracking-[-0.03em] text-white">{tile.title}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <ReviewBlock />

        <section className="rounded-[34px] border border-[#f5c66c]/16 bg-[linear-gradient(120deg,rgba(20,16,12,0.98),rgba(10,10,10,1))] px-6 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f5c66c]">VIP Finish</div>
              <h2 className="mt-3 text-[2.1rem] font-black uppercase tracking-[-0.04em] text-white sm:text-[3rem]">
                No surge. Guaranteed return. Book once.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72 sm:text-[15px]">
                Party at Red Rocks is built for the exact moment other transport options fall apart. Your route, pricing, and ride home are handled before the show even starts.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/book"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#f5c66c] px-8 text-base font-black uppercase tracking-[0.16em] text-[#120f0b] transition hover:bg-[#ffd989]"
                >
                  Start Booking
                </Link>
                <Link
                  href="/about"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/14 bg-white/6 px-8 text-base font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
                >
                  See How It Works
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/24 p-6 backdrop-blur">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/50">Premium Promise</div>
              <ul className="mt-4 space-y-4">
                {[
                  "Colorado owned and operated",
                  "Straight pricing with no surprise surge",
                  "One-tap booking path on mobile",
                  "Shared seats and premium private fleet",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/82">
                    <Bus className="mt-0.5 h-4 w-4 shrink-0 text-[#f5c66c]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </section>

      <div className="fixed inset-x-0 bottom-4 z-40 px-4 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 rounded-full border border-[#f5c66c]/24 bg-[rgba(10,10,10,0.88)] px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/52">Red Rocks Shuttle</div>
            <div className="text-sm font-black text-[#f5c66c]">$59 fixed seats + private fleet</div>
          </div>
          <Link
            href="/book"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f5c66c] px-5 text-xs font-black uppercase tracking-[0.16em] text-[#120f0b]"
          >
            Book Now
          </Link>
        </div>
      </div>
    </main>
  );
}
