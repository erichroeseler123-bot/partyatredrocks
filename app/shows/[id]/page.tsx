import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await getEvent(params.id);

  if (!show || show.venue.id !== 196) {
    return <main className="min-h-screen bg-black text-white flex items-center justify-center p-20">
      <h1 className="text-2xl font-black uppercase italic text-red-600">Event Offline</h1>
    </main>;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="p-12 border-b border-white/5 flex justify-between items-end">
        <div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">{show.title}</h1>
          <p className="text-zinc-600 font-bold uppercase mt-4 tracking-widest italic">Morrison, CO // Red Rocks</p>
        </div>
        <div className="text-right border-l border-zinc-900 pl-10">
          <p className="text-zinc-600 uppercase font-black text-[10px] tracking-widest mb-1">DCC Price Watch</p>
          <p className="text-5xl font-black italic text-yellow-400">${show.stats.lowest_price || "TBA"}</p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4">
          <TicketButtons event={show} />
        </div>
        <div className="col-span-12 lg:col-span-8">
          <section id="booking" className="bg-zinc-900/40 p-10 rounded-[4rem] border border-white/5 min-h-[500px] scroll-mt-24">
             <p className="text-zinc-500 font-black uppercase italic">Secure Destination Shuttle</p>
             {/* Rezdy Widget Loads Here */}
          </section>
        </div>
      </div>
    </main>
  );
}
