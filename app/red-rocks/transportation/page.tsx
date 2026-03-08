import Link from "next/link";

export const metadata = {
  title: "Red Rocks Transportation",
  description: "How to get to Red Rocks: shuttle vs rideshare, parking reality, and post-show pickup strategy.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">Red Rocks Transportation</h1>
        <p className="mt-4 text-lg text-soft max-w-3xl">How to get to Red Rocks: shuttle vs rideshare, parking reality, and post-show pickup strategy.</p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/red-rocks/transportation/shuttle-vs-uber" className="block p-6 bg-surface-strong rounded-2xl border border-soft hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">\n            <h3 className="text-xl font-bold mb-2">Shuttle vs Uber at Red Rocks</h3>\n            <p className="text-soft">Cost, reliability, surge pricing, and the best return strategy after the encore.</p>\n          </Link>\n\n          <Link href="/red-rocks/transportation/parking-reality" className="block p-6 bg-surface-strong rounded-2xl border border-soft hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">\n            <h3 className="text-xl font-bold mb-2">Red Rocks Parking Reality</h3>\n            <p className="text-soft">Arrival timing, overflow lots, and what actually happens on busy nights.</p>\n          </Link>\n\n          <Link href="/red-rocks/transportation/post-show-pickup" className="block p-6 bg-surface-strong rounded-2xl border border-soft hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">\n            <h3 className="text-xl font-bold mb-2">Post-Show Pickup Strategy (Red Rocks)</h3>\n            <p className="text-soft">Where to meet, best pickup windows, and how to avoid the chaos after the encore.</p>\n          </Link>
        </div>

        <div className="mt-14">
          <Link href="/find" className="btn-primary">Book Red Rocks Shuttle — $59/pp →</Link>
          <div className="mt-3 text-sm text-soft">
            Seats fill fast on sold-out shows. Lock it in now.
          </div>
        </div>
      </div>
    </main>
  );
}

