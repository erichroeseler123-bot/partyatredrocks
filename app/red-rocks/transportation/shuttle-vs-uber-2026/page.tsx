import type { Metadata } from "next";
import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";
import { PARR_VALUE_PROPOSITION, SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Red Rocks Private Transportation vs Uber (2026 Archive & 2027 Guide)",
  description:
    `2026 Red Rocks rideshare comparison archive and current 2027 private round-trip pricing ($${SUBURBAN_2027_USD} Private Suburban, $${VAN_2027_USD} Private Van) with Upper North Lot tailgating and a waiting driver.`,
  alternates: { canonical: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026` },
  openGraph: {
    title: "Red Rocks Private Transportation vs Uber (2026 Archive & 2027 Rates)",
    description:
      `Compare private Red Rocks transportation ($${SUBURBAN_2027_USD} Suburban / $${VAN_2027_USD} Van for 2027) with rideshare surge pricing and post-show pickup delays.`,
    url: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Private Transportation vs Uber (2026 Archive)",
    description:
      "Compare Party at Red Rocks private transportation with Uber and Lyft for a Red Rocks concert night.",
  },
};

export default async function Page({ searchParams }: { searchParams: Promise<HandoffSearchParams> }) {
  const sp = await searchParams;
  const bookingHref = buildBookingHref({
    target: "private",
    venue: "red-rocks-amphitheatre",
    searchParams: sp,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "Transportation", item: `${SITE}/red-rocks/transportation` },
      {
        "@type": "ListItem",
        position: 4,
        name: "Private Transportation vs Uber (2026 Archive)",
        item: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026`,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Red Rocks Private Transportation vs Uber in 2026",
    description:
      "Comparing fixed-price private Red Rocks transportation with rideshare surge pricing, post-show waits, and pickup uncertainty.",
    url: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026`,
    mainEntityOfPage: `${SITE}/red-rocks/transportation/shuttle-vs-uber-2026`,
    author: { "@type": "Organization", name: "Party at Red Rocks" },
    publisher: { "@id": `${SITE}/#organization` },
    about: [
      { "@type": "Place", name: "Red Rocks Amphitheatre", url: `${SITE}/venues/red-rocks-amphitheatre` },
      { "@type": "Service", name: "Private Red Rocks transportation", url: `${SITE}/book/red-rocks-amphitheatre/private` },
      { "@type": "Thing", name: "Rideshare surge pricing and post-show pickup at Red Rocks" },
    ],
  };

  return (
    <main className="min-h-screen bg-[#070b14] px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

        <nav className="text-sm text-white/60">
          <Link className="hover:text-white" href="/red-rocks/transportation">
            Transportation
          </Link>{" "}
          <span className="text-white/35">/</span> Private Ride vs Uber (2026 Archive)
        </nav>

        <aside
          aria-label="2026 historical pricing notice"
          className="mt-5 rounded-2xl border border-[#ffb07c]/35 bg-[#ffb07c]/10 p-4 text-sm leading-6 text-white/90 sm:p-5"
        >
          <span className="font-black uppercase tracking-[0.16em] text-[#ffb07c]">2026 Season Archive:</span>{" "}
          This guide preserves 2026 Red Rocks season reference analysis. Existing 2026 bookings, paid orders, and previously issued quotes remain unchanged at their original 2026 rates. For upcoming <strong>2027 Red Rocks concerts</strong>, public flat-rate vehicle pricing is{" "}
          <strong>${SUBURBAN_2027_USD} Private Suburban</strong> (up to 6 guests) and{" "}
          <strong>${VAN_2027_USD} Private Van</strong> (up to 10 guests), including Upper North Lot tailgating gear and a driver who waits through the show.
        </aside>

        <section className="mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,22,38,0.98),rgba(8,12,22,0.98))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-[#ffb07c]/30 bg-[#ffb07c]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            2026 Season Reference · Updated for 2027 Booking
          </div>
          <h1 className="mt-5 max-w-4xl text-[2.4rem] font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-[3.8rem]">
            Red Rocks Private Transportation vs. Uber (2026 Season Analysis)
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/80 sm:text-lg">
            The real difference shows up after the encore. Party at Red Rocks gives your group one private vehicle, Upper North Lot tailgating with chairs, cooler, speaker and ice, a driver waiting through the show, and a safe ride home.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white/90">
            <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2">
              2027 Private Suburban: ${SUBURBAN_2027_USD} flat
            </span>
            <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2">
              2027 Private Van: ${VAN_2027_USD} flat
            </span>
            <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2">
              Upper North Lot tailgate + waiting driver
            </span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={bookingHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff6b3d] px-6 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#ff7f56]"
            >
              Book 2027 Private Ride
            </Link>
            <Link
              href="/red-rocks/concerts"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/12"
            >
              2027 Red Rocks Concerts
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[30px] border border-white/10 bg-[#0d1424] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">After The Encore</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
              Your return plan is already waiting
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-white/78">
              A private vehicle that stays on-site through the concert removes the need to hike down to the Jurassic Lot, battle weak cell signal, or watch surge multipliers climb while thousands of fans exit at once.
            </p>
          </section>
          <section className="rounded-[30px] border border-white/10 bg-[#0d1424] p-6 sm:p-8">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">When Uber Makes Sense</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
              Solo riders with flexible timing
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-white/78">
              Rideshare can still work for solo concertgoers heading outbound early in the afternoon who do not mind walking to the Lower South rideshare queue or waiting out post-encore demand.
            </p>
          </section>
        </section>

        <section className="mt-8 rounded-[30px] border border-white/10 bg-[#0d1424] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Side-by-side</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Private vehicle vs. rideshare
          </h2>
          <div className="mt-6 overflow-x-auto rounded-[24px] border border-white/10">
            <table className="w-full border-collapse text-left text-sm text-white/85">
              <thead className="bg-white/6 text-[11px] uppercase tracking-[0.18em] text-[#ffb07c]">
                <tr>
                  <th className="px-4 py-4 font-black">Feature</th>
                  <th className="px-4 py-4 font-black">Party at Red Rocks (2027 Public Rates)</th>
                  <th className="px-4 py-4 font-black">Uber / Lyft</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10 bg-black/10 align-top">
                  <td className="px-4 py-4 font-black text-white">Round-trip price</td>
                  <td className="px-4 py-4">
                    ${SUBURBAN_2027_USD} Private Suburban (up to 6) or ${VAN_2027_USD} Private Van (up to 10) flat vehicle price
                  </td>
                  <td className="px-4 py-4">Varies by demand and often surges sharply after the encore</td>
                </tr>
                <tr className="border-t border-white/10 bg-black/10 align-top">
                  <td className="px-4 py-4 font-black text-white">Tailgating & gear</td>
                  <td className="px-4 py-4">{PARR_VALUE_PROPOSITION.tailgatingSummary}</td>
                  <td className="px-4 py-4">Drop-off only; nowhere to store coolers, chairs, or extra layers</td>
                </tr>
                <tr className="border-t border-white/10 bg-black/10 align-top">
                  <td className="px-4 py-4 font-black text-white">Post-show return</td>
                  <td className="px-4 py-4">Your dedicated driver and vehicle wait at Red Rocks through the show</td>
                  <td className="px-4 py-4">Hike to designated rideshare lot and request a driver in post-show traffic</td>
                </tr>
                <tr className="border-t border-white/10 bg-black/10 align-top">
                  <td className="px-4 py-4 font-black text-white">Group experience</td>
                  <td className="px-4 py-4">Everyone rides together from door-to-door pickup to final drop-off</td>
                  <td className="px-4 py-4">Groups over 4–5 often split into multiple cars</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-[30px] border border-white/10 bg-[#0d1424] p-6 sm:p-8">
          <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">Bottom Line</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
            Lock in your group&apos;s whole night before the show
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-white/78">
            For groups of 4 to 10 friends, one reserved vehicle turns parking, tailgating, and the post-encore exit into the easiest part of the night.
          </p>
          <div className="mt-6">
            <Link
              href={bookingHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff6b3d] px-6 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#ff7f56]"
            >
              Choose Your Private Vehicle
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
