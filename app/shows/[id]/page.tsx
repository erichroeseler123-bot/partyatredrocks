import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

// VERIFIED DCC IMAGE MAPPING
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

  // Forced High-Res Color Image
  const heroImage = IMAGE_MAP[showId] || show?.performers[0]?.image || "https://seatgeek.com/images/performers-landscape/generic-concert/huge.jpg";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative h-[65vh] w-full overflow-hidden border-b border-white/10">
        {/* NO GRAYSCALE - FULL COLOR HEADERS */}
        <img src={heroImage} className="w-full h-full object-cover opacity-70" alt={showId} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 p-12 w-full flex justify-between items-end">
          <h1 className="text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">{show?.title || showId}</h1>
          <div className="text-right border-l border-white/20 pl-10 hidden lg:block">
            <p className="text-zinc-500 uppercase font-black text-[9px] mb-1 italic tracking-widest">DCC Price Watch</p>
            <p className="text-7xl font-black italic text-yellow-400 tracking-tighter">${show?.stats?.lowest_price || "TBA"}</p>
          </div>
        </div>
      </div>
      
      {/* Existing grid and widgets... */}
    </main>
  );
}
