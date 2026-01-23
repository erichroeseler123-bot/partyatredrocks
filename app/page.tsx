import Link from 'next/link';

// DCC DISPATCH INTELLIGENCE
const FEATURED_SHOWS = [
  { id: "crankdat", name: "Crankdat", date: "Mar 27", img: "https://seatgeek.com/images/performers-landscape/crankdat-1f2e3d/654321/huge.jpg" },
  { id: "inzo", name: "INZO", date: "Apr 3", img: "https://seatgeek.com/images/performers-landscape/inzo-2a3b4c/123456/huge.jpg" },
  { id: "sublime", name: "Sublime", date: "Apr 17", img: "https://seatgeek.com/images/performers-landscape/sublime-0e2f1d/987654/huge.jpg" }
];

export default function DispatchHub() {
  return (
    <main className="min-h-screen bg-black text-white p-12">
      <header className="mb-20 border-b border-white/10 pb-10">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter">Party @ Red Rocks! dispatch hub</h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-4 italic">Premium shuttle and private transportation for Colorado's best venues.</p>
      </header>

      {/* NEW THUMBNAIL GRID */}
      <section className="mb-20">
        <h2 className="text-red-600 font-black uppercase text-[10px] tracking-[0.4em] mb-10 italic">Featured 2026 Intelligence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_SHOWS.map((show) => (
            <Link key={show.id} href={`/shows/${show.id}`} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 p-2 transition-all hover:border-red-600/50">
              <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                <img src={show.img} alt={show.name} className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-4 left-4 text-xs font-black uppercase italic tracking-widest text-red-600">{show.date}</p>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-black italic uppercase tracking-tight group-hover:text-red-600 transition-colors">{show.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mt-1">View Intelligence &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <nav className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] italic text-zinc-400">
        <Link href="/venues/red-rocks-amphitheatre" className="hover:text-red-600 underline decoration-red-600 underline-offset-8">Red Rocks</Link>
        <Link href="#" className="hover:text-yellow-400 underline decoration-yellow-400 underline-offset-8">Mishawaka</Link>
        <Link href="#" className="hover:text-blue-600 underline decoration-blue-600 underline-offset-8">All Venues Shuttle</Link>
      </nav>
    </main>
  );
}
