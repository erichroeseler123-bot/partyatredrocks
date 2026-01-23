import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await getEvent(params.id);

  if (!show || show.venue.id !== 196) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-20">
        <h1 className="text-xl font-black uppercase italic text-red-600">Event Intelligence Offline</h1>
      </main>
    );
  }

  const performer = show.performers[0];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER WITH ARTIST IMAGE */}
      <div className="relative h-[40vh] w-full overflow-hidden border-b border-white/10">
        <img 
          src={performer?.image || "/hero-bg.jpg"} 
          alt={show.title}
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black to-transparent flex justify-between items-end">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">{show.title}</h1>
            <p className="text-zinc-400 font-bold uppercase mt-4 tracking-[0.3em] italic">Morrison, CO // Venue 196</p>
          </div>
          <div className="text-right border-l border-white/20 pl-10">
            <p className="text-zinc-500 uppercase font-black text-[10px] tracking-widest mb-1">DCC Price Watch</p>
            <p className="text-5xl font-black italic text-yellow-400">
              ${show.stats.lowest_price || show.stats.average_price || "TBA"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-10">
          <TicketButtons event={show} />
          
          {/* AI DESCRIPTION BOX */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5">
            <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.3em] mb-4 italic">Artist Intelligence</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
              Intelligence for {performer?.name || "this artist"} at Red Rocks is being live-streamed. 
              Secure your transportation early to avoid the $499 surge.
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <section id="booking" className="bg-zinc-900/40 p-2 rounded-[3.5rem] border border-white/5 min-h-[1200px] scroll-mt-24">
            <RezdyWidgets />
          </section>
        </div>
      </div>
    </main>
  );
}
