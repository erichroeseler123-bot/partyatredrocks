import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";

const VENUE_DATA: Record<string, { name: string; id: string; location: string }> = {
  "red-rocks-amphitheatre": { name: "Red Rocks", id: "196", location: "Morrison, CO" },
  "mishawaka-amphitheatre": { name: "Mishawaka", id: "119", location: "Bellvue, CO" },
  "mission-ballroom": { name: "Mission Ballroom", id: "428753", location: "Denver, CO" }
  // Add other venues as needed...
};

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = VENUE_DATA[slug];

  if (!venue) notFound();

  const shows = await getVenueEvents(venue.id);

  // Logic to group shows by Month
  const groupedShows = shows.reduce((acc: any, show) => {
    const month = new Date(show.datetime_local).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(show);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-black text-white p-12">
      <header className="mb-12">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter">{venue.name}</h1>
        <p className="text-red-600 font-bold uppercase tracking-widest text-sm">{venue.location}</p>
      </header>

      {Object.keys(groupedShows).map((month) => (
        <section key={month} className="mb-16">
          <h2 className="text-3xl font-black italic uppercase mb-8 border-b border-white/10 pb-2 text-zinc-500">
            {month}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedShows[month].map((show: any) => (
              <Link key={show.id} href={`/shows/${show.id}`} className="group bg-zinc-900/50 border border-white/10 rounded-3xl p-6 hover:border-red-600 transition">
                <div className="text-zinc-500 text-[10px] font-black uppercase mb-2">
                  {new Date(show.datetime_local).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-black italic uppercase group-hover:text-red-600 transition">{show.title}</h3>
                <p className="text-zinc-600 text-xs mt-4 uppercase font-bold">Book Shuttle →</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
