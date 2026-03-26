"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
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
        imageSrc: string;
        imageAlt: string;
      }
    | null;
};

export default function HomeSections({ heroSrc, shuttleSrc, sprinterSrc, urgency }: HomeSectionsProps) {
  const [selectedRide, setSelectedRide] = useState<"shared" | "private" | null>(null);
  const rideCards = [
    {
      id: "shared" as const,
      title: "Shared Tickets",
      subtitle: "$59 fixed per seat",
      copy: "Best for couples, solo riders, and smaller groups.",
      bullets: [
        "Denver + Golden departures",
        "Guaranteed return after the show",
      ],
      href: BOOK_RED_ROCKS,
      image: sprinterSrc,
      alt: "Shared shuttle option for Red Rocks transportation",
    },
    {
      id: "private" as const,
      title: "Private Car",
      subtitle: "$499 and up",
      copy: "Best for groups that want one vehicle and a premium night.",
      bullets: [
        "SUV, van, sprinter, and party bus options",
        "Private driver and one group plan all night",
      ],
      href: BOOK_RED_ROCKS,
      image: shuttleSrc,
      alt: "Private vehicle option for Red Rocks transportation",
    },
  ];

  return (
    <main className="brand-page bg-[radial-gradient(circle_at_top,rgba(255,91,46,0.15),transparent_26%),radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.14),transparent_18%),linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_100%)]">
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8">
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
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(10,18,56,0.88)_0%,rgba(10,18,56,0.56)_44%,rgba(9,9,9,0.9)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,97,255,0.42),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(76,97,255,0.12),transparent_18%)]" />
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

              <div className="brand-glass-bar mt-6 inline-flex max-w-3xl flex-col gap-3 rounded-[24px] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--brand-cyan)]">
                    <TicketPercent className="h-3.5 w-3.5" />
                    April private ride promo
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/86 sm:text-base">
                    <span className="font-black uppercase tracking-[0.04em] text-white">$50 off private transportation.</span>{" "}
                    Use code{" "}
                    <span className="rounded-full border border-white/14 bg-black/28 px-2 py-1 font-black tracking-[0.1em] text-[var(--brand-cyan)]">
                      {PRIVATE_TRANSPORT_PROMO.code}
                    </span>{" "}
                    at checkout.
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/14 bg-black/26 px-4 py-3 text-center shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/58">Use Code</div>
                  <div className="mt-1 text-base font-black uppercase tracking-[0.14em] text-white">{PRIVATE_TRANSPORT_PROMO.code}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={BOOK_RED_ROCKS}
                  className="brand-button-primary brand-button-pulse inline-flex min-h-14 px-8 text-sm font-black uppercase tracking-[0.16em]"
                >
                  Book Shared Seats
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/book/red-rocks-amphitheatre/private"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/14 bg-white/6 px-8 text-sm font-black uppercase tracking-[0.16em] text-white no-underline transition hover:bg-white/10"
                >
                  View Private Vehicles
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-[linear-gradient(90deg,rgba(245,198,108,0.18),rgba(245,198,108,0.03),rgba(245,198,108,0.18))]" />

        <section className="brand-glass-bar rounded-[32px] px-6 py-6 sm:px-8">
          <div className="max-w-3xl">
            <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.24em]">Step 1</div>
            <h2 className="mt-3 text-[2rem] font-black uppercase tracking-[-0.04em] text-white sm:text-[2.6rem]">
              Choose Shared Tickets or a Private Car
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/76">
              You need to choose one option to continue to prices and availability.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {rideCards.map((ride) => {
              const checked = selectedRide === ride.id;
              return (
                <button
                  key={ride.title}
                  type="button"
                  onClick={() => setSelectedRide(ride.id)}
                  className={[
                    "group relative flex gap-4 overflow-hidden rounded-[28px] border p-5 text-left transition",
                    checked
                      ? "border-[var(--brand-cyan)] bg-[linear-gradient(180deg,rgba(28,32,48,0.96),rgba(18,19,28,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.32)]"
                      : "border-white/10 bg-[linear-gradient(180deg,rgba(21,21,28,0.96),rgba(12,12,18,0.98))] hover:border-white/16",
                  ].join(" ")}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">
                          {ride.subtitle}
                        </div>
                        <h3 className="mt-2 text-[1.5rem] font-black uppercase tracking-[-0.04em] text-white">{ride.title}</h3>
                        <div
                          className={[
                            "mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] transition",
                            checked
                              ? "border-[var(--brand-cyan)]/40 bg-[var(--brand-cyan)]/12 text-[var(--brand-cyan)]"
                              : "border-white/12 bg-white/5 text-white/62",
                          ].join(" ")}
                        >
                          {checked ? "Selected" : "Tap To Choose"}
                        </div>
                      </div>
                      <div className="relative h-20 overflow-hidden rounded-[18px] border border-white/10 sm:w-32">
                        <Image
                          src={ride.image}
                          alt={ride.alt}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.12),rgba(9,9,9,0.58)_100%)]" />
                      </div>
                    </div>

                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/74">{ride.copy}</p>
                    <ul className="mt-4 space-y-2">
                      {ride.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-white/82">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-cyan)]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            {selectedRide ? (
              <Link
                href={rideCards.find((ride) => ride.id === selectedRide)?.href ?? BOOK_RED_ROCKS}
                className="brand-button-primary inline-flex min-h-14 px-8 text-sm font-black uppercase tracking-[0.16em]"
              >
                {selectedRide === "shared" ? "See Shared Prices" : "See Private Prices"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <div className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 bg-white/6 px-8 text-sm font-black uppercase tracking-[0.16em] text-white/52">
                Choose Shared or Private
              </div>
            )}
          </div>
        </section>

        <ReviewBlock />

        {urgency ? (
          <section className="brand-glass-bar overflow-hidden rounded-[24px] p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-white/10">
                <Image
                  src={urgency.imageSrc}
                  alt={urgency.imageAlt}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.08),rgba(9,9,9,0.52)_100%)]" />
              </div>
              <div>
                <div className="brand-kicker text-[10px] font-black uppercase tracking-[0.24em]">{urgency.label}</div>
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
