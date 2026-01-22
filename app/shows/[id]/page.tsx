import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import SetlistDisplay from "@/components/SetlistDisplay";
import CustomBooking from "@/components/CustomBooking";

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getEvent(id);
  const performer = show.performers[0];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* DCC Intelligence Bar */}
      <div className="p-12 border-b border-white/5 flex justify-between items-end">
        <div>
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">{show.title}</h1>
          <p className="text-zinc-600 font-bold uppercase mt-4 tracking-widest italic">Morrison, CO // Venue ID 196</p>
        </div>
        <div className="text-right border-l border-zinc-900 pl-10">
          <p className="text-zinc-600 uppercase font-black text-[10px] tracking-widest mb-1">DCC Price Watch</p>
          <p className="text-5xl font-black italic text-yellow-400">
            ${show.stats.lowest_price || "TBA"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        {/* ACTION PANEL */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <TicketButtons event={show} />
          
          {/* DCC NAVIGATION MAP */}
          <div className="rounded-[3rem] overflow-hidden border border-white/5 h-80 grayscale contrast-125 opacity-70">
            <iframe
              width="100%" height="100%" frameBorder="0"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=Red+Rocks+Amphitheatre+Morrison+CO`}
              allowFullScreen
            ></iframe>
          </div>
          <a href="https://www.redrocksonline.com" target="_blank" className="block text-[10px] text-zinc-600 font-black uppercase text-center hover:text-white transition italic tracking-widest">
            Access Official Venue Site
          </a>
        </div>

        {/* INTELLIGENCE PANEL */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          <div className="bg-zinc-900/40 p-10 rounded-[4rem] border border-white/5">
            <h2 className="text-yellow-400 font-black uppercase text-xs mb-8 tracking-widest italic">Setlist Intelligence // {performer.name}</h2>
            <SetlistDisplay artistName={performer.name} />
          </div>

          {/* REZDY TARGET SECTION */}
          <section id="booking" className="bg-zinc-900/60 p-10 rounded-[4rem] border border-yellow-400/10 shadow-2xl scroll-mt-20">
             <h3 className="text-4xl font-black italic uppercase mb-8 tracking-tighter">Secure Destination Shuttle</h3>
             <CustomBooking venue={show.venue.id === 196 ? 'redrocks' : 'other'} />
          </section>
        </div>
      </div>
    </main>
  );
}
