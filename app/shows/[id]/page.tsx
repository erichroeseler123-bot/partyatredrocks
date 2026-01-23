import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await getEvent(params.id);

  if (!show || show.venue.id !== 196) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-20">
        <h1 className="text-xl font-black uppercase italic text-red-600 tracking-widest">Event Intelligence Offline</h1>
      </main>
    );
  }

  const performer = show.performers[0];
  const eventDate = new Date(show.datetime_local);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* 1. HERO IMAGE RESTORATION */}
      <div className="relative h-[50vh] w-full overflow-hidden border-b border-white/10">
        <img 
          src={performer?.image || "/hero-bg.jpg"} 
          alt={show.title}
          className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12 flex justify-between items-end">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">{show.title}</h1>
            {/* 2. TIME \u0026 VENUE LINK RESTORATION */}
            <div className="flex gap-6 items-center">
              <p className="text-red-600 font-black uppercase tracking-[0.3em] text-sm italic">
                {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} @ {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <a 
                href="https://www.google.com/maps/search/?api=1\u0026query=Red+Rocks+Amphitheatre" 
                target="_blank"
                className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition"
              >
                View Map + Directions
              </a>
            </div>
          </div>
          <div className="text-right border-l border-white/20 pl-10 hidden md:block">
            <p className="text-zinc-500 uppercase font-black text-[10px] tracking-widest mb-1">DCC Price Watch</p>
            <p className="text-6xl font-black italic text-yellow-400">
              ${show.stats.lowest_price || show.stats.average_price || "TBA"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-10">
          <TicketButtons event={show} />
          
          {/* 3. ARTIST INTELLIGENCE BACKSTORY RESTORATION */}
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 shadow-2xl">
            <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em] mb-6 italic">Artist Intelligence</h3>
            <p className="text-zinc-300 text-lg leading-relaxed font-medium italic">
              {performer?.name} is descending on Morrison for a high-altitude set at Venue 196. 
              As part of the DCC live intelligence feed, we recommend securing your shuttle before 
              the 2026 surge pricing takes effect.
            </p>
            <div className="mt-8 pt-8 border-t border-white/5">
               <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Global Popularity Index</p>
               <p className="text-white font-black italic text-2xl uppercase">{performer?.popularity}% Tracking</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          {/* 4. LIVE REZDY WIDGETS */}
          <section id="booking" className="bg-zinc-900/40 p-2 rounded-[3.5rem] border border-white/5 min-h-[1200px] scroll-mt-24 shadow-inner">
            <RezdyWidgets />
          </section>
        </div>
      </div>
    </main>
  );
}
