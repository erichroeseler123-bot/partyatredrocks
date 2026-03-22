import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import MusicWave from "@/components/MusicWave";
import { assertUniqueGuideImages, getGuideCardImage } from "@/data/media";
import { type GuideVisualKey, guideVisuals } from "@/lib/guideVisuals";
import { seatgeekEventsByVenueId } from "@/lib/seatgeek";
import { normalizeImageSrc } from "@/lib/media/proxyImage";

export const metadata = {
  title: "Red Rocks Guides",
  description:
    "Parking, transportation, venue policies, and show-night planning guides for Red Rocks.",
  alternates: {
    canonical: "/guide",
  },
};

const RED_ROCKS_SEATGEEK_VENUE_ID = 196;
const GUIDE_API_FALLBACKS = [
  "/assets/venue/red-rocks/red-rocks-hero.webp",
  "/assets/venue/red-rocks/red-rocks-arrival.webp",
  "/hero/hero-home.webp",
  "/hero/hero-guides.webp",
  "/images/marketing/shuttle.webp",
  "/images/marketing/vip-suv.webp",
  "/fleet/fleet-sprinter.webp",
  "/fleet/fleet-suburban.jpg",
  "/venues/rrsite.jpg",
  "/venues/missionsite.jpg",
  "/venues/fillsite.jpg",
] as const;

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
    id: "red-rocks-visiting-guide",
    title: "Red Rocks Visiting Guide",
    desc: "History, geology, trails, elevation, and visiting basics in one page.",
    href: "/guide/red-rocks-intelligence-hub",
    kicker: "Visit",
    visual: "general",
  },
  {
    id: "all-guides",
    title: "All Guides",
    desc: "Master index of every guide, sorted for fast scanning.",
    href: "/guide/all",
    kicker: "Index",
    visual: "general",
  },
  {
    id: "transportation-guide",
    title: "Transportation Guide",
    desc: "Shuttle vs rideshare, timing, and getting home after the show.",
    href: "/guide/transportation",
    kicker: "Transportation",
    visual: "transportation",
  },
  {
    id: "denver-concert-transportation",
    title: "Denver Concert Transportation",
    desc: "Concert transportation options across Denver venues.",
    href: "/guide/denver-concert-transportation",
    kicker: "Denver",
    visual: "transportation",
  },
  {
    id: "parking-reality",
    title: "Parking Reality",
    desc: "Lot choices, walking distance, and getting out after the show.",
    href: "/guide/parking",
    kicker: "Logistics",
    visual: "parking",
  },
  {
    id: "policies",
    title: "Policies",
    desc: "Bag rules, prohibited items, and gate-readiness checklist.",
    href: "/guide/policies",
    kicker: "Rules",
    visual: "policy",
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
    id: "local-pickups",
    title: "Local Pickups",
    desc: "Denver pickup zones and where groups stage best.",
    href: "/guide/local/denver-pickups",
    kicker: "Local",
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
];

assertUniqueGuideImages();

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

async function getGuideApiImagePool() {
  try {
    const events = await seatgeekEventsByVenueId(RED_ROCKS_SEATGEEK_VENUE_ID);
    const seen = new Set<string>();
    const images: string[] = [];

    for (const event of events) {
      for (const performer of event.performers || []) {
        if (!performer.image) continue;
        const normalized = normalizeImageSrc(performer.image);
        if (seen.has(normalized)) continue;
        seen.add(normalized);
        images.push(normalized);
      }
    }

    return images;
  } catch {
    return [];
  }
}

function resolveGuideImage(card: Card, apiImages: string[]) {
  if (apiImages.length) {
    return apiImages[hashString(card.id) % apiImages.length];
  }

  const registryImage = getGuideCardImage(card.id);
  if (registryImage && registryImage !== "/hero/hero-guides.webp") {
    return registryImage;
  }

  return GUIDE_API_FALLBACKS[hashString(card.id) % GUIDE_API_FALLBACKS.length];
}

function GuideCard({ card, imageSrc }: { card: Card; imageSrc: string }) {
  const visual = guideVisuals[card.visual];
  return (
    <Link
      href={card.href}
      className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
    >
      <div className="relative mb-5 h-40 overflow-hidden rounded-[20px] border border-white/10">
        <Image
          src={imageSrc}
          alt={visual.imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.08),rgba(5,8,22,0.66)_100%)]" />
      </div>
      {card.kicker ? (
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
          {card.kicker}
        </div>
      ) : null}
      <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">{card.title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/70">{card.desc}</p>
      <div className="mt-5 inline-flex items-center text-sm font-bold text-[#3df3ff]">
        Open guide <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </Link>
  );
}

export default async function GuideHub() {
  const cards = [...featured, ...deepDive];
  const apiImages = await getGuideApiImagePool();
  const cardImageMap = cards.reduce<Record<string, string>>((acc, card) => {
    acc[card.id] = resolveGuideImage(card, apiImages);
    return acc;
  }, {});

  return (
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <GuideVisualHero
          eyebrow={guideVisuals.general.eyebrow}
          title="Red Rocks Guides"
          copy="Parking, transportation, venue policies, show-night timing, and local planning context for Red Rocks nights."
          imageSrc={guideVisuals.general.imageSrc}
          imageAlt={guideVisuals.general.imageAlt}
          actions={
            <>
              <Link href="/book/red-rocks-amphitheatre" className="btn-primary">
                Start Booking
              </Link>
              <Link href="/week/red-rocks" className="btn-ghost">
                See This Week
              </Link>
            </>
          }
        />

        <div className="max-w-[280px] opacity-80">
          <MusicWave />
        </div>

        <GuideLocalInfo variant="general" />

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Featured Guides
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((card) => (
              <GuideCard key={card.href} card={card} imageSrc={cardImageMap[card.id]} />
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Deep Dives
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {deepDive.map((card) => (
              <GuideCard key={card.href} card={card} imageSrc={cardImageMap[card.id]} />
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,24,0.98),rgba(6,9,18,0.98))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Trusted Sources
          </div>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Validate venue and road conditions before every show-night decision.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
              href="https://www.redrocksonline.com"
              target="_blank"
              rel="noreferrer"
            >
              Venue Source
            </a>
            <a
              className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-black uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
              href="https://www.cotrip.org"
              target="_blank"
              rel="noreferrer"
            >
              COtrip
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
