import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle, ShieldCheck, MapPin, Clock, Users, CarFront, Bus } from "lucide-react";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Red Rocks Shuttle & Private Transportation from Denver",
  description:
    "Book private Red Rocks transportation for your group: $399 private Suburban (up to 6) or $599 private van (up to 10). Door-to-door pickup, vehicle waits through show, return ride included.",
  alternates: {
    canonical: `${SITE}/red-rocks/shuttle`,
  },
  openGraph: {
    title: "Red Rocks Shuttle & Private Transportation from Denver",
    description:
      "Private Red Rocks transportation: $399 Suburban (up to 6) or $599 van (up to 10). Door-to-door pickup, vehicle waits through show, guaranteed return ride.",
    url: `${SITE}/red-rocks/shuttle`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Shuttle & Private Transportation from Denver",
    description:
      "Private Red Rocks transportation: $399 Suburban (up to 6) or $599 van (up to 10). Door-to-door pickup, vehicle waits through show, guaranteed return ride.",
  },
};

const PICKUP_AREAS = [
  { name: "Downtown Denver & LoDo", detail: "Hotels, residences, Union Station area" },
  { name: "RiNo & Five Points", detail: "Breweries, hotels, custom addresses" },
  { name: "Cherry Creek & Cap Hill", detail: "Door-to-door residential & hotel pickup" },
  { name: "Highlands & Sloan's Lake", detail: "Northwest Denver neighborhood pickups" },
  { name: "Golden & Morrison", detail: "Foothills hotels, rentals, and local residences" },
  { name: "Lakewood & West Metro", detail: "Direct highway access to the amphitheatre" },
  { name: "Boulder & Front Range", detail: "Custom Front Range pickups available" },
  { name: "Denver Tech Center (DTC)", detail: "South metro corporate and hotel pickups" },
];

const FAQS = [
  {
    q: "Does the vehicle wait for our group during the concert?",
    a: "Yes. Your vehicle and driver remain staged on-site at Red Rocks throughout the entire concert. You do not need to hunt for a ride or summon an app when the music ends—your ride home is already there.",
  },
  {
    q: "What is the difference between this and a shared shuttle?",
    a: "Party at Red Rocks provides private transportation only. Your group has the entire vehicle to yourselves with custom door-to-door pickup and departure timing, rather than gathering at a fixed public bus stop with strangers.",
  },
  {
    q: "Are drinks allowed on board?",
    a: "Yes. Our private Suburbans and vans are BYOB-friendly for passengers of legal drinking age (21+). We ask that groups keep it respectful and avoid open glass containers.",
  },
  {
    q: "Where do you drop off and pick up at Red Rocks?",
    a: "Our commercial vehicles have access to Upper North / Top Circle staging near Row 70, saving your group from the exhausting 400-stair climb required from the public lower lots.",
  },
  {
    q: "What if the concert is delayed by weather?",
    a: "Red Rocks shows run rain or shine. Your driver remains staged on-site until the performance concludes or is officially called by the venue.",
  },
];

export default async function RedRocksShuttlePage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;

  const suvBookingHref = buildBookingHref({
    target: "private-option",
    venue: "red-rocks-amphitheatre",
    option: "suv",
    searchParams: sp,
  });

  const vanBookingHref = buildBookingHref({
    target: "private-option",
    venue: "red-rocks-amphitheatre",
    option: "van",
    searchParams: sp,
  });

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}/red-rocks/shuttle#service`,
        name: "Private Red Rocks Transportation & Shuttle Service",
        provider: {
          "@type": "LocalBusiness",
          name: "Party at Red Rocks",
          url: SITE,
          telephone: "+1-303-555-0199",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Denver",
            addressRegion: "CO",
            addressCountry: "US",
          },
        },
        areaServed: [
          "Denver, CO",
          "Golden, CO",
          "Morrison, CO",
          "Lakewood, CO",
          "Boulder, CO",
        ],
        description:
          "Private round-trip concert transportation to Red Rocks Amphitheatre from Denver and surrounding areas. $399 Suburban for up to 6 or $599 private van for up to 10.",
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
          { "@type": "ListItem", position: 3, name: "Shuttle & Private Transportation", item: `${SITE}/red-rocks/shuttle` },
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(61,243,255,0.15),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,91,46,0.12),transparent_30%)]" />
          <div className="relative max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-[#3df3ff]/30 bg-[#3df3ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#3df3ff]">
              Official Private Ride Service
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-[3.75rem] lg:text-[4.5rem]">
              Private Red Rocks Transportation for Your Group
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/80 sm:text-xl sm:leading-8">
              Skip the crowded bus stops, 400-stair hikes from lower parking lots, and $150+ post-concert Uber surges. Party at Red Rocks provides dedicated round-trip transportation with door-to-door pickup, Top Circle access, and a vehicle that waits on-site through the entire show.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#vehicles"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-8 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff] shadow-lg shadow-[#3df3ff]/20"
              >
                View Vehicle Options & Pricing
              </Link>
              <Link
                href="/red-rocks/transportation"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Transportation Guide
              </Link>
            </div>
          </div>
        </section>

        {/* VEHICLE PRICING & OPTIONS GRID - IMMEDIATELY VISIBLE */}
        <section id="vehicles" className="mt-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#ffb07c]">Transparent Flat Rates</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Choose Your Private Vehicle
            </h2>
            <p className="mt-3 text-sm text-white/70 sm:text-base">
              One flat price for your entire group. No per-person fees, no surprise fuel charges, and no surge pricing.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* CARD 1: PRIVATE SUBURBAN */}
            <article className="relative flex flex-col justify-between rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(11,18,36,0.95),rgba(7,11,24,0.98))] p-8 shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-[#3df3ff]/40">
              <div className="absolute top-6 right-6 inline-flex rounded-full bg-[#3df3ff]/15 border border-[#3df3ff]/30 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#3df3ff]">
                Best For 1-6 Guests
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffb07c]">
                  <CarFront className="h-4 w-4" />
                  Luxury SUV Option
                </div>
                <h3 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                  Private Suburban
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight text-white">$399</span>
                  <span className="text-sm font-bold uppercase tracking-wider text-white/60">flat round-trip</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/75">
                  Comfortable, leather-appointed full-size Chevy Suburban or GMC Yukon XL. Ideal for couples, families, and smaller groups who want private luxury service without having to drive.
                </p>

                <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 text-sm text-white/85">
                    <Users className="h-4 w-4 text-[#3df3ff] shrink-0" />
                    <span><strong>Passenger capacity:</strong> Up to 6 guests (~$66/person)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/85">
                    <MapPin className="h-4 w-4 text-[#3df3ff] shrink-0" />
                    <span><strong>Pickup:</strong> Door-to-door from your chosen Denver metro address</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/85">
                    <Clock className="h-4 w-4 text-[#3df3ff] shrink-0" />
                    <span><strong>Concert staging:</strong> Driver & vehicle wait on-site throughout the show</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/85">
                    <ShieldCheck className="h-4 w-4 text-[#3df3ff] shrink-0" />
                    <span><strong>Return ride:</strong> Included immediately after the final encore</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href={suvBookingHref}
                  className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff] shadow-lg shadow-[#3df3ff]/20"
                >
                  Book Private Suburban — $399
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <p className="mt-2 text-center text-xs text-white/50">Instant online booking • Live calendar</p>
              </div>
            </article>

            {/* CARD 2: PRIVATE 10-PASSENGER VAN */}
            <article className="relative flex flex-col justify-between rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(11,18,36,0.95),rgba(7,11,24,0.98))] p-8 shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-[#ffb07c]/40">
              <div className="absolute top-6 right-6 inline-flex rounded-full bg-[#ffb07c]/15 border border-[#ffb07c]/30 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#ffb07c]">
                Best For 7-10 Guests
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#3df3ff]">
                  <Bus className="h-4 w-4" />
                  Group Van Option
                </div>
                <h3 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                  Private Passenger Van
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight text-white">$599</span>
                  <span className="text-sm font-bold uppercase tracking-wider text-white/60">flat round-trip</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/75">
                  High-roof, spacious passenger van that keeps your entire crew together. Avoids the splitting of rideshares and costs less per person than public shuttle tickets.
                </p>

                <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 text-sm text-white/85">
                    <Users className="h-4 w-4 text-[#ffb07c] shrink-0" />
                    <span><strong>Passenger capacity:</strong> Up to 10 guests (under $60/person split 10 ways)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/85">
                    <MapPin className="h-4 w-4 text-[#ffb07c] shrink-0" />
                    <span><strong>Pickup:</strong> Custom door-to-door pickup & return</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/85">
                    <Clock className="h-4 w-4 text-[#ffb07c] shrink-0" />
                    <span><strong>Concert staging:</strong> Vehicle stays staged on-site all night</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/85">
                    <ShieldCheck className="h-4 w-4 text-[#ffb07c] shrink-0" />
                    <span><strong>Return ride:</strong> Full group travels home together without delay</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href={vanBookingHref}
                  className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-white px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-white/90 shadow-lg"
                >
                  Book Private Van — $599
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <p className="mt-2 text-center text-xs text-white/50">Instant online booking • Live calendar</p>
              </div>
            </article>
          </div>
        </section>

        {/* WHAT IS INCLUDED / WHAT IS NOT INCLUDED */}
        <section className="mt-14 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#3df3ff]">Service Clarity</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              What Is & Isn&apos;t Included
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Clear expectations before you book. No surprises on show night.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* INCLUDED */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-emerald-400">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
                What Is Included
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm text-white/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Round-trip private vehicle</strong> exclusively for your party (no strangers).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Door-to-door pickup & return</strong> at your hotel, home, or Airbnb.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Vehicle stages on-site:</strong> Driver waits through the entire show for your return ride.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Upper North / Top Circle drop-off access</strong> (closer to seats, avoiding lower lot stairs).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Commercial PUC licensed driver</strong> & commercial insurance protection (PUC LL-02649).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>BYOB-friendly cabin</strong> for adult passengers (21+) to pregame responsibly en route.</span>
                </li>
              </ul>
            </div>

            {/* NOT INCLUDED */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-rose-400">
                <XCircle className="h-6 w-6 shrink-0 text-rose-400" />
                What Is Not Included
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm text-white/80">
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Concert admission tickets:</strong> Tickets must be purchased separately through official venue ticketing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Driver gratuity:</strong> Cash or digital tip for great service is discretionary and appreciated.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Extra uncoordinated stops:</strong> Additional intermediate stops must be arranged in advance.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Per-person shared shuttle seating:</strong> Party at Red Rocks does not sell individual tickets on shared buses.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* PICKUP AREAS SERVED */}
        <section className="mt-14 rounded-[32px] border border-white/10 bg-[#090f20] p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#ffb07c]">Coverage Map</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Pickup Areas Served
            </h2>
            <p className="mt-3 text-sm text-white/70">
              We provide private door-to-door pickup across the Denver metropolitan area and Front Range foothills.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PICKUP_AREAS.map((area) => (
              <div
                key={area.name}
                className="rounded-2xl border border-white/8 bg-white/4 p-5 transition hover:border-[#3df3ff]/30 hover:bg-white/6"
              >
                <div className="flex items-center gap-2 text-[#3df3ff]">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <h3 className="font-bold text-white text-base">{area.name}</h3>
                </div>
                <p className="mt-2 text-xs text-white/65 leading-5">{area.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/50">
              Staying outside these primary zones? Custom pickup quotes are available for Colorado Springs, Fort Collins, and mountain towns upon request.
            </p>
          </div>
        </section>

        {/* COMPARISON WITH ALTERNATIVES */}
        <section className="mt-14 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#3df3ff]">Why Private Wins</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Private Ride vs. The Alternatives
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#070b18] p-6">
              <h3 className="text-lg font-black uppercase text-white">Party at Red Rocks</h3>
              <p className="mt-2 text-xs font-bold uppercase text-emerald-400">Private Suburban / Van</p>
              <ul className="mt-4 space-y-2.5 text-xs text-white/75 leading-relaxed">
                <li>• <strong>$399 / $599 flat rate:</strong> Never surges, no hidden fees.</li>
                <li>• <strong>Vehicle waits:</strong> 100% guaranteed ride home right at the end.</li>
                <li>• <strong>Door-to-door:</strong> Picked up at your front door, dropped back there.</li>
                <li>• <strong>Top Circle drop-off:</strong> Direct entrance access without hiking.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#070b18] p-6">
              <h3 className="text-lg font-black uppercase text-white">Rideshare (Uber/Lyft)</h3>
              <p className="mt-2 text-xs font-bold uppercase text-[#ffb07c]">Variable On-Demand</p>
              <ul className="mt-4 space-y-2.5 text-xs text-white/75 leading-relaxed">
                <li>• <strong>Heavy surges:</strong> $120–$250 each way during peak concert egress.</li>
                <li>• <strong>No guaranteed return:</strong> 60–90 minute waits in crowded pickup lots.</li>
                <li>• <strong>Remote pickup lot:</strong> Must walk down to Lower South or Jurassic lot.</li>
                <li>• <strong>Splitting groups:</strong> Often requires 2 or 3 cars for groups of 4+.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#070b18] p-6">
              <h3 className="text-lg font-black uppercase text-white">Self-Driving & Parking</h3>
              <p className="mt-2 text-xs font-bold uppercase text-white/60">Do-It-Yourself</p>
              <ul className="mt-4 space-y-2.5 text-xs text-white/75 leading-relaxed">
                <li>• <strong>Designated driver:</strong> Someone has to skip drinking and stay sober.</li>
                <li>• <strong>Traffic congestion:</strong> 45–75 minutes to exit parking lots post-show.</li>
                <li>• <strong>Stair challenge:</strong> 300–400 stairs at 6,450 ft elevation from lower lots.</li>
                <li>• <strong>Early arrival required:</strong> Lots fill 2.5 hours before doors open.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="mt-14 rounded-[32px] border border-white/10 bg-[#070b18] p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#ffb07c]">Got Questions?</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Red Rocks Shuttle FAQs
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
            Lock In Your Red Rocks Transportation
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-white/85 sm:text-lg">
            Dates sell out fast for high-demand concerts. Reserve your private Suburban ($399) or 10-passenger van ($599) today.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={suvBookingHref}
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#3df3ff] px-8 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff] shadow-lg shadow-[#3df3ff]/20"
            >
              Book Private Suburban — $399
            </Link>
            <Link
              href={vanBookingHref}
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-white/90 shadow-lg"
            >
              Book Private Van — $599
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
