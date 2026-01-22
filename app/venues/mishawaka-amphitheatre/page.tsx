import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";
import ArtistGuide from "@/components/ArtistGuide";

export const dynamic = 'force-dynamic';

export default async function MishawakaPage() {
  const venueId = "119"; // SeatGeek ID for Mishawaka
  const shows = await getVenueEvents(venueId);

  return (
    <main className="min-h-screen bg-black text-white p-12">
      <header className="mb-16">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-2">Mishawaka Amphitheatre</h1>
        <p className="text-red-600 font-bold uppercase tracking-widest text-sm">Bellvue, CO • Season Calendar</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="bg-zinc-900/40 p-10 rounded-[3rem] border border-white/5 mb-12">
            <h2 className="text-red-600 font-black uppercase text-xs mb-6 tracking-widest text-zinc-500 italic">Venue Spotlight</h2>
            {/* FIX: Removed 'venue' prop to resolve TypeScript error */}
            <ArtistGuide artistName="Mishawaka Amphitheatre" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shows.map((show) => (
              <Link key={show.id} href={`/shows/${show.id}`} className="group bg-zinc-900/50 border border-white/10 rounded-3xl p-8 hover:border-red-600 transition-all duration-500">
                <div className="text-zinc-500 text-[10px] font-black uppercase mb-4 tracking-widest">
                  {new Date(show.datetime_local).toLocaleDateString()}
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight group-hover:text-red-600 transition">{show.title}</h3>
                <p className="text-zinc-600 text-xs mt-6 uppercase font-bold tracking-widest">Book Shuttle →</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
           <div className="bg-zinc-900/60 p-10 rounded-[3rem] border border-white/5 shadow-2xl sticky top-12">
            <h3 className="text-3xl font-black italic uppercase mb-8 tracking-tighter leading-none">Transportation</h3>
            <p className="text-zinc-400 text-sm mb-8 font-medium italic">Private shuttle service available for all Mishawaka events. Safe mountain transit from Fort Collins and surrounding areas.</p>
            <Link href="/private-suburban" className="block w-full bg-red-600 text-white text-center py-4 rounded-full font-black uppercase italic hover:bg-red-700 transition">
              Request Private SUV
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
