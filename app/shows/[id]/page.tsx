import { getEvent } from "@/lib/seatgeek";
import CustomBooking from "@/components/CustomBooking";
import ArtistGuide from "@/components/ArtistGuide";
import MusicPlayer from "@/components/MusicPlayer";
import Setlist from "@/components/Setlist";
import TicketButtons from "@/components/TicketButtons";

export const dynamic = 'force-dynamic';

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  // CRITICAL: Await params in Next.js 16 to get the ID
  const { id } = await params;
  const show = await getEvent(id);

  if (!show) return <div className="p-20 text-center uppercase font-black italic">Dispatch Error: Event Not Found</div>;

  const performer = show.performers[0];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* High-Resolution Artist Hero Section */}
      <div className="relative h-[60vh] bg-zinc-900 overflow-hidden border-b border-red-600/20">
        <img 
          src={performer.image || '/hero/transport.jpg'} 
          alt={show.title}
          className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-12 z-10">
           <p className="text-red-600 font-bold uppercase tracking-[0.4em] mb-4 text-xs">Live @ {show.venue.name}</p>
           <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">{show.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-12">
        <div className="lg:col-span-4 space-y-8">
          <MusicPlayer artistName={performer.name} />
          <TicketButtons event={show} />
          <Setlist artistName={performer.name} />
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-zinc-900/40 p-10 rounded-[3rem] border border-white/5">
            <h2 className="text-red-600 font-black uppercase text-xs mb-6 tracking-widest">Artist Spotlight</h2>
            <ArtistGuide artistName={performer.name} venue={show.venue.name} />
          </div>

          <div className="bg-zinc-900/60 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
            <h3 className="text-3xl font-black italic uppercase mb-8 tracking-tighter">Secure Transportation</h3>
            {/* Logic: ID 196 triggers Red Rocks Shuttle */}
            <CustomBooking venue={show.venue.id === 196 ? 'redrocks' : 'other'} />
          </div>
        </div>
      </div>
    </main>
  );
}
