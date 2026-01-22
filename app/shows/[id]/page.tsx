// app/shows/[id]/page.tsx
import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import SetlistDisplay from "@/components/SetlistDisplay";

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getEvent(id);
  const performer = show.performers[0];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER: DCC Stats & Real-time Prices */}
      <div className="p-12 border-b border-white/5 flex justify-between items-end">
        <div>
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">{show.title}</h1>
          <p className="text-zinc-500 font-bold uppercase mt-4">Venue ID: {show.venue.id} // Morrison, CO</p>
        </div>
        <div className="text-right border-l border-zinc-800 pl-10">
          <p className="text-zinc-600 uppercase font-black text-[10px] tracking-widest mb-1">DCC Price Watch (SeatGeek)</p>
          <p className="text-4xl font-black italic text-red-600">${show.stats.lowest_price || "TBA"}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        {/* LEFT COLUMN: Actions & Map */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <TicketButtons event={show} />
          
          <div className="rounded-[3rem] overflow-hidden border border-white/5 h-80 grayscale contrast-125 opacity-70">
            {/* GOOGLE MAP: Replace YOUR_API_KEY with your actual Cloud Console key */}
            <iframe
              width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Red+Rocks+Amphitheatre+CO`}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* RIGHT COLUMN: Intelligence & Booking */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          <div className="bg-zinc-900/40 p-10 rounded-[4rem] border border-white/5">
            <h2 className="text-red-600 font-black uppercase text-xs mb-8 tracking-widest italic">Setlist Intelligence</h2>
            <SetlistDisplay artistName={performer.name} />
          </div>

          <section id="booking" className="bg-zinc-900/60 p-10 rounded-[4rem] border border-white/5 shadow-2xl scroll-mt-20">
             <CustomBooking venue={show.venue.id === 196 ? 'redrocks' : 'other'} />
          </section>
        </div>
      </div>
    </main>
  );
}
