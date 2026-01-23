import Link from 'next/link';

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
    img: "https://seatgeek.com/images/performers-landscape/inzo-2a3b4c/123456/huge.jpg" 
  }
];

export default function DispatchHub() {
  return (
    <main className="min-h-screen bg-black text-white p-12">
      <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-20">Party @ Red Rocks! dispatch hub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {FEATURED.map((show) => (
          <Link key={show.id} href={`/shows/${show.id}`} className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-3 hover:border-red-600 transition-all">
            <div className="relative h-64 overflow-hidden rounded-2xl">
              <img src={show.img} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <p className="absolute bottom-6 left-6 text-sm font-black italic uppercase text-red-600">{show.date}</p>
            </div>
            <div className="p-6">
              <h3 className="text-3xl font-black italic uppercase group-hover:text-red-600 tracking-tighter">{show.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
