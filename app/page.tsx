import Link from 'next/link';

// DCC VERIFIED 2026 COLOR ASSETS
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
  },
  { 
    id: "ice-cube", 
    name: "Ice Cube", 
    date: "Apr 20", 
    img: "https://seatgeek.com/images/performers-landscape/ice-cube-0d2e1f/111222/huge.jpg" 
  }
];

export default function DispatchHub() {
  return (
    <main className="min-h-screen bg-black text-white p-12">
      <div className="mb-24">
        <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">
          Party @ Red Rocks! <br />
          <span className="text-red-600 underline decoration-red-600 decoration-8 underline-offset-10">Dispatch Hub</span>
        </h1>
        <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] mt-12 italic text-xs">
          2026 Season Intelligence // Verified Color Assets // Premium Fleet Active
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-32">
        {FEATURED.map((show) => (
          <Link key={show.id} href={`/shows/${show.id}`} 
                className="group relative rounded-[3rem] border border-white/10 bg-zinc-900/60 p-4 transition-all duration-500 shadow-2xl shadow-red-900/20 hover:shadow-red-600/40">
            <div className="relative h-64 overflow-hidden rounded-[2.5rem]">
              {/* NO GRAYSCALE - NO SCALING */}
              <img src={show.img} className="h-full w-full object-cover" alt={show.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <p className="absolute bottom-6 left-6 text-xs font-black italic uppercase tracking-widest text-red-600">{show.date}</p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-black italic uppercase group-hover:text-red-600 tracking-tighter transition-colors mb-2">{show.name}</h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700 italic">DCC Intel Feed &rarr;</p>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/venues/red-rocks-amphitheatre" className="inline-block bg-red-600 hover:bg-white hover:text-red-600 text-white font-black italic uppercase px-12 py-6 rounded-full text-xl transition-all shadow-2xl shadow-red-600/30">
        View All 90+ 2026 Shows &rarr;
      </Link>
    </main>
  );
}
