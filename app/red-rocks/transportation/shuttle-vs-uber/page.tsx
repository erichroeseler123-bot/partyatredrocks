import Link from "next/link";

export const metadata = {
  title: "Shuttle vs Uber at Red Rocks",
  description:
    "Cost, reliability, surge pricing, and the best return strategy after the encore.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-zinc-400">
          <Link className="hover:text-white" href="/red-rocks/transportation">
            Transportation
          </Link>{" "}
          <span className="text-zinc-600">/</span> Shuttle vs Uber
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Shuttle vs Uber</h1>
        <p className="mt-4 text-lg text-zinc-300">
          Shuttles are predictable. Rideshares can be fine—or a complete mess—depending on
          surges, queue control, and driver availability.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Cost</h3>
            <p className="mt-2 text-zinc-300">
              Shuttles are fixed. Rideshares spike post-show and can exceed expectations on
              sold-out nights.
            </p>
          </div>

          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Reliability</h3>
            <p className="mt-2 text-zinc-300">
              Pickup depends on lot control, queue length, and driver availability. Shuttles run
              on schedule.
            </p>
          </div>

          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Best strategy</h3>
            <p className="mt-2 text-zinc-300">
              If you rideshare, leave slightly before the final rush or wait it out. If you shuttle,
              treat it like a reservation.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <Link href="/book-shuttle" className="btn-primary">
            Book the $59 shuttle →
          </Link>
        </div>
      </div>
    </main>
  );
}
