import Link from 'next/link';

export default function SeasonPreview() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 bg-black text-white">
      <h1 className="text-5xl font-black mb-8 uppercase italic tracking-tighter">
        2026 <span className="text-red-600">Season</span> Lineup Intelligence
      </h1>
      <p className="text-zinc-400 text-xl mb-12 leading-relaxed">
        The 2026 Red Rocks season is heating up. From CRANKDAT in March to Zac Brown Band in October, 
        here is the definitive transport breakdown for the year's biggest shows.
      </p>

      <div className="grid gap-6 mb-16">
        <Link href="/guide/events/crankdat-march-27" className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-red-600 transition">
          <span className="text-red-600 font-bold uppercase text-xs">March 27, 2026</span>
          <h3 className="text-2xl font-black mt-1 uppercase">CRANKDAT</h3>
          <p className="text-zinc-500 text-sm mt-2">Season opener bass. Requires Winter Gear Prep guide.</p>
        </Link>
        {/* Repeat for other major 2026 artists */}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Link href="/guide/logistics/winter-survival" className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-blue-500 transition">
          <h4 className="text-blue-400 font-black uppercase mb-2">Winter Survival</h4>
          <p className="text-zinc-500 text-sm text-left">How to prep for freezing March/April shows.</p>
        </Link>
        <Link href="/guide/logistics/shuttle-vs-westracks-2026" className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-yellow-600 transition">
          <h4 className="text-yellow-600 font-black uppercase mb-2">vs. Public Shuttle</h4>
          <p className="text-zinc-500 text-sm text-left">Why we are the only reliable night service in 2026.</p>
        </Link>
      </div>
    </div>
  );
}
