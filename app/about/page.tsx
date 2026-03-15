import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Headphones, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "About Party at Red Rocks",
  description:
    "How Party at Red Rocks works, what kind of rides we offer, how booking works with Rezdy, and why groups use us for Red Rocks transportation.",
  alternates: {
    canonical: "/about",
  },
};

const trustCards = [
  {
    title: "Venue-First Booking",
    copy:
      "The main booking path now starts with venue, then ride type, then the exact product page. That keeps the flow clear instead of forcing everyone through one generic search tool.",
    icon: BadgeCheck,
  },
  {
    title: "Hosted Checkout",
    copy:
      "Shared shuttle seats and private ride options can be booked online through hosted Rezdy pages and widgets, which is the cleanest and safest checkout path right now.",
    icon: ShieldCheck,
  },
  {
    title: "Real Support Layer",
    copy:
      "The site is built around show-night execution: clear meetup plans, fixed pricing, professional drivers, and support that understands venue timing.",
    icon: Headphones,
  },
  {
    title: "Built for Show Nights",
    copy:
      "This is not a generic charter directory. The site connects venue pages, weekly lineups, planning guides, and booking paths so riders can move from research to checkout without losing context.",
    icon: Clock3,
  },
];

const rideTypes = [
  {
    title: "Shared Shuttle",
    copy:
      "Per-person seats for riders who want the fastest route to a direct online booking flow.",
    href: "/book/red-rocks-amphitheatre/shared",
    cta: "Browse Shared Shuttles",
  },
  {
    title: "Private Ride",
    copy:
      "SUV, van, and larger private options for groups that want one vehicle, one timeline, and one pickup plan.",
    href: "/book/red-rocks-amphitheatre/private",
    cta: "Browse Private Options",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,46,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Trust + How It Works
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              What This Site Actually Does
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Party at Red Rocks is a venue-first booking and planning site for concert transportation. The goal is simple:
              make it obvious where to start, what type of ride fits the night, and where the final checkout happens.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
              >
                Start Booking
              </Link>
              <Link
                href="/guide"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Open Guides
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            The Current Funnel
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
            Book shuttle, pick venue, choose ride type, then book online.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "1. Start at /book",
              "2. Pick the venue",
              "3. Choose shared or private",
              "4. Land on the final product page and book",
            ].map((step) => (
              <div
                key={step}
                className="rounded-[26px] border border-white/10 bg-[#0b1224] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
              >
                <div className="text-sm font-black uppercase tracking-[0.12em] text-white">{step}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-white/70">
            That flow is better than the older fragmented setup because it matches intent. People already know they want
            transportation. They should not have to reverse-engineer products before they pick the venue and ride type.
          </p>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,11,18,0.96),rgba(10,9,20,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Why It&apos;s Better
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                >
                  <Icon className="h-5 w-5 text-[#ffb07c]" />
                  <h3 className="mt-4 text-xl font-black uppercase tracking-[-0.03em] text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{card.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,24,0.98),rgba(6,9,18,0.98))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Ride Types
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {rideTypes.map((ride) => (
              <article
                key={ride.title}
                className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
              >
                <h3 className="text-2xl font-black uppercase tracking-[-0.03em] text-white">{ride.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{ride.copy}</p>
                <Link
                  href={ride.href}
                  className="mt-5 inline-flex items-center text-sm font-bold text-[#ffb07c]"
                >
                  {ride.cta}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Honest Status
          </div>
          <div className="mt-4 max-w-4xl space-y-4 text-sm leading-7 text-white/72">
            <p>
              The site is better than a generic shuttle landing page because it combines booking, venue context, weekly lineup
              visibility, and planning content in one system. That gives riders more context before they buy.
            </p>
            <p>
              It is not fully best-in-class yet because some older pages still send users into legacy utility flows like
              <code className="mx-1 rounded bg-white/8 px-1.5 py-0.5 text-white">/find</code> instead of the cleaner booking
              funnel. The new direction is correct, but the rest of the site still needs to be fully repointed into it.
            </p>
            <p>
              For now, the safest booking method is the hosted Rezdy widget and hosted checkout on the final product pages.
              That is more reliable than forcing an overly ambitious in-site checkout while the API path is still evolving.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
