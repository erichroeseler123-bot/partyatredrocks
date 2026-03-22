"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import { DISPLAY } from "@/lib/display";
import { ReviewBlock } from "@/components/ReviewBlock";
import { buildBookingHref } from "@/lib/parrHandoff";
import { PRIVATE_TRANSPORT_PROMO } from "@/lib/privateTransportPromo";
import { getVenueCardImage } from "@/data/media";

const rideCards = [
  {
    title: "Shared Shuttle",
    subtitle: "$59 fixed per seat",
    copy: "For couples, friend pairs, and solo riders who want the easiest Red Rocks plan for most concert nights.",
    bullets: [
      "Denver + Golden departures",
      "Return ride handled after the show",
      "Best value for most concert nights",
    ],
    href: buildBookingHref({ target: "shared", venue: "red-rocks-amphitheatre" }),
    cta: "Secure Shared Seats",
    image: "/fleet/fleet-sprinter.webp",
    alt: "Shared shuttle option for Red Rocks transportation",
  },
  {
    title: "Private Vehicle",
    subtitle: "$499 SUV to $1199 party bus",
    copy: "For groups who want one vehicle, tailgate time, and a premium concert-night experience from pickup to dropoff.",
    bullets: [
      "SUV, van, sprinter, and party bus options",
      "Upper North limo-lane access on qualifying rides",
      "One driver and one group plan all night",
    ],
    href: buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre" }),
    cta: "View Private Vehicles",
    image: "/images/marketing/shuttle.webp",
    alt: "Private vehicle option for Red Rocks transportation",
  },
];

const venueServiceTiles = [
  {
    slug: "mishawaka-amphitheatre",
    title: "Mishawaka",
    detail: "Foothills nights and canyon runs",
    href: "/venues/mishawaka-amphitheatre",
    alt: "Mishawaka Amphitheatre canyon-stage setting",
  },
  {
    slug: "mission-ballroom",
    title: "Mission Ballroom",
    detail: "RiNo pickups and clean group moves",
    href: "/venues/mission-ballroom",
    alt: "Mission Ballroom exterior in Denver",
  },
  {
    slug: "ball-arena",
    title: "Ball Arena",
    detail: "Big-room show nights without the scramble",
    href: "/venues/ball-arena",
    alt: "Downtown Denver night atmosphere for Ball Arena event planning",
  },
  {
    slug: "empower-field-at-mile-high",
    title: "Mile High",
    detail: "Stadium nights and citywide planning",
    href: "/guide/denver-concert-transportation",
    alt: "Denver stadium-night transportation and arrival planning",
  },
  {
    slug: "fillmore-auditorium",
    title: "Fillmore",
    detail: "Colfax nights and cleaner pickup planning",
    href: "/venues/fillmore-auditorium",
    alt: "Fillmore Auditorium exterior in Denver",
  },
  {
    slug: "all-venues",
    title: "All Venues We Serve",
    detail: "See the full Denver and Boulder venue list",
    href: "/venues",
    alt: "Denver and Boulder venue network planning map",
  },
].map((tile) => ({ ...tile, image: getVenueCardImage(tile.slug) }));

export default function HomeSections() {
  return (
    <main className="bg-[#090909] text-[#f8f4ed]">
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-[#f5c66c]/20 bg-[#12100e] shadow-[0_40px_120px_rgba(0,0,0,0.58)]">
          <div className="absolute inset-0">
            <Image
              src="/hero/hero-home.webp"
              alt="Nighttime Red Rocks crowd and venue lights"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(9,9,9,0.86)_0%,rgba(9,9,9,0.58)_45%,rgba(9,9,9,0.88)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,198,108,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_22%)]" />
          </div>

          <div className="relative px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
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
                  href={buildBookingHref({ target: "shared", venue: "red-rocks-amphitheatre" })}
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#ffd6a3]/28 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-8 text-base font-black uppercase tracking-[0.16em] text-[#fff4de] shadow-[0_18px_42px_rgba(141,79,32,0.3)] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fff4de]/60"
                >
                  Book Shuttle
                </Link>
                <Link
                  href="/week/red-rocks"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/16 bg-black/20 px-8 text-base font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
                >
                  See Upcoming Shows
                </Link>
                <Link
                  href="/quick-red-rocks"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#8fd0ff]/40 bg-[#0f1b31]/90 px-8 text-base font-black uppercase tracking-[0.16em] text-[#cde8ff] transition hover:bg-[#12223d]"
                >
                  Quick Ride Wizard
                </Link>
              </div>

              <div className="mt-6 max-w-3xl overflow-hidden rounded-[30px] border border-amber-100/55 bg-[linear-gradient(135deg,rgba(255,227,163,0.36)_0%,rgba(255,156,64,0.38)_32%,rgba(122,40,8,0.5)_58%,rgba(18,12,8,0.98)_100%)] shadow-[0_28px_110px_rgba(255,132,45,0.42)] ring-1 ring-amber-200/20 backdrop-blur">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 w-2 bg-[linear-gradient(180deg,#fff0bf_0%,#ff9c40_100%)]" />
                  <div className="absolute right-[-60px] top-[-50px] h-40 w-40 rounded-full bg-amber-200/18 blur-3xl" />
                  <div className="absolute bottom-[-80px] right-16 h-44 w-44 rounded-full bg-orange-500/18 blur-3xl" />

                  <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-black/32 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.26em] text-amber-50">
                        <TicketPercent className="h-3.5 w-3.5" />
                        April private ride promo
                      </div>

                      <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
                        <span className="text-4xl font-black uppercase tracking-[-0.06em] text-white sm:text-5xl">
                          $50 Off
                        </span>
                        <span className="pb-1 text-xs font-black uppercase tracking-[0.28em] text-[#ffe7b3] sm:text-sm">
                          Private Transportation
                        </span>
                      </div>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white sm:text-[15px]">
                        {PRIVATE_TRANSPORT_PROMO.headline} Use code{" "}
                        <span className="rounded-full bg-black/30 px-2 py-1 font-black tracking-[0.1em] text-[#ffe2a8]">
                          {PRIVATE_TRANSPORT_PROMO.code}
                        </span>
                        .
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 sm:min-w-[240px]">
                      <div className="rounded-[22px] border border-white/18 bg-black/30 px-4 py-3 text-center shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/60">Use Code</div>
                        <div className="mt-1 text-base font-black uppercase tracking-[0.14em] text-white">
                          {PRIVATE_TRANSPORT_PROMO.code}
                        </div>
                      </div>

                      <Link
                        href={buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre" })}
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffd6a3]/28 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-5 text-xs font-black uppercase tracking-[0.18em] text-[#fff4de] shadow-[0_16px_36px_rgba(141,79,32,0.28)] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
                      >
                        Claim Private Ride Deal
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          {rideCards.map((ride) => (
            <article
              key={ride.title}
              className="overflow-hidden rounded-[32px] border border-[#f5c66c]/14 bg-[linear-gradient(180deg,rgba(19,17,15,0.98),rgba(10,10,10,0.98))] shadow-[0_30px_100px_rgba(0,0,0,0.48)]"
            >
              <div className="relative h-72">
                <Image
                  src={ride.image}
                  alt={ride.alt}
                  fill
                  sizes="(min-width: 1280px) 720px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.12),rgba(9,9,9,0.84)_100%)]" />
                <div className="absolute left-6 top-6 rounded-full border border-white/70 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#120f0b] shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
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
                  className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full border border-[#ffd6a3]/28 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-8 text-sm font-black uppercase tracking-[0.16em] text-[#fff4de] shadow-[0_18px_42px_rgba(141,79,32,0.28)] transition hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
                >
                  {ride.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <ReviewBlock />

        <section className="rounded-[34px] border border-[#9fe6df]/22 bg-[linear-gradient(135deg,rgba(12,41,46,0.98),rgba(8,26,34,0.98)_52%,rgba(7,11,18,0.98)_100%)] px-6 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.48)] sm:px-8">
          <div className="max-w-4xl">
            <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f5c66c]">Start Here</div>
            <h2 className="mt-3 text-[1.45rem] font-black uppercase tracking-[-0.06em] text-white sm:text-[1.9rem] lg:text-[2.15rem] xl:text-[2.25rem]">
              We cover all the Denver/Boulder venue chaos
            </h2>
            <p className="mt-3 text-[13px] leading-6 text-white/70 sm:text-[14px] lg:text-[13px]">
              Mishawaka canyon runs, Mission Ballroom nights, Ball Arena crowds, Mile High traffic, plus the full venue map in one place.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {venueServiceTiles.map((tile) => (
              <Link
                key={tile.title}
                href={tile.href}
                className="flex flex-col rounded-[28px] border border-[#9fe6df]/16 bg-[linear-gradient(180deg,rgba(17,60,66,0.96),rgba(10,29,36,0.98))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] transition hover:-translate-y-1 hover:border-[#9fe6df]/38"
              >
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-[20px] border border-white/10">
                  <Image
                    src={tile.image}
                    alt={tile.alt}
                    fill
                    sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 16vw"
                    className="object-cover"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.08),rgba(9,9,9,0.36))]" />
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f5c66c]">Venue Service</div>
                <h3 className="mt-3 text-[1.2rem] font-black uppercase tracking-[-0.04em] text-white md:text-[1.3rem]">
                  {tile.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/72">{tile.detail}</p>
                <div className="mt-auto pt-5 inline-flex items-center text-sm font-black uppercase tracking-[0.16em] text-[#f5c66c]">
                  Open Page
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>

    </main>
  );
}
