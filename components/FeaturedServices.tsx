import Link from "next/link";
import { PRIVATE_TRANSPORT_PROMO } from "@/lib/privateTransportPromo";

type Card = {
  group: "Red Rocks";
  title: string;
  price: string;
  note: string;
  bullets: string[];
  href: string;
  cta: string;
  tone: "suv" | "van";
};

const CARDS: Card[] = [
  // ---------------- RED ROCKS ----------------
  {
    group: "Red Rocks",
    title: "Private Suburban",
    price: "$399",
    note: "flat rate",
    bullets: ["Your group only", "Private pickup timing", "Direct return after the show"],
    href: "/book/red-rocks-amphitheatre/private/suv",
    cta: "Book Private Suburban",
    tone: "suv",
  },
  {
    group: "Red Rocks",
    title: "Private Van Upgrade",
    price: "$599",
    note: "flat rate",
    bullets: ["More room for larger groups", "One vehicle", "Direct pickup + direct return"],
    href: "/book/red-rocks-amphitheatre/private/van",
    cta: "Upgrade to Private Van",
    tone: "van",
  },
];

function badge(tone: Card["tone"]) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.22em]";
  switch (tone) {
    case "suv":
      return <span className={`${base} border-red-500/30 bg-red-500/10 text-red-100`}>Private</span>;
    case "van":
      return <span className={`${base} border-cyan-500/30 bg-cyan-500/10 text-cyan-100`}>Private van</span>;
  }
}

function CardUI({ c }: { c: Card }) {
  return (
    <div className="bg-surface border-soft shadow-soft rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:glow-accent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {badge(c.tone)}
          <h3 className="mt-3 text-xl md:text-2xl font-black tracking-tight">{c.title}</h3>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl md:text-3xl font-black leading-none">{c.price}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted">{c.note}</div>
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-[15px] leading-relaxed text-strong/90">
        {c.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400/60" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link
          href={c.href}
          className="inline-flex w-full items-center justify-center rounded-full border border-zinc-600/45 bg-surface/25 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-strong hover:bg-surface/40 transition"
        >
          {c.cta}
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedServices() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 -mt-16 pb-10">
      <div className="bg-surface-strong border-soft shadow-soft rounded-[32px] p-7 md:p-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-[12px] font-black uppercase tracking-[0.32em] text-muted">
              Transportation options
            </p>
            <h2 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">
              Private Red Rocks transportation for your group
            </h2>
            <p className="mt-4 text-[16px] md:text-[18px] leading-relaxed text-soft">
              Fixed pricing, professional drivers, and timing built for show nights. Pick Private Suburban or upgrade
              to a private van.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-5 py-4 text-sm leading-6 text-emerald-50">
            <span className="font-black uppercase tracking-[0.18em] text-emerald-200">April promo</span>{" "}
            {PRIVATE_TRANSPORT_PROMO.detail}
          </div>

          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-black uppercase tracking-[0.28em] text-muted">Red Rocks</h3>
            <Link href="/book" className="text-xs font-black uppercase tracking-[0.28em] text-soft hover:text-white">
              Get a quote →
            </Link>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {CARDS.map((c) => (
              <CardUI key={c.title + c.price} c={c} />
            ))}
          

        <div className="mt-8">
          <a href="/other-venues" className="link-blue text-sm font-black uppercase tracking-[0.22em]">
            Going somewhere else? Mishawaka + other venues →
          </a>
        </div>

</div>
        </div>
      </div>
    </section>
  );
}
