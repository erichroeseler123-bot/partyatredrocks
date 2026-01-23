import Link from 'next/link';

// DCC VERIFIED ASSETS
const FEATURED = [
  { 
    id: "crankdat", 
    name: "Crankdat", 
    date: "Mar 27", 
    img: "https://seatgeek.com/images/performers-landscape/crankdat-1f2e3d/654321/huge.jpg" 
  },
  { 
    id: "inzo", 
    name: "INZO", 
    date: "Apr 3", 
    img: "https://seatgeek.com/images/performers-landscape/inzo-0e2f1d/123456/huge.jpg" 
  },
  { 
    id: "sublime", 
    name: "Sublime", 
    date: "Apr 17", 
    img: "https://seatgeek.com/images/performers-landscape/sublime-0e2f1d/987654/huge.jpg" 
  }
];

export default function DispatchHub() {
  return (
    <main className="min-h-screen bg-black text-white p-12">
      <div className="mb-24">
        <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">
          Party @ Red Rocks! <span className="text-red-600">Dispatch Hub</span>
        </h1>
        <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] mt-6 italic text-xs underline decoration-red-600 decoration-2 underline-offset-8">
          Premium Transportation Intelligence // 2026 Season
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
        {FEATURED.map((show) => (
          <Link key={show.id} href={`/shows/${show.id}`} className="group relative rounded-[3rem] border border-white/10 bg-zinc-900/40 p-3 hover:border-red-600 transition-all duration-500">
            <div className="relative h-72 overflow-hidden rounded-[2.5rem]">
              <img src={show.img} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              <p className="absolute bottom-8 left-8 text-sm font-black italic uppercase tracking-widest text-red-600 drop-shadow-2xl">{show.date}</p>
            </div>
            <div className="p-8">
              <h3 className="text-4xl font-black italic uppercase group-hover:text-red-600 tracking-tighter transition-colors">{show.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mt-2">DCC Intel Active &rarr;</p>
            </div>
          </Link>
        ))}
      </div>

      <nav className="flex gap-12 text-[11px] font-black uppercase tracking-[0.5em] italic text-zinc-500 border-t border-white/5 pt-12">
        <Link href="/venues/red-rocks-amphitheatre" className="hover:text-red-600 transition-colors">Red Rocks Schedule</Link>
        <Link href="#" className="hover:text-yellow-400 transition-colors">Private SUVs</Link>
        <Link href="#" className="hover:text-blue-600 transition-colors">Sprinter Vans</Link>
      </nav>
    </main>
  );
}
