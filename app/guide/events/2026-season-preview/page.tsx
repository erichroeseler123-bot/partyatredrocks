import Link from 'next/link';

export default function SeasonPreview() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 bg-black text-white">
      <h1 className="text-5xl font-black mb-8 uppercase italic tracking-tighter leading-tight">
        2026 <span className="text-red-600">Season</span> Lineup Intelligence
      </h1>
      <p className="text-zinc-400 text-xl mb-12 leading-relaxed font-medium">
        The 2026 Red Rocks season is heating up. From CRANKDAT in March to Zac Brown Band in October, 
        here is the definitive transport breakdown for the year&apos;s biggest shows.
      </p>

      <div className="grid gap-6 mb-16">
        <Link href="/guide/events/crankdat-march-27" className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] hover:border-red-600 transition-all group">
          <span className="text-red-600 font-bold uppercase text-xs tracking-widest">March 27, 2026</span>
          <h3 className="text-2xl font-black mt-2 uppercase italic">CRANKDAT</h3>
          <p className="text-zinc-500 text-sm mt-3 leading-relaxed">Season opener bass. Requires Winter Gear Prep guide for freezing lot conditions.</p>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Link href="/guide/logistics/winter-survival" className="p-8 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] hover:border-blue-500 transition-all">
          <h4 className="text-blue-400 font-black uppercase tracking-tighter mb-2">Winter Survival</h4>
          <p className="text-zinc-500 text-sm text-left font-medium">How to prep for freezing March and April shows without getting stranded.</p>
        </Link>
        <Link href="/guide/logistics/shuttle-vs-westracks-2026" className="p-8 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] hover:border-yellow-600 transition-all">
          <h4 className="text-yellow-600 font-black uppercase tracking-tighter mb-2">vs. Public Shuttle</h4>
          <p className="text-zinc-500 text-sm text-left font-medium">Why we are the only reliable post-show service in 2026. No surge, no waits.</p>
        </Link>
      </div>

      <div className="mt-20 pt-10 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
          &copy; 2026 Party at Red Rocks | Professional Concert Logistics
        </p>
      </div>
    </div>
  );
}
