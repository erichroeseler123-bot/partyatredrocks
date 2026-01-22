import { getEvent } from "@/lib/seatgeek";
import { getProbableSetlist } from "@/lib/setlists";
import Link from "next/link";
import RezdyWidget from "@/components/RezdyWidget";
import { notFound } from "next/navigation";

export default async function ShowPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);
  if (!event) return notFound();

  const artistName = event.performers[0]?.name;
  const setlist = await getProbableSetlist(artistName);

  return (
    <main className="min-h-screen bg-black text-white relative">
      <div className="h-[60vh] w-full relative">
        <img src={event.performers[0]?.image} className="w-full h-full object-cover opacity-60" alt={event.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-20 left-6 md:left-20">
          <Link href="/venues/red-rocks-amphitheatre" className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 hover:text-white transition-colors">
            ← Back to Red Rocks Dispatch
          </Link>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter mt-4 leading-none">{event.title}</h1>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <div className="border border-white/5 bg-zinc-950/50 p-12 rounded-[3rem] backdrop-blur-md">
            <h2 className="text-4xl font-black italic uppercase mb-8 tracking-tighter">Secure Shuttle Dispatch</h2>
            <RezdyWidget />
          </div>
        </div>

        <div className="space-y-12">
          <div className="border border-white/5 p-8 rounded-[2rem] bg-zinc-900/30">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-600 mb-6 italic">Probable Setlist / Intelligence</h3>
            <div className="space-y-4 font-mono text-[11px] uppercase">
              {setlist.length > 0 ? setlist.map((song: any, i: number) => (
                <p key={i} className="border-b border-white/5 pb-2 text-zinc-300">
                  <span className="text-zinc-600 mr-2">{(i + 1).toString().padStart(2, '0')}</span> {song.name}
                </p>
              )) : (
                <p className="text-zinc-600 italic">No recent setlist data uplinked.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
