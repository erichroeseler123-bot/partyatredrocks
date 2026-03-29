import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import MusicWave from "@/components/MusicWave";
import { assertUniqueGuideImages, getGuideCardImage } from "@/data/media";
import { type GuideVisualKey, guideVisuals } from "@/lib/guideVisuals";
import { buildPageIntentMetadata } from "@/lib/pageIntentMetadata";

const SITE = "https://www.partyatredrocks.com";
const GUIDE_HERO_IMAGE = getGuideCardImage("red-rocks-visiting-guide");

export const metadata = {
  ...buildPageIntentMetadata("/guide"),
  title: "Red Rocks Guides | Party at Red Rocks",
  description:
    "Parking, transportation, venue policies, and show-night planning guides for Red Rocks.",
  alternates: {
    canonical: `${SITE}/guide`,
  },
  openGraph: {
    title: "Red Rocks Guides | Party at Red Rocks",
    description:
      "Parking, transportation, venue policies, and show-night planning guides for Red Rocks.",
    url: `${SITE}/guide`,
    type: "website",
    images: [
      {
        url: `${SITE}${GUIDE_HERO_IMAGE}`,
        alt: "Red Rocks guide planning hero image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Guides | Party at Red Rocks",
    description:
      "Parking, transportation, venue policies, and show-night planning guides for Red Rocks.",
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
    title: "Transportation Guide",
    desc: "Shuttle vs rideshare, timing, and getting home after the show.",
    href: "/guide/transportation",
    kicker: "Transportation",
    visual: "transportation",
  },
  {
    id: "local-pickups",
    title: "Denver Pickup Locations",
    desc: "Where downtown riders board, how pickup works, and where to book.",
    href: "/guide/local/denver-pickups",
    kicker: "Pickup",
    visual: "pickup",
  },
  {
    id: "parking-reality",
    title: "Parking Reality",
    desc: "Lot choices, walking distance, and getting out after the show.",
    href: "/guide/parking",
    kicker: "Parking",
    visual: "parking",
  },
];

const deepDive: Card[] = [
  {
    id: "show-night-strategy",
    title: "Show-Night Strategy",
    desc: "Arrival timing, weather planning, and pickup timing.",
    href: "/guide/show-night-strategy",
    kicker: "Timing",
    visual: "pickup",
  },
  {
    id: "tailgating-guide",
    title: "Tailgating Guide",
    desc: "Arrival timing, lot expectations, and when private service is the better fit.",
    href: "/guide/tailgating",
    kicker: "Tailgate",
    visual: "tailgating",
  },
  {
    id: "policies",
    title: "Policies",
    desc: "Bag rules, prohibited items, and gate-readiness checklist.",
    href: "/guide/policies",
    kicker: "Rules",
    visual: "policy",
  },
  {
    id: "event-guides",
    title: "Event Guides",
    desc: "Artist-specific briefings with actionable logistics.",
    href: "/guide/events/2026-season-preview",
    kicker: "Events",
    visual: "general",
  },
  {
    id: "red-rocks-week-calendar",
    title: "Red Rocks Week Calendar",
    desc: "Live lineup view with direct booking links.",
    href: "/week/red-rocks",
    kicker: "Calendar",
    visual: "parking",
  },
  {
    id: "all-guides",
    title: "All Guides",
    desc: "Master index of every guide, sorted for fast scanning.",
    href: "/guide/all",
    kicker: "Index",
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
          alt={visual.imageAlt}
          fill
          unoptimized
          className="object-cover"
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.08),rgba(5,8,22,0.66)_100%)]" />
      </div>
      {card.kicker ? (
        <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">
          {card.kicker}
        </div>
      ) : null}
      <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">{card.title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/70">{card.desc}</p>
      <div className="brand-link mt-5 inline-flex items-center text-sm font-bold">
        Open guide <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </Link>
  );
}

export default async function GuideHub() {
  const cards = [...featured, ...deepDive];
  const cardImageMap = Object.fromEntries(cards.map((card) => [card.id, guideVisuals[card.visual].imageSrc])) as Record<string, string>;
  const heroImage = getGuideCardImage("red-rocks-visiting-guide");

  return (
    <main className="brand-page bg-[radial-gradient(circle_at_top,rgba(255,91,46,0.15),transparent_26%),radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.14),transparent_18%),linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_100%)] px-4 pb-14 pt-24 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <GuideVisualHero
          eyebrow={guideVisuals.general.eyebrow}
          title="Red Rocks Guides"
          copy="Use this hub to answer the question you actually have, then move directly into the next step instead of getting lost in generic content."
          imageSrc={heroImage}
          imageAlt="Red Rocks guide planning hero image"
          actions={
            <>
              <Link href="/book/red-rocks-amphitheatre" className="btn-primary">
                Start Booking
              </Link>
              <Link href="/red-rocks/transportation" className="btn-ghost">
                Transportation Guide
              </Link>
            </>
          }
        />

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <div className="text-[22px] font-black uppercase tracking-[0.18em] text-[var(--brand-cyan)] sm:text-[24px]">Pick the right next step</div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Link href="/red-rocks/transportation" className="rounded-[24px] border border-white/12 bg-white/6 p-5 transition hover:bg-white/10 hover:no-underline">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--brand-cyan)]">Understand</div>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">How do I get to Red Rocks?</h2>
              <p className="mt-3 text-sm leading-7 text-white/72">Start with the transportation guide if you need the strategy before you choose a ride.</p>
            </Link>
            <Link href="/week/red-rocks" className="rounded-[24px] border border-white/12 bg-white/6 p-5 transition hover:bg-white/10 hover:no-underline">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--brand-cyan)]">Compare</div>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">What shows are coming up?</h2>
              <p className="mt-3 text-sm leading-7 text-white/72">Use the Red Rocks week calendar if you want to line up the show first and book second.</p>
            </Link>
            <Link href="/book/red-rocks-amphitheatre/custom/shared" className="rounded-[24px] border border-[#62f6ff]/24 bg-[#09101f] p-5 transition hover:border-[#62f6ff]/48 hover:bg-[#0d1629] hover:no-underline">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#62f6ff]">Act</div>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">I just need to book transport</h2>
              <p className="mt-3 text-sm leading-7 text-white/72">Go straight to the shuttle booking flow if you already know you need the ride.</p>
            </Link>
          </div>
        </section>

        <section className="brand-panel rounded-[24px] p-4 sm:p-5">
          <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/84">
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Secure Booking</div>
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">720-369-6292</div>
            <div className="rounded-full border border-white/16 bg-white/6 px-4 py-2">Guaranteed Return Ride</div>
          </div>
        </section>

        <div className="max-w-[280px] opacity-80">
          <MusicWave />
        </div>

        <GuideLocalInfo variant="general" />

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <div className="text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">Core Guides</div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((card) => (
              <GuideCard key={card.href} card={card} imageSrc={cardImageMap[card.id]} />
            ))}
          </div>
        </section>

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <div className="text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">Deeper Planning</div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deepDive.map((card) => (
              <GuideCard key={card.href} card={card} imageSrc={cardImageMap[card.id]} />
            ))}
          </div>
        </section>

        <section className="brand-panel rounded-[30px] p-6 sm:p-8">
          <div className="text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em] text-[var(--brand-cyan)]">Trusted Sources</div>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Validate venue and road conditions before every show-night decision.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10" href="https://www.redrocksonline.com" target="_blank" rel="noreferrer">
              Venue Source
            </a>
            <a className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10" href="https://www.cotrip.org" target="_blank" rel="noreferrer">
              COtrip
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
