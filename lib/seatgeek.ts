import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";

const VENUE_DATA: Record<string, { name: string; id: string; location: string }> = {
  "red-rocks-amphitheatre": { name: "Red Rocks", id: "196", location: "Morrison, CO" },
  "mishawaka-amphitheatre": { name: "Mishawaka", id: "119", location: "Bellvue, CO" },
  "mission-ballroom": { name: "Mission Ballroom", id: "428753", location: "Denver, CO" }
};

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = VENUE_DATA[slug];

  if (!venue) notFound();

  const shows = await getVenueEvents(venue.id);

  // Grouping logic: Organize shows by "Month Year"
  const groupedShows = shows.reduce((acc: Record<string, any[]>, show) => {
    const date = new Date(show.datetime_local);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(show);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-black text-white p-12">
      <header className="mb-16">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-2">{venue.name}</h1>
        <p className="text-red-600 font-bold uppercase tracking-widest text-sm">{venue.location} • Full Schedule</p>
      </header>

      {Object.keys(groupedShows).length > 0 ? (
        Object.keys(groupedShows).map((month) => (
          <section key={month} className="mb-20">
            {/* Monthly Header */}
            <h2 className="text-4xl font-black italic uppercase mb-8 border-b border-white/10 pb-4 text-zinc-700 tracking-tighter">
              {month}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedShows[month].map((show) => (
                <Link key={show.id} href={`/shows/${show.id}`} className="group bg-zinc-900/50 border border-white/10 rounded-3xl p-8 hover:border-red-600 transition-all duration-500">
                  <div className="text-zinc-500 text-[10px] font-black uppercase mb-4 tracking-widest">
                    {new Date(show.datetime_local).toLocaleDateString()}
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight leading-tight group-hover:text-red-600 transition">
                    {show.title}
                  </h3>
                  <p className="text-zinc-600 text-xs mt-6 uppercase font-bold tracking-widest group-hover:text-white transition">
                    Book Shuttle →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-20 bg-zinc-900/20 rounded-3xl italic text-zinc-600 uppercase tracking-widest">
          No shows found for this venue.
        </div>
      )}
    </main>
  );
}
