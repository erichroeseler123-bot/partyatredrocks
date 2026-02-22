import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Red Rocks Guides",
  description:
    "No fluff. Just what works on show nights: transportation strategy, parking reality, policy traps, and post-encore extraction.",
  alternates: {
    canonical: "/guide",
  },
  openGraph: {
    title: "Red Rocks Guides",
    description:
      "No fluff. Just what works on show nights: transportation strategy, parking reality, policy traps, and post-encore extraction.",
    url: "/guide",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Guides",
    description:
      "No fluff. Just what works on show nights: transportation strategy, parking reality, policy traps, and post-encore extraction.",
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

const authority: Card[] = [
  {
    title: "Transportation (Authority Hub)",
    desc: "Shuttle vs rideshare, pricing reality, and the most reliable way out after the encore.",
    href: "/guide/transportation",
    kicker: "Authority",
  },
  {
    title: "Parking (Authority Hub)",
    desc: "Which lots fill first, how to reduce walking, and how to avoid exit gridlock.",
    href: "/guide/parking",
    kicker: "Authority",
  },
  {
    title: "Policies (Authority Hub)",
    desc: "Bag policy, entry rules, and what actually gets enforced at the gate.",
    href: "/guide/policies",
    kicker: "Authority",
  },
  {
    title: "Show-Night Strategy (Authority Hub)",
    desc: "Arrival windows, weather risk, crowd flow, and the exit plan that prevents getting stranded.",
    href: "/guide/show-night-strategy",
    kicker: "Authority",
  },
];

function CardLink({ c }: { c: Card }) {
  return (
    <Link href={c.href} className="group block p-6 card-premium">
      {c.kicker ? (
        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
          {c.kicker}
        </div>
      ) : null}

      <div className="mt-2 text-2xl font-black leading-tight">{c.title}</div>
      <p className="mt-3 text-sm text-zinc-200/90 leading-relaxed">{c.desc}</p>

      <div className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-200 underline decoration-white/20 group-hover:decoration-white/60">
        Open <span aria-hidden>→</span>
      </div>
    </Link>
  );
}

export default function GuideHub() {
  return (
    <main className="min-h-screen bg-surface text-white premium-wrap">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/hero-home.jpg"
            alt="Red Rocks at night"
            fill
            priority
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_380px_at_18%_18%,rgba(255,80,80,0.18),transparent_60%),radial-gradient(900px_380px_at_78%_10%,rgba(93,173,255,0.14),transparent_62%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-14">
          <div className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-300">
            <span className="px-3 py-1 rounded-full border border-white/15 bg-white/5">
              Authority Layer
            </span>
            <span className="text-zinc-400">Red Rocks</span>
          </div>

          <h1 className="mt-5 text-5xl md:text-6xl font-black tracking-tight">
            Red Rocks Guides
          </h1>

          <p className="mt-4 text-lg text-zinc-200 max-w-3xl leading-relaxed">
            No fluff. Just what works on show nights: transportation strategy,
            parking reality, policy traps, and post-encore extraction.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/guide/all" className="btn-primary">
              Browse everything →
            </Link>

            <Link
              href="/book-shuttle"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              Book Shuttle — $59/pp →
            </Link>
          </div>

          <div className="mt-6 text-sm text-zinc-300/90">
            Sources worth checking:{" "}
            <a
              className="underline decoration-white/25 hover:decoration-white/60"
              href="https://www.redrocksonline.com"
              target="_blank"
              rel="noreferrer"
            >
              RedRocksOnline
            </a>{" "}
            ·{" "}
            <a
              className="underline decoration-white/25 hover:decoration-white/60"
              href="https://www.cotrip.org"
              target="_blank"
              rel="noreferrer"
            >
              COtrip
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Strategy banner */}
        <section className="banner-premium p-7 mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-300">
                Strategy → Execution
              </div>
              <div className="mt-2 text-2xl font-black">
                Want the cleanest possible post-show exit?
              </div>
              <p className="mt-2 text-zinc-200/90">
                Guides are intel. Booking is how you avoid “figure it out later.”
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/book-shuttle" className="btn-primary">
                Book Shuttle — $59/pp →
              </Link>
              <Link
                href="/guide/transportation"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
              >
                Read Transportation Hub →
              </Link>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2 className="text-3xl font-black">Featured</h2>
              <p className="mt-2 text-zinc-300/90">
                Your highest leverage pages — start here.
              </p>
            </div>
            <Link
              href="/guide/all"
              className="underline decoration-white/20 hover:decoration-white/60 text-zinc-200"
            >
              Browse everything →
            </Link>
          </div>

          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((c) => (
              <CardLink key={c.href} c={c} />
            ))}
          </div>
        </section>

        {/* Authority hubs */}
        <section className="mt-14">
          <h2 className="text-2xl font-black">Authority Hubs</h2>
          <p className="mt-2 text-zinc-300/90 max-w-3xl">
            These are the “pillar” pages Google likes: clean structure, tight intent,
            and internal links to leaf guides.
          </p>

          <div className="mt-6 grid md:grid-cols-2 gap-5">
            {authority.map((c) => (
              <CardLink key={c.href} c={c} />
            ))}
          </div>
        </section>

        <footer className="mt-16 pt-10 border-t border-white/10 text-sm text-zinc-400">
          This is the authority layer: no fluff, no hype — just show-night reality and what works.
        </footer>
      </div>
    </main>
  );
}
