import Link from "next/link";
import { PRIVATE_TRANSPORT_PROMO } from "@/lib/privateTransportPromo";

type Service = {
  title: string;
  price: string;
  note: string;
  bullets: string[];
  href: string;
  tag: "Private SUV" | "Van";
};

const SERVICES: Service[] = [
  {
    title: "Private Suburban",
    price: "$399",
    note: "flat rate",
    bullets: ["Your group only", "Private pickup timing", "Direct return after the show"],
    href: "/book/red-rocks-amphitheatre/private/suv",
    tag: "Private SUV",
  },
  {
    title: "Private Van Upgrade",
    price: "$599",
    note: "flat rate",
    bullets: ["More room for larger groups", "One vehicle", "Direct pickup + direct return"],
    href: "/book/red-rocks-amphitheatre/private/van",
    tag: "Van",
  },
];

function Tag({ t }: { t: Service["tag"] }) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.22em]";
  switch (t) {
    case "Private SUV":
      return <span className={`${base} border-red-500/30 bg-red-500/10 text-red-100`}>Private</span>;
    case "Van":
      return <span className={`${base} border-cyan-500/30 bg-cyan-500/10 text-cyan-100`}>Private van</span>;
  }
}

export default function HomeServicesGrid() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 -mt-14 pb-10">
      <div className="rounded-[32px] border border-soft panel-soft p-7 md:p-10 shadow-[0_22px_70px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-[12px] font-black uppercase tracking-[0.32em] text-muted">
              Red Rocks transportation
            </p>
            <h2 className="mt-3 text-2xl md:text-4xl font-black tracking-tight">
              Choose your private ride
            </h2>
            <p className="mt-4 text-[15px] md:text-[18px] leading-relaxed text-soft">
              Everything on this page is private Red Rocks transportation. Pick the vehicle that fits your group.
            </p>
          </div>

          {/* remove the extra hero buttons — keep this single CTA only */}
          <Link href="/book/red-rocks-amphitheatre/private/suv" className="btn-primary">
            Book Private Suburban
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((s) => (
            <Link
              key={s.title + s.price}
              href={s.href}
              className="group block rounded-3xl border border-soft bg-black/35 p-6
                         shadow-[0_18px_50px_rgba(0,0,0,0.35)]
                         transition hover:-translate-y-1 hover:border-soft hover:bg-black/45"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Tag t={s.tag} />
                  <h3 className="mt-3 text-xl md:text-2xl font-black tracking-tight text-white">
                    {s.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl md:text-3xl font-black leading-none text-white">
                    {s.price}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted">
                    {s.note}
                  </div>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-[15px] leading-relaxed text-strong/90">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400/60" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-cyan-300 group-hover:text-cyan-200 underline underline-offset-4">
                Book this option →
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-5 py-4 text-sm leading-6 text-emerald-50">
          <span className="font-black uppercase tracking-[0.18em] text-emerald-200">April promo</span>{" "}
          {PRIVATE_TRANSPORT_PROMO.detail}
        </div>

        {/* keep this tiny + blue link */}
        <div className="mt-8">
          <Link
            href="/other-venues"
            rel="nofollow"
            className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
          >
            Going somewhere else? Mishawaka + other venues →
          </Link>
        </div>
      </div>
    </section>
  );
}
