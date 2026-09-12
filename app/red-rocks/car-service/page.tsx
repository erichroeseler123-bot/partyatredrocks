import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Clock, Users, CarFront, Sparkles, Award } from "lucide-react";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

const SITE = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "Red Rocks Car Service | Private Luxury SUV Transportation",
  description:
    "Book private car service to Red Rocks Amphitheatre. Luxury Suburban for up to 6 passengers for $399 flat round-trip. Door-to-door pickup, Top Circle access, vehicle waits all night.",
  alternates: {
    canonical: `${SITE}/red-rocks/car-service`,
  },
  openGraph: {
    title: "Red Rocks Car Service | Private Luxury SUV Transportation",
    description:
      "Private luxury SUV car service to Red Rocks: $399 flat round-trip for up to 6 passengers. Door-to-door pickup, driver waits on-site, guaranteed return ride.",
    url: `${SITE}/red-rocks/car-service`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Car Service | Private Luxury SUV Transportation",
    description:
      "Private luxury SUV car service to Red Rocks: $399 flat round-trip for up to 6 passengers. Door-to-door pickup, driver waits on-site, guaranteed return ride.",
  },
};

const FAQS = [
  {
    q: "How is this different from a shared shuttle or party bus?",
    a: "Our car service is 100% private to your party in a premium full-size SUV (Chevy Suburban or Yukon XL). There are no shared passengers, no rigid bus stops, and no crowded party bus atmosphere. You control the schedule, music, and pickup location.",
  },
  {
    q: "Does the car wait for us during the concert?",
    a: "Yes. Your dedicated chauffeur and vehicle remain parked in the designated commercial staging area on-site at Red Rocks for the entirety of the concert. As soon as you exit the venue, your car is waiting for you.",
  },
  {
    q: "Where do you pick up?",
    a: "We offer door-to-door pickup throughout the Denver Metropolitan area, including Downtown Denver, LoDo, Cherry Creek, RiNo, Highlands, Golden, Morrison, Lakewood, and Boulder.",
  },
  {
    q: "What drop-off access does your car service have at Red Rocks?",
    a: "With our commercial Colorado PUC licensing (LL-02649), our drivers have access to the Upper North Lot and Top Circle staging near Row 70, allowing you to walk into the venue near the top rather than tackling hundreds of stairs from lower parking lots.",
  },
  {
    q: "Is the $399 price per person or for the whole car?",
    a: "The $399 rate is a flat round-trip price for the entire vehicle (up to 6 passengers). It covers both your arrival trip and your return ride with zero surge pricing.",
  },
];

export default async function RedRocksCarServicePage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;

  const bookingHref = buildBookingHref({
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
        "@id": `${SITE}/red-rocks/car-service#service`,
        name: "Private Car Service to Red Rocks Amphitheatre",
        provider: {
          "@type": "LocalBusiness",
          name: "Party at Red Rocks",
          url: SITE,
          telephone: "+1-303-555-0199",
        },
        description:
          "Private luxury SUV car service to Red Rocks Amphitheatre from Denver and surrounding areas. $399 flat round-trip for up to 6 passengers.",
        offers: {
          "@type": "Offer",
          price: "399.00",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Red Rocks", item: `${SITE}/red-rocks` },
          { "@type": "ListItem", position: 3, name: "Car Service", item: `${SITE}/red-rocks/car-service` },
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(61,243,255,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,176,124,0.12),transparent_30%)]" />
          <div className="relative max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-[#3df3ff]/30 bg-[#3df3ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#3df3ff]">
              Private Luxury SUV Service
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-[3.75rem] lg:text-[4.5rem]">
              Private Car Service to Red Rocks Amphitheatre
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/80 sm:text-xl sm:leading-8">
              Experience Red Rocks in comfort without the chaos of rideshares or public buses. Our $399 private Suburban service gives your group dedicated door-to-door transportation, VIP limo-lane access, and a professional driver who stages on-site all evening.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={bookingHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-8 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff] shadow-lg shadow-[#3df3ff]/20"
              >
                Book Private Car Service — $399
              </Link>
              <Link
                href="/red-rocks/transportation"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Compare Ride Options
              </Link>
            </div>
          </div>
        </section>

        {/* CORE CAR SERVICE SPECS */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-[28px] border border-white/10 bg-[#0b1224] p-7 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3df3ff]/10 text-[#3df3ff] mb-4">
              <CarFront className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Private Luxury SUV</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Full-size Chevy Suburban or GMC Yukon XL with leather interior, climate control, and room for up to 6 passengers comfortably.
            </p>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-[#0b1224] p-7 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffb07c]/10 text-[#ffb07c] mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Limo-Lane Top Circle Access</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Commercial access lets you bypass general parking gridlock and arrive right at Upper North Lot / Row 70, saving your legs for dancing.
            </p>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-[#0b1224] p-7 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400 mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Driver Waits On-Site</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Your driver stays staged at the amphitheatre throughout the entire show. No waiting in the dark for an Uber that might cancel.
            </p>
          </article>
        </section>

        {/* PRICING & INCLUSIONS DETAIL */}
        <section className="mt-14 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,18,36,0.95),rgba(7,11,24,0.98))] p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#3df3ff]">Flat Rate Guarantee</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                $399 Flat Round-Trip
              </h2>
              <p className="mt-4 text-base text-white/75 leading-relaxed">
                Unlike rideshare apps that surge up to $250 each way or charge surge pricing after the encore, our private car service rate is locked in when you book.
              </p>

              <ul className="mt-6 space-y-3.5 text-sm text-white/85">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>Up to 6 passengers included (~$66/person for 6)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>Custom door-to-door pickup & return at your address</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>Complimentary bottle water and pregame-friendly cabin</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>Licensed under Colorado PUC LL-02649 & commercially insured</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>Full return trip guaranteed immediately after the encore</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href={bookingHref}
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#3df3ff] px-8 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff] shadow-lg shadow-[#3df3ff]/20"
                >
                  Book Private Suburban — $399
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/4 p-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Need Room for a Larger Group?</h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                If your party has 7 to 10 guests, upgrade to our private 10-passenger van for $599 flat round-trip. You get the same luxury door-to-door service and on-site staging with extra headroom and space for everyone.
              </p>
              <div className="mt-6">
                <Link
                  href="/book/red-rocks-amphitheatre/private/van"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/8 px-6 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/14"
                >
                  View 10-Passenger Van ($599) →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="mt-14 rounded-[32px] border border-white/10 bg-[#070b18] p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#ffb07c]">FAQ</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Red Rocks Car Service Questions
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

        {/* BOTTOM CTA */}
        <section className="mt-14 rounded-[34px] border border-[#3df3ff]/30 bg-[linear-gradient(180deg,rgba(61,243,255,0.18),rgba(20,40,70,0.4))] p-10 sm:p-14 text-center shadow-2xl">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Reserve Your Private Red Rocks Car Service
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-white/85 sm:text-lg">
            High-demand show dates sell out in advance. Lock in your $399 private Suburban with live availability.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href={bookingHref}
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#3df3ff] px-10 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff] shadow-lg shadow-[#3df3ff]/20"
            >
              Book Private Car Service — $399
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
