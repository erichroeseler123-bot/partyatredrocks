import Link from "next/link";

const STEPS = [
  {
    n: "1",
    title: "Choose your ride",
    sub: "Start with the Private Suburban or upgrade to a private van.",
    href: "/book/red-rocks-amphitheatre/private/suv",
  },
  {
    n: "2",
    title: "Pick your date",
    sub: "Select the show date + pickup location, then confirm.",
    href: "/book/red-rocks-amphitheatre/private/suv",
  },
  {
    n: "3",
    title: "Get confirmation",
    sub: "Instant confirmation. Simple changes before the cutoff.",
    href: "/book/red-rocks-amphitheatre/private/suv",
  },
];

export default function HomeBookingSteps() {
  return (
    <section className="relative z-10 -mt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-surface-strong border-soft shadow-soft rounded-[32px] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[22px] font-black uppercase tracking-[0.24em] text-muted md:text-[24px]">
                Red Rocks private booking
              </p>
              <h2 className="mt-3 text-4xl md:text-6xl font-black tracking-tight">
                1–2–3 and you’re locked in
              </h2>
              <p className="mt-4 text-xl text-soft md:text-2xl">
                These steps are for <span className="font-bold">Red Rocks</span>. Tap any step to go straight to booking.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/book-shuttle" className="btn-primary">
                Book Private Suburban
              </Link>
              <Link href="/private-suburban" className="btn-secondary">
                Private Suburban — $399–$499
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <Link
                key={s.n}
                href={s.href}
                className="step-card"
                aria-label={`Step ${s.n}: ${s.title}`}
              >
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-sub">{s.sub}</div>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-xs text-muted">
            Cancellation: cancel up to 3 days before. After that, non-cancelable.
          </div>
        </div>
      </div>
    </section>
  );
}
