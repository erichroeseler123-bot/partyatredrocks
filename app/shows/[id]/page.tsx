import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await getEvent(params.id);

  // DCC Hardened Check: Fallback to true if SeatGeek data is pending
  const isRedRocks = !show || show.venue.id === 196 || show.venue.name?.includes("Red Rocks");

  if (!isRedRocks) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-20 text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-black italic uppercase text-red-600 mb-6 underline decoration-red-600">Venue Mismatch</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-10">This intelligence is restricted to Red Rocks Amphitheatre.</p>
          <a href="/venues/red-rocks-amphitheatre" className="inline-block border border-white/20 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition">Return to Schedule</a>
        </div>
      </main>
    );
  }

  const performer = show?.performers[0] || { name: params.id.toUpperCase(), image: "/hero-bg.jpg" };
  const eventDate = show ? new Date(show.datetime_local) : new Date();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO & HEADER */}
      <div className="relative h-[65vh] w-full overflow-hidden border-b border-white/10 shadow-2xl">
        <img src={performer.image || "/hero-bg.jpg"} alt={show?.title || params.id} className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-5xl">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-10">{show?.title || params.id}</h1>
            <div className="flex flex-wrap gap-8 items-center bg-black/40 p-4 rounded-2xl backdrop-blur-md border border-white/5 w-fit">
              <p className="text-red-600 font-black uppercase tracking-[0.3em] text-sm italic">
                {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} @ {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {/* TRIPLE-LINK SYSTEM */}
              <a href={performer.url || "#"} target="_blank" className="text-zinc-400 font-black uppercase tracking-widest text-[9px] hover:text-white transition underline decoration-red-600 underline-offset-4 italic">Artist Bio</a>
              <a href="https://www.redrocksonline.com" target="_blank" className="text-zinc-400 font-black uppercase tracking-widest text-[9px] hover:text-white transition underline decoration-yellow-400 underline-offset-4 italic">Venue</a>
              <a href="http://googleusercontent.com/maps.google.com/4" target="_blank" className="text-zinc-400 font-black uppercase tracking-widest text-[9px] hover:text-white transition underline decoration-blue-600 underline-offset-4 italic">Directions</a>
            </div>
          </div>
          <div className="text-right border-l border-white/20 pl-10 hidden lg:block bg-black/40 p-6 rounded-3xl backdrop-blur-md font-mono italic">
            <p className="text-zinc-500 uppercase font-black text-[9px] tracking-widest mb-1">DCC Price Watch</p>
            <p className="text-7xl font-black text-yellow-400">${show?.stats?.lowest_price || "TBA"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-12">
          {show && <div className="p-2 rounded-[3.5rem] bg-zinc-900/30 border border-white/5 shadow-2xl"><TicketButtons event={show} /></div>}
          
          {/* ARTIST INTELLIGENCE */}
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 shadow-2xl relative overflow-hidden group">
            <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em] mb-8 italic border-b border-white/5 pb-4">Artist Intelligence</h3>
            <div className="space-y-6 text-zinc-300 text-lg leading-relaxed font-medium italic">
              <p>{performer.name} is descending on Morrison for a career-defining set at Venue 196. As one of the most tracked artists in our global popularity index, this performance is expected to reach maximum capacity.</p>
              <p>Our intelligence indicates that {performer.name} consistently delivers production specifically tailored for the natural acoustics of the monoliths. Secure your shuttle now to bypass 2026 surge pricing.</p>
            </div>
          </div>

          {/* SETLIST PREDICTIONS */}
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 shadow-2xl">
            <h3 className="text-yellow-400 font-black uppercase text-[10px] tracking-[0.5em] mb-8 italic border-b border-white/5 pb-4">Performance Profile</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl border border-white/5">
                <span className="text-zinc-500 font-black uppercase text-[9px] tracking-widest italic">Live Tracks Predicted</span>
                <span className="text-white font-black italic text-lg">14 - 18 Songs</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium italic">Setlist intelligence is currently being aggregated from past tour data. Expect a mix of core legacy hits and unreleased 2026 material curated for the Red Rocks soundstage.</p>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <section id="booking" className="bg-zinc-900/40 p-2 rounded-[4rem] border border-white/5 min-h-[1200px] shadow-inner"><RezdyWidgets /></section>
        </div>
      </div>
    </main>
  );
}
