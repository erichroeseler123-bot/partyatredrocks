import Link from 'next/link';

const venues = [
  { name: "Mission Ballroom", slug: "mission-ballroom", loc: "RiNo" },
  { name: "Ball Arena", slug: "ball-arena", loc: "Downtown" },
  { name: "Fiddler's Green", slug: "fiddlers-green", loc: "DTC" },
  { name: "Fillmore Auditorium", slug: "fillmore-auditorium", loc: "Colfax" },
  { name: "Ogden Theatre", slug: "ogden-theatre", loc: "Colfax" }
];

export default function AllVenueHub() {
  return (
    <div className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-4">
          All-Venue <span className="text-red-600">City Service</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-16 font-medium max-w-2xl">
          $50 per person ($250 min). Professional door-to-door transport for every major stage in Denver and Boulder.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {venues.map((v) => (
            <Link key={v.slug} href={`/venues/${v.slug}`} className="group p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] hover:border-red-600 transition-all">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black uppercase italic">{v.name}</h3>
                <span className="text-[10px] font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-500 uppercase">{v.loc}</span>
              </div>
              <span className="text-red-600 font-bold uppercase tracking-widest text-[10px] group-hover:underline">View Schedule & Logistics →</span>
            </Link>
          ))}
        </div>

        <div className="bg-red-600 p-12 rounded-[3rem] text-center shadow-2xl">
          <h2 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">Ready to Book?</h2>
          <p className="text-red-100 mb-8 font-medium">Flat-rate Suburban service for groups up to 6.</p>
          <Link href="/book-all-venue" className="bg-white text-red-600 px-10 py-4 rounded-full font-black uppercase hover:bg-zinc-100 transition shadow-lg inline-block">
            Book City Service — $250 Min
          </Link>
        </div>
      </div>
    </div>
  );
}
