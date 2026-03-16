"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  Headphones,
  ShieldCheck,
  Sparkles,
  Clock3,
} from "lucide-react";
import { DISPLAY } from "@/lib/display";
import { ReviewBlock } from "@/components/ReviewBlock";
import { buildBookingHref } from "@/lib/parrHandoff";

const rideOptions = [
  {
    title: "Shared Shuttle",
    body: "Shared shuttle seats are available from Denver and Golden. Choose your departure location and reserve seats for the show.",
    bullets: [
      "$59 seats from Denver and Golden",
      "Clear departure times and return ride after the show",
      "Best fit for solo riders, couples, and small groups",
    ],
    href: buildBookingHref({ target: "shared", venue: "red-rocks-amphitheatre" }),
    cta: "View Shuttle Departures",
    icon: DollarSign,
  },
  {
    title: "Private Door-to-Door Service",
    body: "Door-to-door pickup. Upper North limo-lane access. The full Red Rocks night.",
    bullets: [
      "Pickup at your home, hotel, or Airbnb",
      "Time to tailgate before the show",
      "One vehicle for the full night and return ride after the concert",
      "Private SUV — $499",
      "10 Passenger Van — $599",
      "14 Passenger Sprinter — $799",
      "24 Passenger Party Bus — $1199",
    ],
    href: buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre" }),
    cta: "Book Private Service",
    icon: ShieldCheck,
  },
];

const supportPoints = [
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
    title: "Real-Time Support",
    body: "Text or call anytime and get help from people who know the flow.",
    icon: Headphones,
  },
  {
    title: "Group-Friendly Options",
    body: "Shared seats for most riders, private vehicles for groups that want one plan all night.",
    icon: ShieldCheck,
  },
];

export default function HomeSections() {
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
                Red Rocks Shuttle & Private Rides
              </h1>

              <p className="mt-5 text-[15px] leading-7 text-white/78 sm:text-lg">
                Shared shuttles from Denver and Golden, or private door-to-door service to Red Rocks Amphitheatre.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/book"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb07c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1020]"
                >
                  Start Booking
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  "$59 seats",
                  "Denver + Golden",
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
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">Ride Options</div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Choose the ride that fits your night.
              </h2>
            </div>
            <Link href="/about" className="hidden text-sm font-bold text-[#8fd0ff] md:inline-flex">
              About GoSno <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {rideOptions.map((ride) => {
              const Icon = ride.icon;
              return (
                <div
                  key={ride.title}
                  className="rounded-[24px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                >
                  <div className="inline-flex rounded-2xl border border-[#ff8a3d]/25 bg-[#ff8a3d]/10 p-3 text-[#ffb07c]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-lg font-black text-white">{ride.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/68">{ride.body}</p>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-white/76">
                    {ride.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb07c]/80" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={ride.href} className="mt-5 inline-flex items-center text-sm font-bold text-[#ffb07c]">
                    {ride.cta}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {supportPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="rounded-[24px] border border-white/10 bg-[#09101f] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]"
                >
                  <div className="inline-flex rounded-2xl border border-[#8fd0ff]/20 bg-[#8fd0ff]/10 p-3 text-[#8fd0ff]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-base font-black text-white">{point.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/68">{point.body}</p>
                </div>
              );
            })}
          </div>

          <Link href="/about" className="mt-5 inline-flex text-sm font-bold text-[#8fd0ff] md:hidden">
            About GoSno <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </section>

        <ReviewBlock />

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
                Operated by GoSno LLC with secure online booking, real support, and clear ride options before show night.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Colorado-Based Operator",
                    body: "Local transportation for Red Rocks and Colorado concert nights.",
                  },
                  {
                    title: "Secure Online Booking",
                    body: "Book online, get your details, and head into show night with a clear plan.",
                  },
                  {
                    title: "Support + Policies",
                    body: "Read the details, then book with the right expectations before the show.",
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
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
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
