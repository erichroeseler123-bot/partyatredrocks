import Link from 'next/link';

const venues = [
  { name: "Mission Ballroom", slug: "mission-ballroom", loc: "RiNo" },
  { name: "Ball Arena", slug: "ball-arena", loc: "Downtown" },
  { name: "Fiddler's Green", slug: "fiddlers-green", loc: "DTC" },
  { name: "Fillmore Auditorium", slug: "fillmore-auditorium", loc: "Colfax" },
  { name: "Ogden Theatre", slug: "ogden-theatre", loc: "Colfax" },
  { name: "Bluebird Theater", slug: "bluebird-theater", loc: "East Colfax" },
  { name: "Paramount Theatre", slug: "paramount-theatre", loc: "Downtown" },
  { name: "Summit Music Hall", slug: "summit-music-hall", loc: "LoDo" },
  { name: "Marquis Theater", slug: "marquis-theater", loc: "Downtown" },
  { name: "Gothic Theatre", slug: "gothic-theatre", loc: "Englewood" },
  { name: "Cervantes' Masterpiece", slug: "cervantes-masterpiece", loc: "Five Points" },
  { name: "Boulder Theater", slug: "boulder-theater", loc: "Boulder" },
  { name: "Fox Theatre", slug: "fox-theatre", loc: "Boulder" },
  { name: "Meow Wolf Denver", slug: "meow-wolf-denver", loc: "Sun Valley" },
  { name: "Ophelia's Electric Soapbox", slug: "ophelias-electric-soapbox", loc: "LoDo" },
  { name: "Chautauqua Auditorium", slug: "chautauqua-auditorium", loc: "Boulder" },
  { name: "Macky Auditorium", slug: "macky-auditorium", loc: "Boulder" },
  { name: "Velvet Elk Lounge", slug: "velvet-elk-lounge", loc: "Boulder" },
  { name: "Empower Field", slug: "empower-field", loc: "Denver" },
  { name: "Dick's Sporting Goods Park", slug: "dick-sporting-goods-park", loc: "Commerce City" },
  { name: "Folsom Field", slug: "folsom-field", loc: "Boulder" }
];

export default function AllVenueHub() {
  return (
    <div className="min-h-screen bg-surface text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-4">
          All-Venue <span className="text-red-600">City Service</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-16 font-medium max-w-3xl leading-relaxed">
          $50 per person ($250 min). Professional door-to-door transport for any group size. No passenger maximum.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {venues.map((v) => (
            <Link key={v.slug} href={`/venues/${v.slug}`} className="group p-8 bg-surface-strong/40 border border-zinc-800 rounded-[2.5rem] hover:border-red-600 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black uppercase italic leading-tight">{v.name}</h3>
                  <span className="text-[10px] font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-500 uppercase">{v.loc}</span>
                </div>
                <p className="text-zinc-500 text-sm mb-6 font-medium">Professional transport and post-show waiting service for this venue.</p>
              </div>
              <span className="text-red-600 font-bold uppercase tracking-widest text-[10px] group-hover:underline">View Schedule & Intel →</span>
            </Link>
          ))}
        </div>

        <div className="bg-red-600 p-12 rounded-[3rem] text-center shadow-2xl">
          <h2 className="text-4xl font-black mb-4 uppercase italic tracking-tighter text-white">Secure Your Ride</h2>
          <p className="text-red-100 mb-10 font-medium text-lg max-w-xl mx-auto">
            Door-to-door fleet service for solo riders or massive groups. $50/person with a $250 total minimum.
          </p>
          <Link href="/book-all-venue" className="bg-white text-red-600 px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-zinc-100 transition shadow-xl inline-block transform hover:scale-105">
            Book City Service — $250 Min
          </Link>
        </div>
      </div>
    </div>
  );
}
