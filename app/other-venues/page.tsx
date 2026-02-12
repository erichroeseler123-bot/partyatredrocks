import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Other Venues + Mishawaka | Party at Red Rocks",
  description:
    "Mishawaka Amphitheatre and other venue transportation. Simple fixed pricing — request a vehicle for your group.",
  robots: {
    index: false, // keep it out of Google results
    follow: true, // still pass link equity to booking pages
  },
};

type Card = {
  title: string;
  price: string;
  note: string;
  bullets: string[];
  href: string;
  cta: string;
};

const CARDS: Card[] = [
  {
    title: "Mishawaka Amphitheatre",
    price: "Get a quote",
    note: "private group ride",
    bullets: ["Fort Collins / Poudre Canyon timing", "Driver waits for post-show exit", "Best option for groups"],
    href: "/venues/mishawaka-amphitheatre",
    cta: "View Mishawaka options",
  },
  {
    title: "Any-venue SUV",
    price: "$250",
    note: "flat rate",
    bullets: ["Denver metro venues", "Private vehicle for your group", "Simple pricing, no surge"],
    href: "/book-all-venues",
    cta: "Book any-venue SUV",
  },
  {
    title: "Any-venue Sprinter / Bus",
    price: "Request",
    note: "group vehicle",
    bullets: ["More seats + comfort", "Good for groups", "Venue-specific timing"],
    href: "/book-all-venues",
    cta: "Request group vehicle",
  },
];

function CardUI({ c }: { c: Card }) {
  return (
    <Link
      href={c.href}
      className="group block rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]
                 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-200">
            Other venues
          </div>
          <h3 className="mt-3 text-xl md:text-2xl font-black tracking-tight text-white">{c.title}</h3>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl md:text-3xl font-black leading-none text-white">{c.price}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-zinc-400">{c.note}</div>
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-[15px] leading-relaxed text-zinc-200/90">
        {c.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400/60" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <span className="inline-flex w-full items-center justify-center rounded-full bg-cyan-500/15 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-100
                         ring-1 ring-cyan-500/25 transition group-hover:bg-cyan-500/20">
          {c.cta}
        </span>
      </div>
    </Link>
  );
}

export default function OtherVenuesPage() {
  return (
    <main className="text-white">
      <section className="relative border-b border-white/10 bg-surface/40">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight">
            Mishawaka + other venues
          </h1>
          <p className="mt-4 max-w-3xl text-white/70 text-[15px] md:text-[18px] leading-relaxed">
            Need transportation somewhere that isn’t Red Rocks? Start here. Tap an option below to request or book.
          </p>

          <div className="mt-6">
            <Link href="/" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 text-sm font-black uppercase tracking-[0.22em]">
              ← Back to Red Rocks
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {CARDS.map((c) => (
            <CardUI key={c.title} c={c} />
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-lg font-black uppercase tracking-[0.18em]">Heads up</h2>
          <p className="mt-3 text-zinc-200/90 leading-relaxed">
            For far destinations (like Mishawaka), exact pickup/return timing depends on the show schedule and canyon traffic.
            We’ll confirm details after you submit.
          </p>
          <div className="mt-5">
            <Link href="/book-all-venues" className="btn-primary">
              Request other-venue ride
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
