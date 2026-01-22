import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";

// Data map for all verified Colorado venues
const VENUE_DATA: Record<string, { name: string; id: string; location: string }> = {
  "red-rocks-amphitheatre": { name: "Red Rocks", id: "196", location: "Morrison, CO" },
  "mishawaka-amphitheatre": { name: "Mishawaka", id: "119", location: "Bellvue, CO" },
  "mission-ballroom": { name: "Mission Ballroom", id: "428753", location: "Denver, CO" },
  "fiddlers-green-amphitheatre": { name: "Fiddler's Green", id: "1221", location: "Englewood, CO" },
  "fillmore-auditorium": { name: "Fillmore Auditorium", id: "424", location: "Denver, CO" },
  "ogden-theatre": { name: "Ogden Theatre", id: "422", location: "Denver, CO" },
  "bluebird-theater": { name: "Bluebird Theater", id: "423", location: "Denver, CO" },
  "gothic-theatre": { name: "Gothic Theatre", id: "1218", location: "Englewood, CO" },
  "summit-denver": { name: "Summit Denver", id: "14757", location: "Denver, CO" },
  "cervantes-masterpiece": { name: "Cervantes' Masterpiece", id: "10094", location: "Denver, CO" },
  "dillon-amphitheater": { name: "Dillon Amphitheater", id: "341857", location: "Dillon, CO" },
  "vail-amp": { name: "Gerald R. Ford Amphitheater", id: "2795", location: "Vail, CO" }
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = VENUE_DATA[slug];

  if (!venue) {
    notFound();
  }

  // Passing the ID as a string in quotes to satisfy the TypeScript compiler
  const shows = await getVenueEvents(venue.id);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-2">
              {venue.name}
            </h1>
            <p className="text-red-600 font-bold uppercase tracking-widest text-sm">
              {venue.location} • Upcoming Events
            </p>
          </div>
          <Link href="/venues" className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-zinc-200 transition">
            Back to All Venues
          </Link>
        </header>

        {shows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <Link key={show.id} href={`/shows/${show.id}`} className="group bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden hover:border-red-600 transition duration-500">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={show.performers[0]?.image || '/hero/transport.jpg'} 
                    alt={show.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {new Date(show.datetime_local).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-tight mb-4 group-hover:text-red-600 transition">
                    {show.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">View Shuttles</span>
                    <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-red-600 transition">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-zinc-900/30 rounded-3xl border border-white/5">
            <p className="text-zinc-500 italic uppercase tracking-widest">No upcoming shows scheduled for this venue.</p>
          </div>
        )}
      </div>
    </main>
  );
}
