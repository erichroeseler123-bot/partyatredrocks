import { getEvent } from "@/lib/seatgeek";
import { getProbableSetlist } from "@/lib/setlists";
import Link from "next/link";
import CustomBooking from "@/components/CustomBooking";
import { notFound } from "next/navigation";

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return notFound();

  const artistName = event.performers[0]?.name;
  const setlist = await getProbableSetlist(artistName);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="h-[40vh] w-full relative">
        <img src={event.performers[0]?.image} className="w-full h-full object-cover" alt={artistName} />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-10 left-6 md:left-20">
          <Link href="/venues/red-rocks-amphitheatre" className="text-sm font-bold text-red-600 uppercase tracking-widest hover:text-white transition">
            Red Rocks Amphitheatre
          </Link>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase">
            {event.title}
          </h1>
        </div>
      </div>
      
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* This now dynamically loads all GoSno and Red Rocks products */}
          <CustomBooking />
        </div>
        
        <div className="border border-white/5 p-8 rounded-2xl bg-zinc-950/50 backdrop-blur-md">
          <h3 className="text-[10px] font-black uppercase text-red-600 mb-6 tracking-[0.2em]">
            Probable Setlist
          </h3>
          <div className="space-y-2 font-mono text-[10px] uppercase text-zinc-400">
            {setlist?.length > 0 ? (
              setlist.map((s: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <span className="text-zinc-600">{(i + 1).toString().padStart(2, '0')}</span>
                  <span>{s.title}</span>
                </div>
              ))
            ) : (
              <p>Setlist data unavailable</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
