import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { assertUniqueGuideImages, getGuideCardImage } from "@/data/media";
import { type GuideVisualKey, guideVisuals } from "@/lib/guideVisuals";
import { buildPageIntentMetadata } from "@/lib/pageIntentMetadata";
import { PARR_2027_OPTION_B_PRICING_AUTHORITY, PARR_COMPLETE_TOTAL_DISCLOSURE } from "@/lib/pricing";

const SITE = "https://www.partyatredrocks.com";
const SUV = PARR_2027_OPTION_B_PRICING_AUTHORITY.suv;
const VAN = PARR_2027_OPTION_B_PRICING_AUTHORITY.van;
const GUIDE_HERO_IMAGE = getGuideCardImage("red-rocks-visiting-guide");

export const metadata: Metadata = {
  ...buildPageIntentMetadata("/guide"),
  title: "Red Rocks Show-Night Planning Guides | Tailgating, Pickups, Bags & Parking",
  description:
    `Local show-night planning guides for Red Rocks Amphitheatre: Upper North Lot tailgating, Denver & Golden pickup logistics, single-pocket bag rules, parking tradeoffs, and ${SUV.allInTotalFormatted}/${VAN.allInTotalFormatted} total private rides.`,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${SITE}/guide`,
  },
  openGraph: {
    title: "Red Rocks Show-Night Planning Guides | Party at Red Rocks",
    description:
      "Tailgating setup, Denver & Golden pickups, bag screening rules, parking lots, and post-encore exit strategy for Red Rocks concerts.",
    url: `${SITE}/guide`,
    type: "website",
    images: [
      {
        url: `${SITE}${GUIDE_HERO_IMAGE}`,
        alt: "Red Rocks show-night planning guide hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Show-Night Planning Guides | Party at Red Rocks",
    description:
      "Tailgating setup, Denver & Golden pickups, bag rules, parking lots, and post-show exit plans for Red Rocks.",
    images: [`${SITE}${GUIDE_HERO_IMAGE}`],
  },
};

type Card = {
  id: string;
  title: string;
  desc: string;
  href: string;
  kicker?: string;
  visual: GuideVisualKey;
};

const featured: Card[] = [
  {
    id: "transportation-guide",
    title: "Transportation Comparison",
    desc: `Private Suburban (${SUV.allInTotalFormatted} total: ${SUV.itemizedSummary}) and Private Van (${VAN.allInTotalFormatted} total: ${VAN.itemizedSummary}) vs. rideshare surges and self-driving.`,
    href: "/guide/transportation",
    kicker: "Transportation",
    visual: "transportation",
  },
  {
    id: "local-pickups",
    title: "Denver & Golden Pickups",
    desc: "How custom hotel, Airbnb, home, Downtown Denver, and Golden pickups work on concert night.",
    href: "/guide/local/denver-pickups",
    kicker: "Pickup Areas",
    visual: "pickup",
  },
  {
    id: "parking-reality",
    title: "Parking Lot Breakdown",
    desc: "Upper North vs. Upper South vs. Lower South lot fill times, stair climbs, and exit bottlenecks.",
    href: "/guide/parking",
    kicker: "Parking",
    visual: "parking",
  },
];

const deepDive: Card[] = [
  {
    id: "tailgating-guide",
    title: "Upper North Lot Tailgating",
    desc: "What to bring, Red Rocks lot rules (no glass or open flame), and how included chairs, cooler, speaker, and ice work.",
    href: "/guide/tailgating",
    kicker: "Tailgate",
    visual: "tailgating",
  },
  {
    id: "show-night-strategy",
    title: "Show-Night Timeline",
    desc: "Recommended 4:30 PM departure windows, optional beverage stops, doors timing, and post-encore meetup plans.",
    href: "/guide/show-night-strategy",
    kicker: "Timeline",
    visual: "pickup",
  },
  {
    id: "policies",
    title: "Bag Policy & Gate Rules",
    desc: "Single-pocket bag limits, clear food bags, hydration bladders, and storing extra layers in your waiting vehicle.",
    href: "/guide/logistics/bag-policy",
    kicker: "Venue Rules",
    visual: "policy",
  },
  {
    id: "event-guides",
    title: "What to Wear by Month",
    desc: "Spring snow squalls, summer twilight breezes, and October chill prep at 6,450 feet.",
    href: "/red-rocks/what-to-wear",
    kicker: "Packing",
    visual: "general",
  },
  {
    id: "red-rocks-week-calendar",
    title: "2027 Concert Calendar",
    desc: "Verified 2027 Red Rocks concert dates by month with prefilled private vehicle booking.",
    href: "/red-rocks/concerts",
    kicker: "2027 Schedule",
    visual: "parking",
  },
  {
    id: "all-guides",
    title: "All Planning Guides",
    desc: "Complete directory of Red Rocks parking, weather, safety, and Denver neighborhood pickup guides.",
    href: "/guide/all",
    kicker: "Directory",
    visual: "general",
  },
];

assertUniqueGuideImages();

function GuideCard({ card, imageSrc }: { card: Card; imageSrc: string }) {
  const visual = guideVisuals[card.visual];
  return (
    <Link
      href={card.href}
      className="brand-card rounded-[26px] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
    >
      <div className="relative mb-5 h-40 overflow-hidden rounded-[20px] border border-[var(--brand-border)]">
        <Image
          src={imageSrc}
          alt={`${card.title} — ${visual.imageAlt}`}
          fill
          unoptimized
          className="object-cover"
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.08),rgba(5,8,22,0.66)_100%)]" />
      </div>
      {card.kicker ? (
        <div className="brand-kicker text-[12px] font-black uppercase tracking-[0.22em]">
          {card.kicker}
        </div>
      ) : null}
      <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">{card.title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/75">{card.desc}</p>
      <div className="brand-link mt-5 inline-flex items-center text-sm font-bold">
        Read guide <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </Link>
  );
}

export default async function GuideHub() {
  const cards = [...featured, ...deepDive];
  const cardImageMap = Object.fromEntries(
    cards.map((card) => [card.id, getGuideCardImage(card.id)])
  ) as Record<string, string>;
  const heroImage = getGuideCardImage("red-rocks-visiting-guide");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Red Rocks Guides", item: `${SITE}/guide` },
    ],
  };

  return (
    <main className="brand-page bg-[#070b14] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1360px] flex-col gap-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <GuideVisualHero
          eyebrow="Show-Night Field Manual"
          title="Red Rocks Concert & Tailgating Guides"
          copy="Straightforward answers from Colorado concert drivers: when to depart Denver, how Upper North Lot tailgating works, what bags clear security, and how to skip the post-encore rideshare hike."
          imageSrc={heroImage}
          imageAlt="Red Rocks Amphitheatre concert night arrival and planning guide"
          actions={
            <>
              <Link href="/book/red-rocks-amphitheatre/private" className="btn-primary">
                Choose Private Vehicle ({SUV.allInTotalFormatted} / {VAN.allInTotalFormatted} Total)
              </Link>
              <Link href="/red-rocks/concerts" className="btn-ghost">
                2027 Concert Schedule
              </Link>
            </>
          }
        />

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <h2 className="text-2xl font-black uppercase tracking-[-0.02em] text-white sm:text-3xl">
            How a Smooth Red Rocks Night Comes Together
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
            Most show-night stress happens at two moments: arriving too late to park near the top ramp, and trying to summon a ride when 9,500 people leave after the encore. Plan these three steps first:
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Link
              href="/red-rocks/concerts"
              className="rounded-[24px] border border-white/12 bg-white/6 p-5 transition hover:bg-white/10 hover:no-underline"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Step 1 · Pick Your Show</div>
              <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.02em] text-white">
                Confirm Your 2027 Concert Date
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Check the verified 2027 Red Rocks concert calendar so your departure window matches doors and opener times.
              </p>
            </Link>
            <Link
              href="/guide/tailgating"
              className="rounded-[24px] border border-white/12 bg-white/6 p-5 transition hover:bg-white/10 hover:no-underline"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Step 2 · Plan Tailgate & Layers</div>
              <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.02em] text-white">
                Tailgate in Upper North Lot
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Private rides include chairs, cooler, Bluetooth speaker, and ice—plus locked storage for hoodies and rain shells during the show.
              </p>
            </Link>
            <Link
              href="/book/red-rocks-amphitheatre/private"
              className="rounded-[24px] border border-[#ffb07c]/35 bg-[#17120e] p-5 transition hover:border-[#ffb07c]/65 hover:no-underline"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb07c]">Step 3 · Lock Your Vehicle</div>
              <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.02em] text-white">
                Reserve Suburban ({SUV.allInTotalFormatted}) or Van ({VAN.allInTotalFormatted})
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/78">
                Upfront all-in vehicle total ({SUV.itemizedSummary} or {VAN.itemizedSummary}) covers door-to-door pickup, tailgating time, waiting driver, and the return ride home. {PARR_COMPLETE_TOTAL_DISCLOSURE}
              </p>
            </Link>
          </div>
        </section>

        <GuideLocalInfo variant="general" />

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <h2 className="text-xl font-black uppercase tracking-[0.12em] text-[#ffb07c]">
            Essential Show-Night Guides
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((card) => (
              <GuideCard key={card.href} card={card} imageSrc={cardImageMap[card.id]} />
            ))}
          </div>
        </section>

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <h2 className="text-xl font-black uppercase tracking-[0.12em] text-[#ffb07c]">
            Tailgating, Bag Rules & Packing Deep Dives
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deepDive.map((card) => (
              <GuideCard key={card.href} card={card} imageSrc={cardImageMap[card.id]} />
            ))}
          </div>
        </section>

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <h2 className="text-lg font-black uppercase tracking-[0.16em] text-[#ffb07c]">Official Venue & Road Resources</h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            Cross-check official venue gate notices and Colorado highway conditions on show day:
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              className="inline-flex min-h-11 items-center rounded-full border border-white/14 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/90 transition hover:bg-white/12"
              href="https://www.redrocksonline.com"
              target="_blank"
              rel="noreferrer"
            >
              RedRocksOnline.com (Official Venue)
            </a>
            <a
              className="inline-flex min-h-11 items-center rounded-full border border-white/14 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/90 transition hover:bg-white/12"
              href="https://www.cotrip.org"
              target="_blank"
              rel="noreferrer"
            >
              COtrip Road Conditions
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
