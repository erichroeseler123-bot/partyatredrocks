import Link from "next/link";

export default function HomepageBridge() {
 return (
 <section className="py-16 md:py-20 section section-alt">
 <div className="max-w-7xl mx-auto px-6">
 <div className="bg-surface border-soft shadow-soft rounded-3xl p-6 md:p-8 hover:shadow-2xl hover:-translate-y-1 hover:glow-accent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 glow-accent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
 <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
 <div>
 <p className="text-base uppercase tracking-[0.18em] text-zinc-300">
 Featured
 </p>
 <h2 className="mt-2 text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
 Local Music Intelligence
 </h2>
 <p className="mt-3 max-w-2xl text-zinc-300">
 Real-world venue logic: show-night logistics, pickup reality, tailgate rules,
 and how to avoid the post-show trap.
 </p>
 </div>

 <Link
 href="/guide/local-music-intelligence"
 className="inline-flex items-center justify-center rounded-2xl px-5 py-3 border-soft bg-surface-strong hover:opacity-95 transition hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
 >
 See all intel →
 </Link>
 </div>

 <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
 {/* Card 1 — Ember accent */}
 <Link
 href="/guide/events/tailgate-guide"
 className="group rounded-3xl p-6 bg-surface-strong border-soft hover:opacity-95 transition glow-accent hover:shadow-2xl hover:-translate-y-1 hover:glow-accent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 glow-accent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
 >
 <div className="flex items-center justify-between gap-3">
 <span className="text-xs uppercase tracking-[0.18em] text-zinc-300">
 Red Rocks
 </span>
 <span className="text-[10px] font-black uppercase tracking-[0.22em] text-black bg-[rgba(255,90,31,0.92)] px-3 py-1 rounded-full">
 Tailgate
 </span>
 </div>

 <h3 className="mt-4 text-xl font-extrabold font-black uppercase tracking-tight">
 Tailgate Guide
 </h3>
 <p className="mt-2 text-base text-zinc-300">
 Best lots, 2026 rules, and “secret sauce” pre-game tips that actually work.
 </p>

 <div className="mt-5 text-sm font-bold text-white/90 group-hover:text-white transition">
 Read the guide →
 </div>
 </Link>

 {/* Card 2 — Electric blue accent */}
 <Link
 href="/guide/logistics/shuttle-vs-westracks-2026"
 className="group rounded-3xl p-6 bg-surface-strong border-soft hover:opacity-95 transition glow-accent2 hover:shadow-2xl hover:-translate-y-1 hover:glow-accent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 glow-accent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
 >
 <div className="flex items-center justify-between gap-3">
 <span className="text-xs uppercase tracking-[0.18em] text-zinc-300">
 Logistics
 </span>
 <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white bg-[rgba(64,170,255,0.22)] border border-[rgba(64,170,255,0.35)] px-3 py-1 rounded-full">
 Compare
 </span>
 </div>

 <h3 className="mt-4 text-xl font-extrabold font-black uppercase tracking-tight">
 Shuttle vs. Westracks Pilot
 </h3>
 <p className="mt-2 text-base text-zinc-300">
 Why the public pilot breaks down after night shows — and what to do instead.
 </p>

 <div className="mt-5 text-sm font-bold text-white/90 group-hover:text-white transition">
 See the breakdown →
 </div>
 </Link>

 {/* Card 3 — Neutral / “intel” */}
 <Link
 href="/guide/events/2026-season-preview"
 className="group rounded-3xl p-6 bg-surface-strong border-soft hover:opacity-95 transition hover:shadow-2xl hover:-translate-y-1 hover:glow-accent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 glow-accent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
 >
 <div className="flex items-center justify-between gap-3">
 <span className="text-xs uppercase tracking-[0.18em] text-zinc-300">
 2026
 </span>
 <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white bg-white/10 border border-white/15 px-3 py-1 rounded-full">
 Intel
 </span>
 </div>

 <h3 className="mt-4 text-xl font-extrabold font-black uppercase tracking-tight">
 2026 Season Intel
 </h3>
 <p className="mt-2 text-base text-zinc-300">
 Lineup signals, gear prep, weather reality, and what changes year-to-year.
 </p>

 <div className="mt-5 text-sm font-bold text-white/90 group-hover:text-white transition">
 Open intel →
 </div>
 </Link>
 </div>
 </div>
 </div>
 </section>
 );
}
