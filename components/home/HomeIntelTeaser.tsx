import Link from "next/link";

type IntelCard = {
  title: string;
  desc: string;
  href: string;
};

const CARDS: IntelCard[] = [
  {
    title: "Local Music Intelligence",
    desc: "Pickup reality, post-show timing, and how to avoid the trap.",
    href: "/guide/local-music-intelligence",
  },
  {
    title: "Red Rocks FAQ",
    desc: "Bag policy, tailgating, entry timing, and exits — quick answers.",
    href: "/guide/red-rocks-faq",
  },
];

export default function HomeIntelTeaser() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-10">
      <div className="rounded-[32px] border border-soft panel-soft p-7 md:p-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-3xl">
            <p className="text-[12px] font-black uppercase tracking-[0.32em] text-muted">
              Guides
            </p>
            <h2 className="mt-3 text-2xl md:text-4xl font-black tracking-tight">
              Quick intel for show night
            </h2>
            <p className="mt-4 text-[15px] md:text-[18px] leading-relaxed text-soft">
              Keep the homepage clean — put the deep stuff on dedicated pages.
            </p>
          </div>

          <Link
            href="/guide"
            className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
          >
            View all guides →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group block rounded-3xl border border-soft bg-black/35 p-6
                         shadow-[0_18px_50px_rgba(0,0,0,0.35)]
                         transition hover:-translate-y-1 hover:border-soft hover:bg-black/45"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-soft">
                    {c.desc}
                  </p>
                </div>

                <span className="shrink-0 mt-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100 group-hover:bg-cyan-500/15">
                  Open →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
