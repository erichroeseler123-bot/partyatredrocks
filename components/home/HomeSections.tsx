"use client";

import Link from "next/link";
import {
  ShieldCheck,
  TicketPercent,
} from "lucide-react";
import { ReviewBlock } from "@/components/ReviewBlock";
import { PRIVATE_TRANSPORT_PROMO } from "@/lib/privateTransportPromo";
import { buildDccRedRocksBookingHref } from "@/lib/parrHandoff";

const BOOK_SHARED_RED_ROCKS = buildDccRedRocksBookingHref();

type HomeSectionsProps = {
  heroSrc: string;
  shuttleSrc: string;
  sprinterSrc: string;
  urgency:
    | {
        label: string;
        detail: string;
        imageSrc: string;
        imageAlt: string;
      }
    | null;
};

export default function HomeSections({ heroSrc, shuttleSrc, sprinterSrc, urgency }: HomeSectionsProps) {
  const rideCards = [
    {
      title: "Private Suburban",
      subtitle: "$499 Suburban (up to 6)",
      copy: "Most popular for groups",
      bullets: [
        "Tailgating + your car waits in the same spot during the show",
        "Door-to-door with liquor/grocery stop",
      ],
      href: "/book/red-rocks-amphitheatre/private",
      cta: "Book Private Suburban - $499",
      image: sprinterSrc,
      alt: "Approved Suburban SUV image for Red Rocks private transportation",
      accent: "orange" as const,
    },
    {
      title: "Shuttle Tickets",
      subtitle: "$59 fixed per seat",
      copy: "Pickup locations",
      bullets: [
        "Denver",
        "Golden",
      ],
      href: "/book/red-rocks-amphitheatre",
      cta: "Book $59 Shuttle Tickets",
      image: shuttleSrc,
      alt: "Approved Sprinter shuttle image for Red Rocks transportation",
      accent: "cyan" as const,
    },
  ];

  return (
    <main className="brand-page bg-[radial-gradient(circle_at_top,rgba(255,91,46,0.15),transparent_26%),radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.14),transparent_18%),linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_100%)]">
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-[var(--brand-orange)]/20 bg-[var(--brand-bg-dark)] shadow-[0_40px_120px_rgba(0,0,0,0.58)]">
          <div className="absolute inset-0">
            <img
              src={heroSrc}
              alt="Nighttime Red Rocks crowd and venue lights"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.18)_0%,rgba(7,10,18,0.54)_42%,rgba(7,10,18,0.84)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(10,18,56,0.46)_0%,rgba(10,18,56,0.2)_44%,rgba(9,9,9,0.42)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,97,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(76,97,255,0.03),transparent_18%)]" />
          </div>

          <div className="relative px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/72 sm:text-[12px]">
                Red Rocks Transportation
              </p>
              <h1 className="mt-4 text-[2.7rem] font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[4.3rem] lg:text-[5.6rem]">
                How do you want to get to Red Rocks?
              </h1>
              <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-white/82 sm:text-lg">
                $59 shared seats or a $499 private Suburban for up to 6 with tailgating, limo-lane access, door-to-door service, and the vehicle waiting in the same spot during the show.
              </p>
              <p className="mx-auto mt-3 max-w-3xl text-sm font-semibold uppercase tracking-[0.14em] text-white/72 sm:text-[13px]">
                No waiting for Uber. No surge pricing. No chaos after the show.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {rideCards.map((ride) => {
                const isShared = ride.accent === "cyan";
                return (
                  <Link
                    key={ride.title}
                    href={ride.href}
                    className={`group relative overflow-hidden rounded-[30px] border p-6 text-left no-underline shadow-[0_24px_80px_rgba(0,0,0,0.36)] transition hover:-translate-y-1 ${isShared ? "border-cyan-300/22 bg-[linear-gradient(180deg,rgba(8,20,34,0.98),rgba(5,12,22,0.98))] hover:border-cyan-200/44" : "border-[#ff8f5a]/26 bg-[linear-gradient(180deg,rgba(28,13,10,0.98),rgba(16,9,8,0.98))] hover:border-[#ff9d72]/52 lg:-mt-3 lg:mb-3 lg:p-7"}`}
                  >
                    <div className="absolute right-4 top-4 h-20 w-28 overflow-hidden rounded-[18px] border border-white/10 opacity-85 sm:h-24 sm:w-36">
                      <img
                        src={ride.image}
                        alt={ride.alt}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.05),rgba(9,9,9,0.3)_100%)]" />
                    </div>

                    <div className="pr-24 sm:pr-40">
                      {!isShared ? (
                        <div className="inline-flex rounded-full border border-[#ffb07c]/30 bg-[#ffb07c]/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffcfad]">
                          {ride.copy}
                        </div>
                      ) : null}
                      <h2 className="text-[1.8rem] font-black uppercase tracking-[-0.05em] text-white sm:text-[2.2rem]">
                        {ride.title}
                      </h2>
                      <div className="mt-3 text-[1.9rem] font-black tracking-[-0.04em] text-white sm:text-[2.6rem]">
                        {ride.subtitle}
                      </div>
                      {isShared ? (
                        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/68">
                          {ride.copy}
                        </p>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-white/76">
                          No Uber chaos. No surge pricing. No post-show scramble.
                        </p>
                      )}
                    </div>

                    {isShared ? (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {ride.bullets.map((bullet) => (
                          <span
                            key={bullet}
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-black uppercase tracking-[0.16em] text-white/86"
                          >
                            {bullet}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <ul className="mt-6 space-y-2">
                        {ride.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-white/82">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div
                      className={`mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full px-6 text-sm font-black uppercase tracking-[0.16em] transition sm:w-auto ${isShared ? "bg-[#3df3ff] text-[#07111d] group-hover:bg-[#62f6ff]" : "bg-[#ff6b3d] text-[#1b0b05] group-hover:bg-[#ff845d]"}`}
                    >
                      {ride.cta} →
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="brand-glass-bar rounded-[24px] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--brand-cyan)]">
                <TicketPercent className="h-3.5 w-3.5" />
                Private ride promo
              </div>
              <p className="mt-2 text-sm leading-6 text-white/82 sm:text-base">
                <span className="font-black uppercase tracking-[0.04em] text-white">April service dates get $50 off private transportation.</span>{" "}
                Use code{" "}
                <span className="rounded-full border border-white/14 bg-black/28 px-2 py-1 font-black tracking-[0.1em] text-[var(--brand-cyan)]">
                  {PRIVATE_TRANSPORT_PROMO.code}
                </span>{" "}
                for rides in April.
              </p>
            </div>
            <Link
              href="/book/red-rocks-amphitheatre/private"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/6 px-5 text-xs font-black uppercase tracking-[0.16em] text-white no-underline transition hover:bg-white/10"
            >
              View Private Vehicles
            </Link>
          </div>
        </section>

        <ReviewBlock />

        {urgency ? (
          <section className="brand-glass-bar overflow-hidden rounded-[24px] p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-white/10">
                <img
                  src={urgency.imageSrc}
                  alt={urgency.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.01),rgba(9,9,9,0.12)_100%)]" />
              </div>
              <div>
                <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.24em]">{urgency.label}</div>
                <p className="mt-1 text-sm leading-6 text-white/82">{urgency.detail}</p>
              </div>
              <Link href="/week/red-rocks" className="brand-link inline-flex items-center text-sm font-black uppercase tracking-[0.16em] no-underline">
                View lineup
              </Link>
            </div>
          </section>
        ) : null}
      </section>

    </main>
  );
}
