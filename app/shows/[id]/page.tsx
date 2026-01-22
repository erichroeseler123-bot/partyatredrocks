import { getEvent } from "@/lib/seatgeek";
import { getProbableSetlist } from "@/lib/setlists";
import Link from "next/link";
import RezdyWidget from "@/components/RezdyWidget";
import { notFound } from "next/navigation";

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params for Next.js 15+
  const event = await getEvent(id);
  if (!event) return notFound();

  const artistName = event.performers[0]?.name;
  const setlist = await getProbableSetlist(artistName);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600">
      {/* Full Color Artist Header */}
      <div className="h-[50vh] w-full relative">
        <img 
          src={event.performers[0]?.image} 
          className="w-full h-full object-cover opacity-70" 
          alt={event.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-6 md:left-20 max-w-4xl">
          <Link href="/venues/red-rocks-amphitheatre" className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 hover:text-white transition-all">
            ← RED ROCKS DISPATCH
          </Link>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mt-6 leading-none">
            {event.title}
          </h1>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Booking Terminal */}
        <div className="lg:col-span-2 space-y-8">
          <div className="border border-white/5 bg-zinc-950/50 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md">
            <h2 className="text-3xl font-black italic uppercase mb-8 tracking-tighter">Secure Shuttle Dispatch</h2>
            <RezdyWidget productId="" /> 
          </div>
        </div>

        {/* Right Column: Artist Intelligence */}
        <div className="border border-white/5 p-8 rounded-[2rem] bg-zinc-900/20 h-fit">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-8 italic">Artist Intelligence</h3>
          <div className="space-y-4 font-mono text-[11px] uppercase text-zinc-400">
            {setlist && setlist.length > 0 ? setlist.map((song: any, i: number) => (
              <p key={i} className="border-b border-white/5 pb-2">
                <span className="text-zinc-700 mr-3">{(i + 1).toString().padStart(2, '0')}</span> {song.name}
              </p>
            )) : <p className="italic text-zinc-700">Setlist uplink unavailable.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
