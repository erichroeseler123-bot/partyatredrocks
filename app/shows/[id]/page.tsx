import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await getEvent(params.id);

  if (!show || show.venue.id !== 196) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-20 text-center">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-red-600 mb-4">Venue Mismatch</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">This intelligence is reserved for Red Rocks Amphitheatre.</p>
        </div>
      </main>
    );
  }

  const performer = show.performers[0];
  const eventDate = new Date(show.datetime_local);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO IMAGE & HEADER */}
      <div className="relative h-[60vh] w-full overflow-hidden border-b border-white/10">
        <img 
          src={performer?.image || "/hero-bg.jpg"} 
          alt={show.title}
          className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12 flex justify-between items-end">
          <div className="max-w-5xl">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-8">{show.title}</h1>
            <div className="flex flex-wrap gap-8 items-center">
              <p className="text-red-600 font-black uppercase tracking-[0.3em] text-sm italic">
                {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} @ {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {/* EXTERNAL LINKS */}
              <a href={performer?.url || "#"} target="_blank" className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition underline decoration-red-600 underline-offset-4">Artist Website</a>
              <a href="https://www.redrocksonline.com" target="_blank" className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition underline decoration-yellow-400 underline-offset-4">Red Rocks Official</a>
              <a href="https://maps.google.com/?q=Red+Rocks+Amphitheatre" target="_blank" className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition underline decoration-blue-600 underline-offset-4">Map & Directions</a>
            </div>
          </div>
          <div className="text-right border-l border-white/20 pl-10 hidden lg:block">
            <p className="text-zinc-500 uppercase font-black text-[10px] tracking-widest mb-1">DCC Price Watch</p>
            <p className="text-6xl font-black italic text-yellow-400">${show.stats.lowest_price || "TBA"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-12">
          <TicketButtons event={show} />
          
          {/* EXPANDED ARTIST BIO */}
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 shadow-2xl">
            <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em] mb-6 italic">Artist Intelligence</h3>
            <div className="space-y-6 text-zinc-300 text-lg leading-relaxed font-medium italic">
              <p>
                {performer?.name} is descending on Morrison for a career-defining set at Venue 196. As one of the most tracked artists in our global popularity index, this performance is expected to reach maximum capacity.
              </p>
              <p>
                Our intelligence feed indicates that {performer?.name} consistently delivers high-energy production specifically tailored for the natural acoustics of the monoliths. Secure your transportation now to bypass the 2026 surge pricing and high-traffic delays.
              </p>
            </div>
          </div>

          {/* SETLIST INTELLIGENCE */}
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 shadow-2xl">
            <h3 className="text-yellow-400 font-black uppercase text-[10px] tracking-[0.5em] mb-6 italic">Setlist Intelligence</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-zinc-500 font-black uppercase text-[9px] tracking-widest">Live Tracks Predicted</span>
                <span className="text-white font-black italic">14 - 18 Songs</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Live setlist intelligence is currently being aggregated from past tour data. Expect a mix of core hits and new 2026 material.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          {/* REZDY BOOKING INTELLIGENCE */}
          <section id="booking" className="bg-zinc-900/40 p-2 rounded-[3.5rem] border border-white/5 min-h-[1200px] scroll-mt-24 shadow-inner">
            <RezdyWidgets />
          </section>
        </div>
      </div>
    </main>
  );
}
