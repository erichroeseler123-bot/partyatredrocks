import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle, ShieldCheck, MapPin, Clock, Users, Bus, CarFront, AlertTriangle } from "lucide-react";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Red Rocks Group Transportation | Private Van & SUV Options",
  description:
    "Compare private Red Rocks group transportation: $599 private 10-passenger van or $399 Suburban. Door-to-door service, Top Circle access, and vehicle waits all night.",
  alternates: {
    canonical: `${SITE}/red-rocks/group-transportation`,
  },
  openGraph: {
    title: "Red Rocks Group Transportation | Private Van & SUV Options",
    description:
      "Private group transportation to Red Rocks: $599 private van (up to 10) or $399 Suburban (up to 6). Door-to-door pickup, vehicle waits on-site, guaranteed return ride.",
    url: `${SITE}/red-rocks/group-transportation`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Group Transportation | Private Van & SUV Options",
    description:
      "Private group transportation to Red Rocks: $599 private van (up to 10) or $399 Suburban (up to 6). Door-to-door pickup, vehicle waits on-site, guaranteed return ride.",
  },
};

const FAQS = [
  {
    q: "Do you offer traditional 30-to-40 passenger party buses?",
    a: "No. Party at Red Rocks specializes in private 10-passenger high-roof vans ($599) and 6-passenger luxury Suburbans ($399). We do not operate oversized buses because they are forced to park in distant lower lots requiring a steep 400-stair climb, and they often get trapped in 60-90 minute exit gridlock.",
  },
  {
    q: "Can our group bring alcohol on the private van?",
    a: "Yes. Our private vans and Suburbans are BYOB-friendly for adult passengers (21+). You are welcome to bring canned beverages, seltzers, and personal coolers for the drive and pre-show tailgate. No open glass bottles, please.",
  },
  {
    q: "How does group pickup work?",
    a: "We pick up your group at one designated door-to-door address (your hotel, home, or Airbnb). If your group needs a second nearby stop in the same neighborhood, coordinate with dispatch ahead of time.",
  },
  {
    q: "Does the van wait at Red Rocks while we are inside the show?",
    a: "Yes. Your vehicle and dedicated driver stay staged on-site at Red Rocks during the entire show. When the encore finishes, your vehicle is already parked and waiting to bring your entire crew home together.",
  },
  {
    q: "How does the price break down per person?",
    a: "Our private 10-passenger van is $599 flat round-trip, which works out to just $59.90 per person for a group of 10. Our private Suburban is $399 flat round-trip, or roughly $66 per person for a group of 6. Both options are far cheaper and less stressful than paying $150–$250 each way per rideshare car.",
  },
];

export default async function RedRocksGroupTransportationPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;

  const vanBookingHref = buildBookingHref({
    target: "private-option",
    venue: "red-rocks-amphitheatre",
    option: "van",
    searchParams: sp,
  });

  const suvBookingHref = buildBookingHref({
    target: "private-option",
    venue: "red-rocks-amphitheatre",
    option: "suv",
    searchParams: sp,
  });

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}/red-rocks/group-transportation#service`,
        name: "Red Rocks Group Transportation & Private Van Service",
        provider: {
          "@type": "LocalBusiness",
          name: "Party at Red Rocks",
          url: SITE,
          telephone: "+1-303-555-0199",
        },
        description:
          "Private group transportation to Red Rocks Amphitheatre with high-roof passenger vans and luxury Suburbans. $599 van (up to 10) or $399 Suburban (up to 6).",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "399.00",
          highPrice: "599.00",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
          { "@type": "ListItem", position: 3, name: "Group Transportation", item: `${SITE}/red-rocks/group-transportation` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-20 pt-24 text-white sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <div className="mx-auto max-w-[1280px]">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-12 lg:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,176,124,0.15),transparent_35%),radial-gradient(circle_at_top_right,rgba(61,243,255,0.12),transparent_30%)]" />
          <div className="relative max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-[#ffb07c]/30 bg-[#ffb07c]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              Group Transportation & Van Service
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-[3.75rem] lg:text-[4.5rem]">
              Red Rocks Group Transportation & Private Van Service
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/80 sm:text-xl sm:leading-8">
              Searching for a party bus or group ride to Red Rocks? Before renting an oversized 35-passenger bus, discover why smart concertgoers choose our private 10-passenger van ($599) and 6-passenger Suburban ($399) service for better parking, faster departures, and zero stress.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={vanBookingHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-8 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff] shadow-lg shadow-[#3df3ff]/20"
              >
                Book 10-Passenger Van — $599
              </Link>
              <Link
                href={suvBookingHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Book 6-Passenger SUV — $399
              </Link>
            </div>
          </div>
        </section>

        {/* TRUTHFUL COMPARISON: PRIVATE VAN VS TRADITIONAL PARTY BUS */}
        <section className="mt-12 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,18,36,0.95),rgba(7,11,24,0.98))] p-8 sm:p-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#ffb07c]">The Truth About Red Rocks Logistics</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Private Van vs. Traditional Party Bus
            </h2>
            <p className="mt-3 text-sm text-white/70 sm:text-base">
              Many groups assume a 30-passenger party bus is the best concert experience. Here is the reality of how oversized buses perform at Red Rocks vs. private high-roof vans.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* PRIVATE VAN ADVANTAGE */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-emerald-400">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
                Our Private Van ($599)
              </h3>
              <ul className="mt-6 space-y-4 text-sm text-white/85">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Upper North / Top Circle Access:</strong>
                    <p className="text-white/70 mt-0.5">Commercial van permits allow drop-off at Row 70. Walk right into the venue instead of hiking hundreds of stairs.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Instant Post-Show Departure:</strong>
                    <p className="text-white/70 mt-0.5">When your 10 friends are in the van, you pull out immediately. No waiting on 25 strangers to wander back to a bus.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">$599 Flat Total ($59.90/person):</strong>
                    <p className="text-white/70 mt-0.5">Affordable, transparent flat pricing for the entire evening. No fuel surcharges or surprise hourly overages.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Clean, High-Roof Comfort:</strong>
                    <p className="text-white/70 mt-0.5">Modern, forward-facing seating with individual seatbelts, strong air conditioning, and plenty of luggage/cooler space.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* TRADITIONAL PARTY BUS REALITY */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-rose-400">
                <AlertTriangle className="h-6 w-6 shrink-0 text-rose-400" />
                Traditional Party Bus Reality
              </h3>
              <ul className="mt-6 space-y-4 text-sm text-white/85">
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Forced into Lower South / Jurassic Lots:</strong>
                    <p className="text-white/70 mt-0.5">Full-sized party buses must park at the bottom of the mountain. Your group faces an exhausting 400-stair climb at 6,450 feet elevation.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">60–90 Minute Exit Gridlock:</strong>
                    <p className="text-white/70 mt-0.5">Bus exit lanes get trapped behind dozens of massive motor coaches while drivers struggle to round up missing drunk passengers.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">$1,500 – $2,500 Minimum Costs:</strong>
                    <p className="text-white/70 mt-0.5">Most party bus operators require 5-to-6 hour minimums, automatic 20% gratuity, and fuel fees that push totals past $2,000.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Perimeter Bench Seating & Wear:</strong>
                    <p className="text-white/70 mt-0.5">Many party buses are converted old school buses with worn interiors, finicky Bluetooth setups, and bumpy rides over mountain roads.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* GROUP VEHICLE CARDS */}
        <section className="mt-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#3df3ff]">Vehicle Selection</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Our Private Group Fleet
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* VAN */}
            <article className="rounded-[32px] border border-white/12 bg-[#0b1224] p-8 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-[#ffb07c]">Groups of 7 to 10</span>
                  <span className="rounded-full bg-[#ffb07c]/20 px-3 py-1 text-xs font-bold text-[#ffb07c]">Best Value</span>
                </div>
                <h3 className="mt-4 text-3xl font-black uppercase text-white">Private 10-Passenger Van</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">$599</span>
                  <span className="text-sm font-bold uppercase text-white/60">flat round-trip</span>
                </div>
                <p className="mt-4 text-sm text-white/75 leading-6">
                  Keep your entire group together in one spacious vehicle. High roof, dedicated air conditioning, luggage storage for jackets and coolers, and an on-site driver who waits through the show.
                </p>
                <div className="mt-6 space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-6">
                  <p>• <strong>Capacity:</strong> Up to 10 guests (~$59.90/person)</p>
                  <p>• <strong>Pickup:</strong> Door-to-door at your hotel, home, or rental</p>
                  <p>• <strong>Staging:</strong> Driver remains on-site all evening</p>
                  <p>• <strong>Drop-off:</strong> Upper North / Top Circle commercial access</p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href={vanBookingHref}
                  className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff] shadow-lg shadow-[#3df3ff]/20"
                >
                  Book Private Van — $599
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </article>

            {/* SUV */}
            <article className="rounded-[32px] border border-white/12 bg-[#0b1224] p-8 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-[#3df3ff]">Groups of 1 to 6</span>
                  <span className="rounded-full bg-[#3df3ff]/20 px-3 py-1 text-xs font-bold text-[#3df3ff]">Luxury SUV</span>
                </div>
                <h3 className="mt-4 text-3xl font-black uppercase text-white">Private Suburban</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">$399</span>
                  <span className="text-sm font-bold uppercase text-white/60">flat round-trip</span>
                </div>
                <p className="mt-4 text-sm text-white/75 leading-6">
                  Full-size luxury Suburban or Yukon XL. Premium leather seating, smooth mountain drive, and personalized door-to-door service with VIP limo lane drop-off.
                </p>
                <div className="mt-6 space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-6">
                  <p>• <strong>Capacity:</strong> Up to 6 guests (~$66/person)</p>
                  <p>• <strong>Pickup:</strong> Custom Denver metro address</p>
                  <p>• <strong>Staging:</strong> Driver remains on-site all evening</p>
                  <p>• <strong>Drop-off:</strong> Upper North / Top Circle commercial access</p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href={suvBookingHref}
                  className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-white px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-white/90 shadow-lg"
                >
                  Book Private Suburban — $399
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="mt-14 rounded-[32px] border border-white/10 bg-[#070b18] p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#ffb07c]">FAQ</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Group Transportation FAQs
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-white/10 bg-white/4 p-6 transition hover:border-[#3df3ff]/30"
              >
                <summary className="flex cursor-pointer items-center justify-between font-bold text-white text-base">
                  <span>{faq.q}</span>
                  <span className="text-[#3df3ff] transition-transform group-open:rotate-45 ml-4 text-xl leading-none">+</span>
                </summary>
                <p className="mt-4 text-sm text-white/75 leading-relaxed border-t border-white/10 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* BOTTOM FINAL CTA */}
        <section className="mt-14 rounded-[34px] border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(20,40,70,0.4))] p-10 sm:p-14 text-center shadow-2xl">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Book Your Group Transportation
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-white/85 sm:text-lg">
            Skip the rideshare surge and the party bus hassle. Secure your private van ($599) or Suburban ($399) today.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={vanBookingHref}
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#3df3ff] px-8 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff] shadow-lg shadow-[#3df3ff]/20"
            >
              Book 10-Passenger Van — $599
            </Link>
            <Link
              href={suvBookingHref}
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-white/90 shadow-lg"
            >
              Book 6-Passenger SUV — $399
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
