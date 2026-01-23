import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";

// Next.js 16: params is a Promise
export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await getEvent(params.id);

  if (!show || show.venue.id !== 196) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-xl font-black uppercase italic text-red-600">Event Offline</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between items-end border-b border-white/5 pb-10 mb-10">
        <div className="max-w-4xl">
           <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">{show.title}</h1>
           <p className="text-zinc-500 font-bold uppercase mt-4 tracking-widest italic">Morrison, CO // Venue 196</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-600 uppercase font-black text-[10px] tracking-widest mb-1">DCC Price Watch</p>
          <p className="text-4xl font-black italic text-yellow-400">
            ${show.stats.lowest_price || "TBA"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1">
          <TicketButtons event={show} />
        </div>
        <div className="md:col-span-2">
           <section id="booking" className="bg-zinc-900/50 p-10 rounded-[3rem] border border-white/5 min-h-[400px] scroll-mt-20">
             <p className="text-zinc-500 uppercase font-black italic mb-4">Secure Destination Shuttle</p>
             {/* Rezdy Widget will load here */}
           </section>
        </div>
      </div>
    </main>
  );
}
