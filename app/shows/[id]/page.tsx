import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

// DCC Master Intelligence Bridge
let seoData: any = {};
try {
  seoData = require("@/data/seo_master.json");
} catch (e) {
  console.error("DCC Error: Master Intelligence mapping missing.");
}

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const showId = params.id.toLowerCase();
  const show = await getEvent(params.id);
  const localIntel = seoData[showId];

  // Restored Header Image Logic
  const heroImage = localIntel?.image || show?.performers[0]?.image || "/hero-bg.jpg";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Visual Intelligence: Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden border-b border-white/10">
        <img 
          src={heroImage} 
          alt={show?.title || showId}
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          onError={(e) => {
            e.currentTarget.src = "https://partyatredrocks.com/fallback-hero.jpg"; // Absolute path fallback
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-12 w-full flex justify-between items-end">
          <div>
            <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none mb-6">
              {localIntel?.title || show?.title || showId}
            </h1>
            <div className="flex gap-6 items-center bg-black/40 p-3 rounded-xl backdrop-blur-md border border-white/5">
               <a href="https://www.redrocksonline.com" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-yellow-400 underline decoration-yellow-400 underline-offset-4 italic">Venue Official</a>
               <a href="https://maps.google.com" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 underline decoration-blue-500 underline-offset-4 italic">Directions</a>
            </div>
          </div>
          <div className="text-right border-l border-white/20 pl-10">
            <p className="text-zinc-500 uppercase font-black text-[9px] tracking-widest italic mb-1">DCC Market Watch</p>
            <p className="text-6xl font-black italic text-yellow-400">${show?.stats?.lowest_price || "TBA"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-4 space-y-12">
          {show && <TicketButtons event={show} />}
          {/* Performance Intelligence Box */}
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 shadow-2xl">
            <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em] mb-8 italic border-b border-white/5 pb-4">Performance Intelligence</h3>
            <p className="text-zinc-300 text-lg leading-relaxed font-medium italic">
              {showId.toUpperCase()} live performance profile is active. Expect high-capacity logistics. Secure shuttle booking recommended to bypass 2026 surge delays.
            </p>
          </div>
          {/* Setlist Prediction Box */}
          <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5">
             <h3 className="text-yellow-400 font-black uppercase text-[10px] tracking-[0.5em] mb-8 italic border-b border-white/5 pb-4">Setlist Intelligence</h3>
             <div className="bg-black/40 py-6 rounded-2xl border border-white/5 text-center">
                <p className="text-zinc-500 font-black uppercase text-[9px] mb-2 tracking-widest">Predicted Length</p>
                <p className="text-4xl font-black italic text-white">14 - 18 Tracks</p>
             </div>
          </div>
        </div>
        <div className="col-span-8">
          <RezdyWidgets />
        </div>
      </div>
    </main>
  );
}
