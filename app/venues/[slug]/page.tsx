import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";

const VENUE_DATA: Record<string, { name: string; id: string; location: string }> = {
  "red-rocks-amphitheatre": { 
    name: "Red Rocks Amphitheatre", 
    id: "196", 
    location: "Morrison, CO" 
  },
};

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Next.js 16 requires awaiting params
  const venue = VENUE_DATA[slug];

  if (!venue) return notFound();

  const shows = await getVenueEvents(venue.id);

  // FIXED: Explicit 'any' for the 'show' parameter to pass the TypeScript build check
  const groupedShows = shows.reduce((acc: Record<string, any[]>, show: any) => {
    const monthYear = new Date(show.datetime_local).toLocaleString('default', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(show);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-black text-white p-12">
      <div className="mb-16 border-b border-white/5 pb-10">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter">{venue.name}</h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest mt-4 italic">{venue.location} // Venue ID: {venue.id}</p>
      </div>

      <div className="space-y-16">
        {Object.entries(groupedShows).map(([month, monthShows]: [string, any]) => (
          <section key={month}>
            <h2 className="text-red-600 font-black uppercase text-xs mb-8 tracking-[0.4em] italic border-l-4 border-red-600 pl-4">
              {month}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monthShows.map((show: any) => (
                <Link 
                  key={show.id} 
                  href={`/shows/${show.id}`}
                  className="group bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-yellow-400/50 transition-all duration-500"
                >
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-4 tracking-widest">
                    {new Date(show.datetime_local).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <h3 className="text-2xl font-black italic uppercase leading-none group-hover:text-yellow-400 transition-colors">
                    {show.title}
                  </h3>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Intelligence View &rarr;</span>
                    {show.stats.lowest_price && (
                      <span className="text-yellow-400 font-black italic">${show.stats.lowest_price}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
