import Link from "next/link";

export const metadata = {
  title: "Red Rocks Parking Reality",
  description:
    "Arrival timing, overflow lots, and what actually happens on busy nights.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-zinc-400">
          <Link className="hover:text-white" href="/red-rocks/transportation">
            Transportation
          </Link>{" "}
          <span className="text-zinc-600">/</span> Parking Reality
        </nav>

        <h1 className="mt-4 text-5xl font-black tracking-tight">Parking Reality</h1>
        <p className="mt-4 text-lg text-zinc-300">
          Parking is easy on light nights. On high-demand shows, lots fill early and overflow is normal.
        </p>

        <section className="mt-10 grid gap-6">
          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Arrival windows</h3>
            <p className="mt-2 text-zinc-300">
              The earlier you arrive, the better your lot and your exit. Late arrivals risk overflow and long hikes.
            </p>
          </div>

          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Overflow + long walks</h3>
            <p className="mt-2 text-zinc-300">
              When primary lots fill, you’re walking. Budget time and bring layers for post-show temps.
            </p>
          </div>

          <div className="bg-surface-strong border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold">Exit congestion</h3>
            <p className="mt-2 text-zinc-300">
              The show ends and everyone moves at once. Your lot placement and patience matter.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <Link href="/book-shuttle" className="btn-primary">
            Skip parking — Book the $59 shuttle →
          </Link>
        </div>
      </div>
    </main>
  );
}
