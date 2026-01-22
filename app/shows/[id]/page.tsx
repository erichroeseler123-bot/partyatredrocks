import { getEvent } from "@/lib/seatgeek";
import CustomBooking from "@/components/CustomBooking";
import ArtistGuide from "@/components/ArtistGuide";
import MusicPlayer from "@/components/MusicPlayer";
import Setlist from "@/components/Setlist";
import TicketButtons from "@/components/TicketButtons";

export const dynamic = 'force-dynamic'; // Prevents 404s on new shows

export default async function ShowPage({ params }: { params: { id: string } }) {
  const show = await getEvent(params.id);
  if (!show) return <div className="p-20 text-center">Event not found.</div>;

  const performer = show.performers[0].name;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative h-[40vh] bg-zinc-900 flex items-end p-12 border-b border-white/5">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none z-10">{show.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-12">
        <div className="lg:col-span-4 space-y-8">
          <MusicPlayer artistName={performer} />
          <TicketButtons event={show} />
          <Setlist artistName={performer} />
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-white/5">
            <h2 className="text-red-600 font-black uppercase text-xs mb-6 tracking-widest">Artist Spotlight</h2>
            <ArtistGuide artistName={performer} venue={show.venue.name} />
          </div>

          <div className="bg-zinc-900/60 p-10 rounded-[2.5rem] border border-white/5">
            <h3 className="text-2xl font-black italic uppercase mb-8 tracking-widest">Secure Transportation</h3>
            <CustomBooking venue={show.venue.id === 119 ? 'redrocks' : 'other'} />
          </div>
        </div>
      </div>
    </main>
  );
}
