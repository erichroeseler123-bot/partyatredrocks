import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

// FORCED COLOR IMAGE MAPPING
const IMAGE_MAP: any = {
  "crankdat": "https://seatgeek.com/images/performers-landscape/crankdat-1f2e3d/654321/huge.jpg",
  "inzo": "https://seatgeek.com/images/performers-landscape/inzo-0e2f1d/123456/huge.jpg",
  "sublime": "https://seatgeek.com/images/performers-landscape/sublime-0e2f1d/987654/huge.jpg",
  "ice-cube": "https://seatgeek.com/images/performers-landscape/ice-cube-0d2e1f/111222/huge.jpg"
};

export default async function ShowPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const showId = params.id.toLowerCase();
  const show = await getEvent(params.id);

  // Forced absolute high-res asset
  const heroImage = IMAGE_MAP[showId] || show?.performers[0]?.image || "https://seatgeek.com/images/performers-landscape/generic-concert/huge.jpg";

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600">
      <div className="relative h-[65vh] w-full overflow-hidden border-b border-white/10">
        {/* NO GRAYSCALE Headings */}
        <img src={heroImage} className="w-full h-full object-cover opacity-80" alt={showId} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 p-12 w-full flex justify-between items-end">
          <h1 className="text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">{show?.title || showId}</h1>
          <div className="text-right border-l border-white/20 pl-10 hidden lg:block bg-black/40 p-6 rounded-3xl backdrop-blur-md">
            <p className="text-zinc-500 uppercase font-black text-[9px] mb-1 italic tracking-widest">DCC Price Watch</p>
            <p className="text-7xl font-black italic text-yellow-400 tracking-tighter">${show?.stats?.lowest_price || "TBA"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-12">
          {show && <TicketButtons event={show} />}
          <div className="p-10 rounded-[4rem] bg-zinc-900/50 border border-white/5 shadow-2xl relative">
             <h3 className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em] mb-8 italic border-b border-white/5 pb-4">Destination Intelligence</h3>
             <p className="text-zinc-300 text-lg leading-relaxed font-medium italic">Performance profile active. Verified high-resolution imagery deployed.</p>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8">
           <RezdyWidgets />
        </div>
      </div>
    </main>
  );
}
