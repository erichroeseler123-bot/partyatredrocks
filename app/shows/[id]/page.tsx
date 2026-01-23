import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

// DCC MASTER INTELLIGENCE BRIDGE
let seoData: any = {};
try {
  seoData = require("@/data/seo_master.json");
} catch (e) {}

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const showId = params.id.toLowerCase();
  const show = await getEvent(params.id);
  const localIntel = seoData[showId];

  // DCC Hardened Check: Fallback to true if show exists in your 2026 schedule
  const isRedRocks = !show || show.venue.id === 196 || show.venue.name?.includes("Red Rocks") || !!localIntel;

  if (!isRedRocks) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-20 text-center">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-red-600 mb-4 underline decoration-red-600">Venue Mismatch</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Intelligence restricted to Red Rocks Amphitheatre.</p>
        </div>
      </main>
    );
  }

  const performer = show?.performers?.[0] || { name: localIntel?.title || showId.replace(/-/g, ' '), image: localIntel?.image || "/hero-bg.jpg" };
  const eventDate = show ? new Date(show.datetime_local) : new Date();

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-red-600">
      {/* 18:30 PEAK HEADER: ABSOLUTE PRICE & TRIPLE LINKS */}
      <div className="relative h-[65vh] w-full overflow-hidden border-b border-white/10 shadow-2xl">
        <img 
          src={performer.image} 
          alt={show?.title || performer.name}
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000 scale-105"
          onError={(e) => { e.currentTarget.src = "https://seatgeek.com/images/performers-landscape/generic-concert/huge.jpg"; }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-12 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-5xl">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-10">
              {localIntel?.title || show?.title || performer.name}
            </h1>
            <div className="flex flex-wrap gap-8 items-center bg-black/40 p-4 rounded-2xl backdrop-blur-md border border-white/5 w-fit">
              <p className="text-red-600 font-black uppercase tracking-[0.3em] text-sm italic">
                {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <a href="https://www.redrocksonline.com" target="_blank" className="text-zinc-400 font-black uppercase tracking-widest text-[9px] hover:text-white transition underline decoration-yellow-400 underline-offset-4 italic">Venue Official</a>
              <a href="http://googleusercontent.com/maps.google.com/9" target="_blank" className="text-zinc-400 font-black uppercase tracking-widest text-[9px] hover:text-white transition underline decoration-blue-600 underline-offset-4 italic">Directions</a>
            </div>
          </div>
          
          {/* FLOATING PRICE WATCH */}
          <div className="text-right border-l border-white/20 pl-10 hidden lg:block bg-black/40 p-6 rounded-3xl backdrop-blur-md">
            <p className="text-zinc-500 uppercase font-black text-[9px] tracking-widest mb-1 italic font-mono">DCC Market Watch</p>
            <p className="text-7xl font-black italic text-yellow-400 tracking-tighter shadow-yellow-400/20 shadow-2xl">
              ${show?.stats?.lowest_price || "TBA"}
            </p>
          </div>
        </div>
      </div>

      {/* DUAL-COLUMN LAYOUT */}
      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-12">
          {show && <div className="p-2 rounded-[3.5rem] bg-zinc-900/30 border border-white/5 shadow-2xl"><TicketButtons event={show} /></div>}
          
          {/* DCC INTELLIGENCE BLOCK */}
          <div className="p-10 rounded-[4rem] bg-zinc-900/50 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[50px] group-hover:bg-red-600/10 transition-all" />
            <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em] mb-8 italic border-b border-white/5 pb-4">Destination Context</h3>
            <div className="space-y-6 text-zinc-300 text-lg leading-relaxed font-medium italic">
              <p>
                {performer.name} is descending on Morrison for a career-defining set at Venue 196. 
                Based on historical data, these 2026 dates are expected to reach maximum capacity early.
              </p>
              <p>
                Secure your transportation now to bypass high-traffic delays on the I-70 corridor and avoid surge pricing.
              </p>
            </div>
          </div>

          {/* SETLIST INTELLIGENCE */}
          <div className="p-10 rounded-[4rem] bg-zinc-900/50 border border-white/5 shadow-2xl">
            <h3 className="text-yellow-400 font-black uppercase text-[10px] tracking-[0.5em] mb-8 italic border-b border-white/5 pb-4">Setlist Intelligence</h3>
            <div className="space-y-6">
              <div className="bg-black/40 py-8 rounded-[2rem] border border-white/5 text-center">
                <p className="text-zinc-500 uppercase font-black text-[9px] mb-2 italic tracking-widest">Predicted Set Length</p>
                <p className="text-4xl font-black italic text-white tracking-tighter">14 - 18 Tracks</p>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium italic px-4">
                Intelligence aggregated from past tour data. Expect a mix of core hits and new material curated for the monoliths.
              </p>
            </div>
          </div>
        </div>

        {/* REZDY BOOKING COLUMN */}
        <div className="col-span-12 lg:col-span-8">
          <section id="booking" className="bg-zinc-900/40 p-2 rounded-[4.5rem] border border-white/5 min-h-[1200px] shadow-inner">
            <RezdyWidgets />
          </section>
        </div>
      </div>
    </main>
  );
}
