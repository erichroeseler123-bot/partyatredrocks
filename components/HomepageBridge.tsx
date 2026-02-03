import Link from 'next/link';

export default function HomepageBridge() {
  return (
    <section className="py-20 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black italic uppercase text-white mb-8 tracking-tighter">
          Venue Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/guide/events/tailgate-guide" className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-red-600 transition">
            <h3 className="text-red-600 font-bold uppercase text-sm mb-2">Tailgate Guide</h3>
            <p className="text-zinc-500 text-xs">Best lots, 2026 rules, and "Secret Sauce" pre-game tips.</p>
          </Link>
          <Link href="/guide/logistics/shuttle-vs-westracks-2026" className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-yellow-600 transition">
            <h3 className="text-yellow-500 font-bold uppercase text-sm mb-2">vs. Westracks Pilot</h3>
            <p className="text-zinc-500 text-xs">Why the public pilot fails for night shows and returns.</p>
          </Link>
          <Link href="/guide/events/2026-season-preview" className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-blue-600 transition">
            <h3 className="text-blue-500 font-bold uppercase text-sm mb-2">2026 Season Intel</h3>
            <p className="text-zinc-500 text-xs">Lineup rumors, gear prep, and March survival hacks.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
