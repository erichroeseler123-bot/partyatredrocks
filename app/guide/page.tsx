import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Red Rocks Guides",
  description:
    "Authority-only logistics guides for Red Rocks: transportation, parking, bag policy, and show-night strategy.",
};

type Card = {
  title: string;
  desc: string;
  href: string;
  kicker?: string;
};

const featured: Card[] = [
  {
    title: "All Guides (Index)",
    desc: "Master list of every authority page. Add pages and they auto-appear.",
    href: "/guide/all",
    kicker: "Start here",
  },
  {
    title: "Red Rocks Transportation",
    desc: "Shuttle vs rideshare, parking reality, and post-show pickup strategy.",
    href: "/red-rocks/transportation",
    kicker: "Core hub",
  },
  {
    title: "Parking Lots",
    desc: "Where to park, what fills first, and how to avoid the long climb.",
    href: "/guide/logistics/parking-lots",
    kicker: "Logistics",
  },
  {
    title: "Bag Policy",
    desc: "The practical version: what gets you turned away and what actually works.",
    href: "/guide/logistics/bag-policy",
    kicker: "Rules",
  },
  {
    title: "Sold-Out Survival",
    desc: "Avoid surge hell, leave smart, and don’t get stranded after the encore.",
    href: "/guide/logistics/sold-out-survival",
    kicker: "Strategy",
  },
  {
    title: "Example Event Guide",
    desc: "Show-night flow, arrival windows, and pickup timing for a specific event.",
    href: "/guide/events/zac-brown-band",
    kicker: "Events",
  },
];

const categories: Card[] = [
  {
    title: "Logistics",
    desc: "Rules, entry, weather, prohibited items, and survival guides.",
    href: "/guide/logistics",
    kicker: "Category",
  },
  {
    title: "Events",
    desc: "Show-night plans, arrival windows, and pickup timing by event.",
    href: "/guide/events",
    kicker: "Category",
  },
  {
    title: "Local",
    desc: "Denver pickups, nearby venues, and pre/post show flow.",
    href: "/guide/local",
    kicker: "Category",
  },
  {
    title: "Safety",
    desc: "Legitimacy, scams, smart choices, and risk reduction.",
    href: "/guide/safety",
    kicker: "Category",
  },
  {
    title: "Updates",
    desc: "Policy changes, season notes, and what’s new.",
    href: "/guide/updates",
    kicker: "Category",
  },
  {
    title: "Compare",
    desc: "Shuttle vs Uber, shuttle vs WestRacks, parking options, etc.",
    href: "/guide/compare",
    kicker: "Category",
  },
];

function CardLink({ c }: { c: Card }) {
  return (
    <Link
      href={c.href}
      className="group block rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-white/15 hover:-translate-y-0.5 transition"
    >
      {c.kicker ? (
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
          {c.kicker}
        </div>
      ) : null}
      <div className="mt-2 text-2xl font-black leading-tight text-white">
        {c.title}
      </div>
      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{c.desc}</p>
      <div className="mt-4 text-sm text-zinc-200 underline decoration-white/20 group-hover:decoration-white/60">
        Open →
      </div>
    </Link>
  );
}

export default function GuideHub() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/hero-home.jpg"
            alt="Red Rocks Amphitheatre"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200">
            <span className="font-black tracking-wide">AUTHORITY GUIDES</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-300">No fluff. Just what works.</span>
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black tracking-tight">
            Red Rocks Guides
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-zinc-200">
            Strategy layer for concert nights: transportation, policies, parking,
            and post-show extraction. Read the intel — then book the clean exit.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/book-shuttle" className="btn-primary">
              Book Shuttle — $59/pp →
            </Link>

            <Link
              href="/red-rocks/transportation"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              Read Transportation Hub →
            </Link>

            <Link
              href="/guide/all"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 bg-black/30 hover:bg-black/15 transition"
            >
              All Guides (Index) →
            </Link>
          </div>

          <div className="mt-6 text-sm text-zinc-300">
            Sources worth checking:{" "}
            <a
              className="underline decoration-white/20 hover:decoration-white/60"
              href="https://www.redrocksonline.com"
              target="_blank"
              rel="noreferrer"
            >
              RedRocksOnline
            </a>{" "}
            ·{" "}
            <a
              className="underline decoration-white/20 hover:decoration-white/60"
              href="https://www.cotrip.org"
              target="_blank"
              rel="noreferrer"
            >
              COtrip
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {/* Featured */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black">Featured Intel</h2>
            <p className="mt-2 text-zinc-300">
              Start with Transportation, then hit Logistics and Sold-Out Survival.
            </p>
          </div>

          <div className="hidden md:flex gap-3">
            <Link href="/guide/all" className="underline decoration-white/20 hover:decoration-white/60 text-zinc-200">
              Browse everything →
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <CardLink key={c.href} c={c} />
          ))}
        </div>

        {/* Categories */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
                Browse by Category
              </div>
              <div className="mt-2 text-2xl font-black leading-tight">
                If you don’t know where to start…
              </div>
              <p className="mt-2 text-zinc-300">
                Start with <span className="text-zinc-100 font-semibold">Logistics</span>, then{" "}
                <span className="text-zinc-100 font-semibold">Transportation</span>, then{" "}
                <span className="text-zinc-100 font-semibold">Sold-Out Survival</span>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/book-shuttle" className="btn-primary">
                Book Shuttle — $59/pp →
              </Link>
              <Link
                href="/red-rocks/transportation"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
              >
                Read Transportation Hub →
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <CardLink key={c.href} c={c} />
            ))}
          </div>
        </div>

        <footer className="mt-14 pt-10 border-t border-white/10 text-sm text-zinc-400">
          Party at Red Rocks is a professional transport operator for Red Rocks
          and major Denver venues. Guides are the strategy layer — booking is{" "}
          <Link
            href="/book-shuttle"
            className="text-zinc-200 underline decoration-white/20 hover:decoration-white/60"
          >
            here
          </Link>
          .
        </footer>
      </section>
    </main>
  );
}
