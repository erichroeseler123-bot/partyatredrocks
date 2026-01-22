import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";
import { VENUES } from "@/data/venues";

export const revalidate = 3600;

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  // CRITICAL FIX: Await the dynamic params
  const { slug } = await params;

  // 1. Specialized Red Rocks Dispatch
  if (slug === "red-rocks-amphitheatre") {
    const shows = await getVenueEvents(196);
    return (
      <main className="min-h-screen bg-black text-white px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-16 border-b border-white/10 pb-12">
            <div>
               <h1 className="text-5xl font-black italic uppercase tracking-tighter">Party @ Red Rocks</h1>
               <p className="text-red-600 font-black uppercase text-[10px] tracking-[0.3em] mt-2">Live Show Dispatch</p>
            </div>
            <Link href="/" className="bg-white text-black px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all">
              Back to Hub
            </Link>
          </header>

          <div className="grid gap-4">
            {shows.map((show) => (
              <div key={show.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-white/5 p-8 rounded-[2rem] bg-zinc-950/50 backdrop-blur-sm hover:border-red-600/30 transition-all group">
                <div>
                  <div className="text-2xl font-black uppercase italic tracking-tight mb-2 group-hover:text-red-600 transition-colors">{show.title}</div>
                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">
                    {new Date(show.datetime_local).toDateString()}
                  </div>
                </div>
                <Link href={`/book-shuttle?venue=red-rocks&eventId=${show.id}`} className="bg-white text-black hover:bg-red-600 hover:text-white px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest transition-all text-center">
                  Book Shuttle
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // 2. Specialized All Other Venues Dispatch
  if (slug === "all-venues") {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-16 border-b border-white/10 pb-12">
             <h1 className="text-5xl font-black italic uppercase tracking-tighter">Private Dispatch</h1>
             <Link href="/" className="bg-white text-black px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 hover:text-white transition-all">
               Back to Hub
             </Link>
          </header>

          <div className="bg-zinc-950/50 backdrop-blur-sm border border-white/5 p-16 rounded-[3rem]">
            <p className="text-3xl italic text-zinc-300 leading-tight mb-12 font-bold uppercase tracking-tighter">
              "$50 per person. $250 minimum total. One stop each way allowed. Cash at pickup."
            </p>
            <a href="tel:7203696292" className="inline-block bg-white text-black px-12 py-6 rounded-full font-black uppercase text-sm tracking-widest hover:bg-red-600 hover:text-white transition-all">
              Call Dispatch: (720) 369-6292
            </a>
          </div>
        </div>
      </main>
    );
  }

  // 3. Fallback logic for other dynamic slugs
  const venue = VENUES[slug];
  if (!venue) return notFound();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 text-center">
       <Link href="/" className="mb-12 inline-block text-zinc-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-all">← Back to Hub</Link>
      <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">{venue.name}</h1>
      <Link href={`/book-shuttle?venue=${slug}`} className="bg-white text-black px-14 py-7 rounded-full font-black uppercase text-sm tracking-widest hover:bg-red-600 hover:text-white transition-all">
        Book Shuttle
      </Link>
    </main>
  );
}
