import { getEvent } from "@/lib/seatgeek";
import CustomBooking from "@/components/CustomBooking";
import ArtistGuide from "@/components/ArtistGuide";
import TicketButtons from "@/components/TicketButtons";
import SetlistDisplay from "@/components/SetlistDisplay"; // New component below

export const dynamic = 'force-dynamic';

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getEvent(id);

  if (!show) return <div className="p-20 text-white font-black italic">Dispatch Error: Event 404</div>;

  const performer = show.performers[0];
  const eventDate = new Date(show.datetime_local).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  const eventTime = new Date(show.datetime_local).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit'
  });

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero with Date/Time & Official Link */}
      <div className="relative h-[70vh] bg-zinc-900 border-b border-red-600/20">
        <img src={performer.image} alt={show.title} className="w-full h-full object-cover opacity-50 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-12 z-10 w-full flex justify-between items-end">
          <div className="max-w-4xl">
            <p className="text-red-600 font-black uppercase tracking-[0.4em] mb-4 text-xs italic">
              {eventDate} // {eventTime}
            </p>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-6">{show.title}</h1>
            <a href="https://www.redrocksonline.com" target="_blank" className="text-[10px] text-zinc-500 font-black uppercase tracking-widest border-b border-zinc-800 pb-1 hover:text-white transition">Official Venue Intel</a>
          </div>
          {/* Real-time Pricing */}
          <div className="text-right hidden md:block">
            <p className="text-zinc-600 uppercase font-black text-[10px] tracking-widest mb-1">DCC Price Watch</p>
            <p className="text-4xl font-black italic text-red-600">${show.stats.lowest_price || show.stats.average_price || "TBA"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-12">
        <div className="lg:col-span-4 space-y-8">
          <TicketButtons event={show} />
          
          {/* Integrated Map showing Red Rocks */}
          <div className="rounded-[2.5rem] overflow-hidden border border-white/5 h-64 grayscale contrast-125 opacity-70 hover:opacity-100 transition duration-700">
            <iframe
              width="100%" height="100%" frameBorder="0"
              src={`http://googleusercontent.com/maps.google.com/46?key=YOUR_MAPS_KEY&q=Red+Rocks+Amphitheatre+Morrison+CO`}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12">
          {/* Setlist Intelligence */}
          <div className="bg-zinc-900/40 p-10 rounded-[3.5rem] border border-white/5">
            <h2 className="text-red-600 font-black uppercase text-xs mb-8 tracking-widest italic">Setlist Archives // {performer.name}</h2>
            <SetlistDisplay artistName={performer.name} />
          </div>

          <div className="bg-zinc-900/60 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-4xl font-black italic uppercase mb-8 tracking-tighter">Secure Destination Shuttle</h3>
            <CustomBooking venue={show.venue.id === 196 ? 'redrocks' : 'other'} />
          </div>
        </div>
      </div>
    </main>
  );
}
