import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";
import MusicWave from "@/components/MusicWave";

export const metadata = {
  title: "Red Rocks Guides",
  description:
    "Transportation strategy, parking reality, venue policies, and show-night execution plans for Red Rocks.",
  alternates: {
    canonical: "/guide",
  },
};

type Card = {
  title: string;
  desc: string;
  href: string;
  kicker?: string;
};

const featured: Card[] = [
  {
    title: "Red Rocks Intelligence Hub",
    desc: "History, geology, trails, elevation, and visiting facts in one authority page.",
    href: "/guide/red-rocks-intelligence-hub",
    kicker: "Hub",
  },
  {
    title: "All Guides",
    desc: "Master index of every guide, sorted for fast scanning.",
    href: "/guide/all",
    kicker: "Index",
  },
  {
    title: "Transportation Hub",
    desc: "Shuttle vs rideshare, surge risks, and post-show extraction.",
    href: "/guide/transportation",
    kicker: "Core",
  },
  {
    title: "Denver Concert Transportation",
    desc: "Broad non-Red-Rocks hub connecting major venues, ride types, and booking flow.",
    href: "/guide/denver-concert-transportation",
    kicker: "Hub",
  },
  {
    title: "Parking Reality",
    desc: "Lot strategy, walking costs, and exit flow tradeoffs.",
    href: "/guide/parking",
    kicker: "Logistics",
  },
  {
    title: "Policies",
    desc: "Bag rules, prohibited items, and gate-readiness checklist.",
    href: "/guide/policies",
    kicker: "Rules",
  },
];

const deepDive: Card[] = [
  {
    title: "Show-Night Strategy",
    desc: "Arrival timing, weather pivots, and meetup discipline.",
    href: "/guide/show-night-strategy",
    kicker: "Playbook",
  },
  {
    title: "Local Pickups",
    desc: "Denver pickup zones and where groups stage best.",
    href: "/guide/local/denver-pickups",
    kicker: "Local",
  },
  {
    title: "Event Guides",
    desc: "Artist-specific briefings with actionable logistics.",
    href: "/guide/events/2026-season-preview",
    kicker: "Events",
  },
  {
    title: "Red Rocks Week Calendar",
    desc: "Live lineup view with direct booking links.",
    href: "/week/red-rocks",
    kicker: "Calendar",
  },
];

function GuideCard({ card }: { card: Card }) {
  return (
    <Link
      href={card.href}
      className="rounded-[26px] border border-white/10 bg-[#0b1224] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
    >
      {card.kicker ? (
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
          {card.kicker}
        </div>
      ) : null}
      <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">{card.title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/70">{card.desc}</p>
      <div className="mt-5 inline-flex items-center text-sm font-bold text-[#ffb07c]">
        Open guide <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </Link>
  );
}

export default function GuideHub() {
  return (
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,11,18,0.96),rgba(10,9,20,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,176,124,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.12),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
              <Ticket className="h-3.5 w-3.5" />
              Authority Section
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Red Rocks Guide Command
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Deep local intelligence for transportation, venue tactics, weather pivots, and better show-night execution.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/find"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff7148]"
              >
                Book Ride Now
              </Link>
              <Link
                href="/week/red-rocks"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                Open Live Calendar
              </Link>
            </div>
            <div className="mt-6 max-w-[280px] opacity-80">
              <MusicWave />
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,26,0.96),rgba(6,9,18,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Featured Guides
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((card) => (
              <GuideCard key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,15,31,0.96),rgba(7,11,25,0.96))] p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Deep Dives
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {deepDive.map((card) => (
              <GuideCard key={card.href} card={card} />
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
