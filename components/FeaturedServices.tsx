import Link from "next/link";

const SUBURBAN_BOOKING_HREF = "/book/red-rocks-amphitheatre/private/suv";

export default function FeaturedServices() {
  return (
    <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-6 pb-10">
      <div className="rounded-[32px] border-soft bg-surface-strong p-7 shadow-soft md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[12px] font-black uppercase tracking-[0.32em] text-muted">
              Private Red Rocks ride
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              One private Suburban for your group, there and back.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-soft md:text-[18px]">
              Party at Red Rocks is now focused on private vehicle service: direct pickup, simple return service,
              and limited show-night availability.
            </p>
          </div>
          <Link
            href={SUBURBAN_BOOKING_HREF}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-500 px-5 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:bg-red-400"
          >
            Book Private Suburban
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-3xl border-soft bg-surface p-6 shadow-soft">
            <div className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-red-100">
              Private Suburban
            </div>
            <h3 className="mt-3 text-xl font-black tracking-tight md:text-2xl">Best for small groups</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-strong/90">
              A direct Red Rocks ride for groups that want one pickup, one vehicle, and a clean return after the show.
            </p>
            <ul className="mt-5 space-y-2 text-[15px] leading-relaxed text-strong/90">
              {[
                "Private pickup for your group",
                "Simple there-and-back transportation",
                "Private door-to-door pickup",
              ].map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400/60" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border-soft bg-surface p-6 shadow-soft">
            <div className="text-4xl font-black leading-none">$399–$499</div>
            <div className="mt-1 text-[11px] font-black uppercase tracking-[0.22em] text-muted">
              Suburban range
            </div>
            <Link
              href={SUBURBAN_BOOKING_HREF}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-zinc-600/45 bg-surface/25 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-strong transition hover:bg-surface/40"
            >
              Reserve Private Ride
            </Link>
            <p className="mt-5 text-sm leading-6 text-soft">
              Built for small groups that want one private vehicle and one return plan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
