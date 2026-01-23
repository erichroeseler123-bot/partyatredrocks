import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

let seoData: any = {};
try {
  seoData = require("@/data/seo_master.json");
} catch (e) {}

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const showId = params.id.toLowerCase();
  const show = await getEvent(params.id);
  const localIntel = seoData[showId];

  // DCC Hardened Image Bridge
  const heroImage = localIntel?.image || show?.performers[0]?.image || "https://partyatredrocks.com/fallback-hero.jpg";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative h-[60vh] w-full overflow-hidden border-b border-white/10">
        <img 
          src={heroImage} 
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          alt={showId}
          onError={(e) => { e.currentTarget.src = "https://seatgeek.com/images/performers-landscape/generic-concert/huge.jpg"; }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-12">
          <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none mb-6">
            {localIntel?.title || showId}
          </h1>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <a href="#" className="hover:text-yellow-400 underline underline-offset-4 decoration-yellow-400">Venue Official</a>
            <a href="#" className="hover:text-blue-500 underline underline-offset-4 decoration-blue-500">Directions</a>
          </div>
        </div>
      </div>
      {/* Rest of the intelligence content below... */}
    </main>
  );
}
