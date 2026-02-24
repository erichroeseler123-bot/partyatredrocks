import Link from "next/link";

const STEPS = [
  {
    n: 1,
    title: "Choose your ride",
    sub: "Shuttle seats (best value) or upgrade to a private Suburban.",
  },
  {
    n: 2,
    title: "Pick your date",
    sub: "Select the show date and pickup location, then confirm.",
  },
  {
    n: 3,
    title: "Get confirmation",
    sub: "Instant confirmation. Simple changes before the cutoff.",
  },
];

export default function HomeBookingSteps() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 -mt-24 pb-10">
      <div className="panel text-white rounded-[28px] shadow-2xl border border-soft backdrop-blur-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-white/60">
              Red Rocks Shuttle Booking
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight">
              Tap any step — it takes you straight to booking
            </h2>
            <p className="mt-2 text-white/60">
              These steps are <span className="font-bold">for Red Rocks</span>.
            </p>
          </div>

          <Link href="/book-shuttle" className="btn-primary">
            Book Red Rocks Shuttle
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <Link
              key={s.n}
              href="/book-shuttle"
              className="step-card rounded-2xl border border-soft panel hover:bg-surface/40 shadow-md hover:shadow-xl transition p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              aria-label={`Step ${s.n}: ${s.title}. Go to booking.`}
            >
              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-2xl bg-black text-white flex items-center justify-center font-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  {s.n}
                </div>
                <div className="min-w-0">
                  <div className="font-black text-lg">{s.title}</div>
                  <div className="mt-1 text-sm text-white/60">{s.sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 rounded-2xl panel px-4 py-3 text-sm text-white/70 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <span className="font-black">Cancellation:</span> cancel up to <span className="font-bold">3 days</span> before.
          After that, <span className="font-bold">non-cancelable</span>.
        </div>
      </div>
    </section>
  );
}
