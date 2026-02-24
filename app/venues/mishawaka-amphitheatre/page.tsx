import Link from "next/link";

export const metadata = {
  title: "Mishawaka Amphitheatre Transportation | Party at Red Rocks",
  description:
    "Mishawaka show-night transport: timing reality, pickup plan, and booking options for private Suburban/Sprinter.",
};

export default function MishawakaPage() {
  return (
    <main className="text-white">
      <section className="pt-24 pb-10 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/55 text-[10px] font-black uppercase tracking-[0.35em]">
            Mountain Venue Transport
          </p>

          <h1 className="mt-3 text-5xl md:text-7xl font-black italic uppercase tracking-tight">
            Mishawaka Amphitheatre
          </h1>

          <p className="mt-4 text-white/70 max-w-2xl">
            A dedicated page for Mishawaka show-night logistics and booking. This is not a “normal venue” — plan your timing.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/book-all-venue" className="btn-primary">
              Book Private Suburban
            </Link>
            <Link href="/venues" className="btn-ghost">
              View all venues
            </Link>
            <Link href="/guide/red-rocks-faq" className="btn-ghost">
              Red Rocks FAQ →
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl border border-soft panel p-6 md:p-8 shadow-soft hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">What matters for Mishawaka</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-soft bg-surface/30 p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <p className="text-[11px] font-black uppercase tracking-[0.30em] text-white/55">Timing</p>
                <p className="mt-2 text-white/75">
                  Mountain roads + limited options near the venue. You want a clear pickup plan and buffer.
                </p>
              </div>

              <div className="rounded-2xl border border-soft bg-surface/30 p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <p className="text-[11px] font-black uppercase tracking-[0.30em] text-white/55">Pickup reality</p>
                <p className="mt-2 text-white/75">
                  We’ll confirm the best pickup spot and what to expect post-show (service + crowd flow).
                </p>
              </div>

              <div className="rounded-2xl border border-soft bg-surface/30 p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <p className="text-[11px] font-black uppercase tracking-[0.30em] text-white/55">Private is best</p>
                <p className="mt-2 text-white/75">
                  Mishawaka is best as private Suburban / Sprinter: fewer variables, cleaner exit plan.
                </p>
              </div>

              <div className="rounded-2xl border border-soft bg-surface/30 p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <p className="text-[11px] font-black uppercase tracking-[0.30em] text-white/55">Next step</p>
                <p className="mt-2 text-white/75">
                  Book a private vehicle and we’ll confirm timing + details by text.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/book-all-venue" className="btn-primary">
                Book Any-Venue Suburban
              </Link>
              <Link href="/booking" className="btn-ghost">
                Sprinter / Bus Quote →
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/50">
              Cancellation: cancel up to 3 days in advance. After that, bookings are non-cancellable.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
