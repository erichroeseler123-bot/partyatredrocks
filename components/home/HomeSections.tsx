"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  CreditCard,
  ShieldCheck,
  TicketPercent,
} from "lucide-react";
import { ReviewBlock } from "@/components/ReviewBlock";
import { PRIVATE_TRANSPORT_PROMO } from "@/lib/privateTransportPromo";

const BOOK_RED_ROCKS = "/book/red-rocks-amphitheatre";

type HomeSectionsProps = {
  heroSrc: string;
  shuttleSrc: string;
  sprinterSrc: string;
  urgency:
    | {
        label: string;
        detail: string;
      }
    | null;
};

export default function HomeSections({ heroSrc, shuttleSrc, sprinterSrc, urgency }: HomeSectionsProps) {
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
      href: BOOK_RED_ROCKS,
      cta: "Secure Shared Seats",
      image: sprinterSrc,
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
      href: BOOK_RED_ROCKS,
      cta: "View Private Vehicles",
      image: shuttleSrc,
      alt: "Private vehicle option for Red Rocks transportation",
    },
  ];

  return (
    <main className="brand-page">
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        {urgency ? (
          <section className="brand-glass-bar overflow-hidden rounded-[24px] px-5 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.24em]">{urgency.label}</div>
                <p className="mt-1 text-sm leading-6 text-white/82">{urgency.detail}</p>
              </div>
              <Link href="/week/red-rocks" className="brand-link text-sm font-black uppercase tracking-[0.16em] no-underline">
                View lineup
              </Link>
            </div>
          </section>
        ) : null}

        <section className="relative overflow-hidden rounded-[36px] border border-[var(--brand-orange)]/20 bg-[var(--brand-bg-dark)] shadow-[0_40px_120px_rgba(0,0,0,0.58)]">
          <div className="absolute inset-0">
            <Image
              src={heroSrc}
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
              <p className="font-accent text-xl italic text-white/84 sm:text-2xl">
                Red Rocks ride planning with a premium, no-chaos finish.
              </p>

              <h1 className="mt-4 max-w-5xl text-[2.7rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white sm:text-[4.3rem] lg:text-[5.8rem]">
                Elevate Your
                <span className="block text-[var(--brand-orange)]">Red Rocks Night</span>
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
                Fixed $59 shuttle seats, private SUVs, sprinters, and party buses for groups that want a cleaner arrival, a guaranteed return, and less post-show chaos.
              </p>

              <div className="mt-6 grid max-w-6xl gap-4 sm:grid-cols-3">
                <article className="rounded-[24px] border border-[var(--brand-orange)]/16 bg-[linear-gradient(180deg,rgba(53,33,16,0.96),rgba(24,16,12,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] transition hover:-translate-y-0.5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/16 bg-white/8">
                    <CalendarDays className="h-4 w-4 text-[var(--brand-orange)]" />
                  </div>
                  <h3 className="mt-3 text-[1.1rem] font-black uppercase tracking-[-0.04em] text-white">Choose your date</h3>
                  <p className="mt-2 text-sm leading-6 text-white/72">Pick your show night and lock the right trip timing first.</p>
                </article>
                <article className="rounded-[24px] border border-[var(--brand-orange)]/16 bg-[linear-gradient(180deg,rgba(53,33,16,0.96),rgba(24,16,12,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] transition hover:-translate-y-0.5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/16 bg-white/8">
                    <CarFront className="h-4 w-4 text-[var(--brand-orange)]" />
                  </div>
                  <h3 className="mt-3 text-[1.1rem] font-black uppercase tracking-[-0.04em] text-white">Pick your ride</h3>
                  <p className="mt-2 text-sm leading-6 text-white/72">Choose shared seats or a private vehicle for your group.</p>
                </article>
                <article className="rounded-[24px] border border-[var(--brand-orange)]/16 bg-[linear-gradient(180deg,rgba(53,33,16,0.96),rgba(24,16,12,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] transition hover:-translate-y-0.5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/16 bg-white/8">
                    <CreditCard className="h-4 w-4 text-[var(--brand-orange)]" />
                  </div>
                  <h3 className="mt-3 text-[1.1rem] font-black uppercase tracking-[-0.04em] text-white">Checkout</h3>
                  <p className="mt-2 text-sm leading-6 text-white/72">Submit checkout once and your return ride is covered.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[30px] border border-amber-100/45 bg-[linear-gradient(135deg,rgba(255,232,182,0.18)_0%,rgba(255,170,82,0.22)_28%,rgba(92,36,10,0.5)_58%,rgba(12,10,8,0.98)_100%)] px-6 py-6 shadow-[0_28px_90px_rgba(255,132,45,0.2)] sm:px-8 sm:py-7">
          <div className="absolute inset-y-0 left-0 w-2 bg-[linear-gradient(180deg,#fff0bf_0%,#ff9c40_100%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-black/32 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.26em] text-amber-50">
                <TicketPercent className="h-3.5 w-3.5" />
                April private ride promo
              </div>
              <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
                <span className="text-3xl font-black uppercase tracking-[-0.06em] text-white sm:text-4xl">$50 Off</span>
                <span className="pb-1 text-[11px] font-black uppercase tracking-[0.24em] text-[#ffe7b3] sm:text-xs">Private Transportation</span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/88 sm:text-base">
                {PRIVATE_TRANSPORT_PROMO.headline} Use code {" "}
                <span className="rounded-full bg-black/30 px-2 py-1 font-black tracking-[0.1em] text-[#ffe2a8]">
                  {PRIVATE_TRANSPORT_PROMO.code}
                </span>{" "}
                at checkout.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-[22px] border border-white/18 bg-black/30 px-5 py-3 text-center shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/60">Use Code</div>
                <div className="mt-1 text-base font-black uppercase tracking-[0.14em] text-white">{PRIVATE_TRANSPORT_PROMO.code}</div>
              </div>
              <Link
                href="/book/red-rocks-amphitheatre/private"
                className="brand-button-primary inline-flex min-h-14 px-8 text-sm font-black uppercase tracking-[0.16em]"
              >
                View Private Vehicles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-[linear-gradient(90deg,rgba(245,198,108,0.18),rgba(245,198,108,0.03),rgba(245,198,108,0.18))]" />

        <section className="grid gap-5 xl:grid-cols-2">
          {rideCards.map((ride) => (
            <article
              key={ride.title}
              className="overflow-hidden rounded-[32px] border border-[#f5c66c]/14 bg-[linear-gradient(180deg,rgba(19,17,15,0.98),rgba(10,10,10,0.98))] shadow-[0_30px_100px_rgba(0,0,0,0.48)] transition hover:-translate-y-0.5"
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
                  className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full border border-[#ffd6a3]/28 bg-[linear-gradient(180deg,#a95f28_0%,#8d4f20_100%)] px-8 text-sm font-black uppercase tracking-[0.16em] text-[#120f0b] shadow-[0_18px_42px_rgba(141,79,32,0.28)] transition hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,#b66c31_0%,#975321_100%)]"
                >
                  {ride.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <div className="h-px w-full bg-[linear-gradient(90deg,rgba(245,198,108,0.18),rgba(245,198,108,0.03),rgba(245,198,108,0.18))]" />

        <ReviewBlock />
      </section>

    </main>
  );
}
