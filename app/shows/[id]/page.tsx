import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";
import ArtistGuide from "@/components/ArtistGuide";
import CustomBooking from "@/components/CustomBooking";
import SetlistDisplay from "@/components/SetlistDisplay";

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getEvent(id); // SeatGeek Fetch

  // DCC Formatting: Pulling Date, Time, and Market Pricing
  const eventDate = new Date(show.datetime_local).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const eventTime = new Date(show.datetime_local).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header with DCC Intelligence Bar */}
      <div className="p-12 border-b border-white/5 flex justify-between items-end">
        <div>
          <p className="text-red-600 font-black uppercase italic tracking-[0.4em] mb-4 text-xs">
            {eventDate} @ {eventTime}
          </p>
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">{show.title}</h1>
        </div>
        <div className="text-right border-l border-zinc-900 pl-10 hidden md:block">
          <p className="text-zinc-600 uppercase font-black text-[10px] tracking-widest mb-1">DCC Price Watch</p>
          <p className="text-4xl font-black italic text-red-600">${show.stats.lowest_price || "TBA"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-12">
        {/* Conversion Column: Prominent Booking Actions */}
        <div className="lg:col-span-4 space-y-8">
          <TicketButtons event={show} />
          
          {/* DCC Navigation: Red Rocks Map */}
          <div className="rounded-[3rem] overflow-hidden border border-white/5 h-64 grayscale contrast-125 opacity-70">
            <iframe
              width="100%" height="100%" frameBorder="0"
              src={`https://developers.google.com/maps/documentation/embed/get-started?q=Red+Rocks+Amphitheatre+Morrison+CO`}
              allowFullScreen
            ></iframe>
          </div>
          <a href="https://www.redrocksonline.com" target="_blank" className="block text-[10px] text-zinc-500 font-black uppercase tracking-widest text-center hover:text-white transition">Official Venue Intel</a>
        </div>

        {/* Intelligence Column: Artist Dossier & Setlist */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-zinc-900/40 p-10 rounded-[4rem] border border-white/5">
            <h2 className="text-red-600 font-black uppercase text-xs mb-8 tracking-widest italic">Live Dossier</h2>
            <ArtistGuide artistName={show.performers[0].name} />
          </div>

          <div className="bg-zinc-900/40 p-10 rounded-[4rem] border border-white/5">
            <h2 className="text-red-600 font-black uppercase text-xs mb-8 tracking-widest italic">Setlist Intelligence</h2>
            <SetlistDisplay artistName={show.performers[0].name} />
          </div>

          <div id="booking" className="bg-zinc-900/60 p-10 rounded-[4rem] border border-white/5 shadow-2xl">
             <CustomBooking venue={show.venue.id === 196 ? 'redrocks' : 'other'} />
          </div>
        </div>
      </div>
    </main>
  );
}
