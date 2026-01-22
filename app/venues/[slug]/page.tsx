import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";
import { VENUES } from "@/data/venues";

export const revalidate = 3600;

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  // CRITICAL FIX: Await the dynamic params
  const { slug } = await params;

if (slug === "red-rocks-amphitheatre") {
    const shows = await getVenueEvents(196);
    return (
      <main className="min-h-screen bg-black text-white px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-16 border-b border-white/5 pb-12">
            <div>
               <h1 className="text-6xl font-black italic uppercase tracking-tighter">Party @ Red Rocks</h1>
               <p className="text-red-600 font-black uppercase text-[10px] tracking-[0.4em] mt-2">Live Show Dispatch</p>
            </div>
            <Link href="/" className="bg-white text-black px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all">
              Back to Hub
            </Link>
          </header>

          <div className="grid gap-6">
            {shows.map((show) => (
              <Link key={show.id} href={`/shows/${show.id}`} className="group relative flex flex-col md:flex-row items-center gap-8 border border-white/5 bg-zinc-950/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden hover:border-red-600/40 transition-all">
                {/* Full Color Performer Image */}
                <div className="w-full md:w-64 h-48 relative overflow-hidden">
                  <img 
                    src={show.performers[0]?.image || '/hero/transport.jpg'} 
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="flex-1 p-8 md:p-0">
                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em] mb-2">
                    {new Date(show.datetime_local).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-red-500 transition-colors">
                    {show.title}
                  </h3>
                </div>

                <div className="pr-12 hidden md:block">
                   <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                   </div>
                </div>
              </Link>
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
