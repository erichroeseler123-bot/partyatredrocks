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
    title: "Zac Brown Band (Example Event Guide)",
    desc: "Show-night flow, arrival windows, and pickup timing for this event page.",
    href: "/guide/events/zac-brown-band",
    kicker: "Events",
  },
];

function CardLink({ c }: { c: Card }) {
  return (
    <Link
      href={c.href}
      className={[
        "group relative block overflow-hidden rounded-3xl",
        "border border-white/10 bg-surface-strong",
        "p-6 md:p-7",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-2xl",
      ].join(" ")}
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative">
        {c.kicker ? (
          <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-300/80">
            <span className="h-2 w-2 rounded-full bg-white/40 group-hover:bg-white/70 transition" />
            {c.kicker}
          </div>
        ) : null}

        <div className="mt-3 text-2xl md:text-[26px] font-black leading-tight">
          {c.title}
        </div>

        <p className="mt-3 text-base text-zinc-200/80 leading-relaxed">
          {c.desc}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-200">
          Open <span className="opacity-60 group-hover:opacity-100 transition">→</span>
        </div>
      </div>
    </Link>
  );
}

export default function GuideHub() {
  return (
    <main className="min-h-screen bg-surface text-white">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/hero/hero-home.jpg"
            alt="Red Rocks at night"
            fill
            priority
            className="object-cover opacity-[0.18]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/60 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-200/80">
            Authority Layer
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black tracking-tight">
            Red Rocks Guides
          </h1>

          <p className="mt-4 text-lg md:text-xl text-zinc-200/80 max-w-3xl leading-relaxed">
            No fluff. Just what works on show nights: transportation strategy,
            parking reality, policy traps, and post-encore extraction.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/guide/all" className="btn-primary">
              All Guides (Index) →
            </Link>

            <Link
              href="/book-shuttle"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition font-semibold"
            >
              Book Shuttle — $59/pp →
            </Link>
          </div>

          <div className="mt-6 text-sm text-zinc-300/70">
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
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {/* Funnel Panel */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-zinc-300/80">
            Strategy → Execution
          </div>
          <div className="mt-2 text-2xl md:text-3xl font-black">
            Want the cleanest possible post-show exit?
          </div>
          <p className="mt-2 text-zinc-200/80 text-base md:text-lg max-w-3xl">
            Guides are intel. Booking is how you avoid “figure it out later.”
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/book-shuttle" className="btn-primary">
              Book Shuttle — $59/pp →
            </Link>
            <Link
              href="/red-rocks/transportation"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition font-semibold"
            >
              Read Transportation Hub →
            </Link>
          </div>
        </div>

        <div className="mt-12 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black">Featured</h2>
            <p className="mt-2 text-zinc-200/70">
              Your highest leverage pages — start here.
            </p>
          </div>

          <Link
            href="/guide/all"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-zinc-200/80 hover:text-zinc-200 transition"
          >
            Browse everything <span className="opacity-60">→</span>
          </Link>
        </div>

        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((c) => (
            <CardLink key={c.href} c={c} />
          ))}
        </div>

        <footer className="mt-16 pt-10 border-t border-white/10 text-sm text-zinc-300/70">
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

