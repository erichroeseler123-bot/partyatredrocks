import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";
import ArtistGuide from "@/components/ArtistGuide";

export default async function MishawakaPage() {
  // Hardcoded Venue ID for Mishawaka
  const shows = await getVenueEvents("1562");

  return (
    <main className="min-h-screen bg-black text-white p-12">
      <div className="mb-16">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter">Mishawaka Amphitheatre</h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest mt-4 italic">Bellvue, CO // Venue 384</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FIXED: Added ': any' to 'show' to satisfy the TypeScript build check */}
        {shows.map((show: any) => (
          <Link 
            key={show.id} 
            href={`/shows/${show.id}`} 
            className="group bg-zinc-900/50 border border-white/10 rounded-3xl p-8 hover:border-red-600 transition-all duration-500"
          >
            <div className="text-zinc-500 text-[10px] font-black uppercase mb-4 tracking-widest">
              {new Date(show.datetime_local).toLocaleDateString()}
            </div>
            <h3 className="text-2xl font-black italic uppercase leading-none group-hover:text-red-600 transition-colors">
              {show.title}
            </h3>
          </Link>
        ))}
      </div>
    </main>
  );
}
