import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CloudSun, ShieldCheck, Thermometer, Wind } from "lucide-react";
import { SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";

export const metadata: Metadata = {
  title: "What to Wear to a Red Rocks Concert | Seasonal Layering & Packing Guide",
  description:
    `Month-by-month Red Rocks Amphitheatre outfit and layering guide for 6,450-ft elevation swings: spring, summer, and fall packing lists, footwear, bag rules, and keeping extra layers in your private Suburban ($${SUBURBAN_2027_USD}) or Van ($${VAN_2027_USD}).`,
  alternates: { canonical: `${SITE}/red-rocks/what-to-wear` },
  openGraph: {
    title: "What to Wear to a Red Rocks Concert | 6,450-Ft Layering Guide",
    description:
      "How to dress for Red Rocks sunset temperature drops, canyon wind, stairs, and sudden rain—from April through October.",
    url: `${SITE}/red-rocks/what-to-wear`,
    type: "article",
    images: [
      {
        url: `${SITE}/images/redesign/red-rocks-sunset-sky.webp`,
        width: 1120,
        height: 630,
        alt: "Sunset sky over Red Rocks Amphitheatre above Denver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What to Wear to a Red Rocks Concert | Layering Guide",
    description:
      "Spring, summer, and fall packing checklists for Red Rocks concerts at 6,450 feet.",
    images: [`${SITE}/images/redesign/red-rocks-sunset-sky.webp`],
  },
};

const SEASON_CARDS = [
  {
    season: "Spring (Mar – May)",
    tempNote: "Daytime 55–70°F · Post-encore 32–45°F",
    items: [
      "Waterproof / windproof shell jacket (rain or spring snow squalls happen fast)",
      "Warm fleece or packable down mid-layer",
      "Long pants + moisture-wicking base shirt",
      "Closed-toe grippy sneakers or boots (wet sandstone steps get slick)",
      "Beanie and light gloves for the final set",
    ],
  },
  {
    season: "Summer (Jun – Aug)",
    tempNote: "Daytime 78–92°F · Post-encore 55–65°F",
    items: [
      "Breathable short-sleeve or sun shirt for golden-hour tailgating",
      "Light hoodie, flannel, or windbreaker for after 9:00 PM",
      "High-SPF sunscreen, sunglasses, and brimmed hat before dusk",
      "Broken-in walking sneakers (skip stilettos and slick flip-flops on stairs)",
      "Compact poncho in case of brief afternoon Front Range thunderheads",
    ],
  },
  {
    season: "Fall (Sep – Nov)",
    tempNote: "Daytime 50–72°F · Post-encore 28–48°F",
    items: [
      "Insulated puffy jacket or heavyweight fleece",
      "Thermal or long-sleeve base layer under your concert tee",
      "Windproof outer shell to block canyon gusts between the monoliths",
      "Beanie, pocket hand warmers, and closed-toe shoes with wool socks",
      "Backless stadium seat pad (under 18 inches wide) to insulate cold stone benches",
    ],
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "How much colder is Red Rocks than downtown Denver at night?",
    a: "Red Rocks sits at 6,450 feet in the Morrison foothills—roughly 1,200 feet higher than downtown Denver. Once the sun drops behind the rocks, temperatures routinely fall 20 to 30°F, and canyon breezes make the upper rows feel cooler still.",
  },
  {
    q: "Are umbrellas allowed inside Red Rocks Amphitheatre?",
    a: "No. Umbrellas block sightlines and are prohibited at Red Rocks security gates. Pack a hooded rain jacket or poncho instead.",
  },
  {
    q: "What shoes are best for a Red Rocks concert?",
    a: "Wear comfortable, closed-toe sneakers or flat boots with traction. Even from the Upper North Lot ramp, you will walk steep paved grades and wide stone amphitheatre steps.",
  },
  {
    q: "Where can we keep extra jackets and tailgate gear if we do not drive?",
    a: `When you book a Party at Red Rocks Private Suburban ($${SUBURBAN_2027_USD}) or Private Van ($${VAN_2027_USD}), your dedicated vehicle and driver stay parked at Red Rocks all night—so coolers, chairs, and backup heavy coats stay safely locked inside.`,
  },
] as const;

export default function RedRocksWhatToWearPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks Guide", item: `${SITE}/red-rocks` },
      { "@type": "ListItem", position: 3, name: "What to Wear", item: `${SITE}/red-rocks/what-to-wear` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What to Wear to a Red Rocks Concert: Seasonal Layering & Packing Guide",
    description:
      "Month-by-month layering, footwear, rain prep, and bag rules for concerts at Red Rocks Amphitheatre (6,450 ft).",
    url: `${SITE}/red-rocks/what-to-wear`,
    mainEntityOfPage: `${SITE}/red-rocks/what-to-wear`,
    author: { "@type": "Organization", name: "Party at Red Rocks" },
    publisher: { "@id": `${SITE}/#organization` },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="min-h-screen bg-[#070b14] px-4 pb-20 pt-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1080px]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <nav aria-label="Breadcrumb" className="mb-5 text-xs font-bold uppercase tracking-wider text-white/65">
          <Link href="/" className="no-underline hover:text-white">
            Home
          </Link>{" "}
          <span className="mx-1.5 text-white/35">/</span>
          <Link href="/red-rocks" className="no-underline hover:text-white">
            Red Rocks Guide
          </Link>{" "}
          <span className="mx-1.5 text-white/35">/</span>
          <span className="text-[#ffb07c]">What to Wear</span>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#0d1424] shadow-[0_32px_90px_rgba(0,0,0,0.48)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb07c]/35 bg-[#ffb07c]/12 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">
                <CloudSun className="h-3.5 w-3.5" />
                6,450-Ft Elevation Prep · Morrison, CO
              </div>
              <h1 className="mt-4 text-[2.2rem] font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-[3.2rem]">
                What to Wear to a Red Rocks Concert
              </h1>
              <p className="mt-4 text-base leading-7 text-white/82 sm:text-lg">
                High-altitude sun in the parking lot can turn into a 25°F canyon breeze by the encore. Use this practical two-layer system and seasonal checklist so you stay comfortable from tailgating through the final bow.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/book/red-rocks-amphitheatre/private"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff7a4d] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
                >
                  Book Private Ride (${SUBURBAN_2027_USD} / ${VAN_2027_USD})
                </Link>
                <Link
                  href="/red-rocks/weather"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 bg-white/8 px-5 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/14"
                >
                  Weather &amp; Rain Policy
                </Link>
              </div>
            </div>

            <div className="relative min-h-[240px] border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
              <img
                src="/images/redesign/red-rocks-sunset-sky.webp"
                alt="Evening sunset clouds over Red Rocks Amphitheatre and the Denver skyline"
                width={1120}
                height={630}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(13,20,36,0.85)_100%)] lg:hidden" />
            </div>
          </div>
        </section>

        {/* Core Two-Layer System (h2 -> h3 clean hierarchy!) */}
        <section className="mt-10 rounded-[28px] border border-white/10 bg-[#0d1424] p-6 sm:p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
            The 20–30°F Sunset Drop
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Red Rocks Layering Essentials
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/78 sm:text-base">
            Because umbrellas are banned inside the seating bowl and multi-pocket hiking backpacks get rejected at security, smart concertgoers build an easy two-part outfit they can tie around their waist or fit into a single-pocket tote:
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ffb07c]">
                <Thermometer className="h-4 w-4" /> Part 1 · Afternoon &amp; Tailgate
              </div>
              <h3 className="mt-2 text-xl font-black text-white">Base &amp; Mid Layer</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-white/82">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                  <span>Moisture-wicking tee or breathable long sleeve (cotton stays cold if damp)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                  <span>Light hoodie, crewneck, or flannel mid-layer for golden hour</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb07c]" />
                  <span>High-SPF sunscreen and sunglasses—UV intensity is ~25% stronger at 6,450 ft</span>
                </li>
              </ul>
            </article>

            <article className="rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-300">
                <Wind className="h-4 w-4" /> Part 2 · Headliner &amp; Encore
              </div>
              <h3 className="mt-2 text-xl font-black text-white">Outer Wind &amp; Rain Layer</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-white/82">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                  <span>Hooded waterproof / windproof shell jacket or packable rain poncho</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                  <span>Compressible puffy jacket or warm fleece on spring and fall dates</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                  <span>Beanie and light gloves when evening lows dip below 50°F</span>
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* Seasonal Packing List */}
        <section className="mt-10 rounded-[28px] border border-white/10 bg-[#0d1424] p-6 sm:p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
            Month-by-Month Checklist
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Seasonal Red Rocks Packing List
          </h2>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {SEASON_CARDS.map((card) => (
              <article key={card.season} className="flex flex-col rounded-2xl border border-white/10 bg-black/25 p-5">
                <h3 className="text-xl font-black text-white">{card.season}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#ffb07c]">{card.tempNote}</p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-white/80">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb07c]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Waiting Private Vehicle Advantage */}
        <section className="mt-10 rounded-[28px] border border-[#ffb07c]/30 bg-[linear-gradient(180deg,#161c30_0%,#0d1424_100%)] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
            <ShieldCheck className="h-4 w-4" />
            The Waiting Vehicle Advantage
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Why a Dedicated Private Vehicle Makes Packing 10x Easier
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/82 sm:text-base">
            When you take an Uber up to Morrison, everything you wear or carry has to pass Red Rocks&apos; single-pocket bag check—and after the encore, you&apos;re standing outside in the cold hiking down to the rideshare lot. With a Party at Red Rocks{" "}
            <strong className="text-white">Private Suburban (${SUBURBAN_2027_USD}, up to 6)</strong> or{" "}
            <strong className="text-white">Private Van (${VAN_2027_USD}, up to 10)</strong>, you tailgate in Upper North Lot with included chairs, cooler, speaker, and ice, stash extra coats or blankets safely inside the locked vehicle during the concert, and step straight into a heated cabin afterward.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/book/red-rocks-amphitheatre/private"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff7a4d] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
            >
              Compare Suburban &amp; Van Pricing →
            </Link>
            <Link
              href="/guide/logistics/bag-policy"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 bg-white/8 px-5 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/14"
            >
              Single-Pocket Bag Rules
            </Link>
            <Link
              href="/red-rocks/concerts"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 bg-white/8 px-5 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/14"
            >
              2027 Concert Schedule
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10 rounded-[28px] border border-white/10 bg-[#0d1424] p-6 sm:p-8">
          <h2 className="text-2xl font-black tracking-tight text-white">
            Frequently Asked Red Rocks Outfit &amp; Weather Questions
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {FAQ_ITEMS.map((item) => (
              <article key={item.q} className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <h3 className="text-base font-black text-white">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-white/78">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
