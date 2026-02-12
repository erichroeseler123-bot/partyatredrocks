import Link from "next/link";

type Step = {
  n: string;
  title: string;
  desc: string;
  href: string;
};

const STEPS: Step[] = [
  {
    n: "1",
    title: "Shuttle seats",
    desc: "$59–$65/pp • easiest for most people",
    href: "/book-shuttle",
  },
  {
    n: "2",
    title: "Private Suburban",
    desc: "$499 flat • your group only",
    href: "/private-suburban",
  },
  {
    n: "3",
    title: "Group quote",
    desc: "Sprinter / bus options for bigger groups",
    href: "/book",
  },
];

export default function RedRocks123() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.32em] text-zinc-400">
            Red Rocks only
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">
            Pick your ride in 10 seconds
          </h2>
          <p className="mt-3 text-zinc-300 max-w-2xl">
            Click any option to go straight to booking.
          </p>
        </div>

        <Link href="/guide/red-rocks-faq" className="link-blue text-sm font-black uppercase tracking-[0.22em]">
          Red Rocks info + FAQ →
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {STEPS.map((s) => (
          <Link
            key={s.n}
            href={s.href}
            className="group rounded-3xl border border-white/10 bg-surface-strong shadow-soft p-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-100 font-black flex items-center justify-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  {s.n}
                </div>
                <h3 className="text-xl font-black tracking-tight">{s.title}</h3>
              </div>
              <div className="text-cyan-200/70 font-black group-hover:text-cyan-200 transition">
                →
              </div>
            </div>
            <p className="mt-3 text-zinc-200/85">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/other-venues" className="link-blue text-sm font-black uppercase tracking-[0.22em]" rel="nofollow">
          Going somewhere else? Mishawaka + other venues →
        </Link>
      </div>
    </section>
  );
}
