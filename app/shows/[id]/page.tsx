import CustomBooking from "@/components/CustomBooking";
import ArtistGuide from "@/components/ArtistGuide";
import MusicPlayer from "@/components/MusicPlayer";
import Setlist from "@/components/Setlist";
import TicketButtons from "@/components/TicketButtons";

export default async function ShowPage({ params }: { params: { id: string } }) {
  const show = await getEvent(params.id); // Fetches real data from SeatGeek

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-zinc-900 flex items-end p-12">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none z-10">
          {show.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-12">
        {/* Left Column: Media & Info (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          <MusicPlayer artistName={show.performers[0].name} />
          <TicketButtons event={show} />
          <Setlist artistName={show.performers[0].name} />
        </div>

        {/* Right Column: AI & Booking (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-white/5">
            <h2 className="text-red-600 font-black uppercase text-xs mb-6 tracking-widest">Artist Spotlight</h2>
            <ArtistGuide artistName={show.performers[0].name} venue={show.venue.name} />
          </div>

          <div className="bg-zinc-900/60 p-10 rounded-[2.5rem] border border-white/5">
            <h3 className="text-2xl font-black italic uppercase mb-8">Secure Transportation</h3>
            <CustomBooking venue={show.venue.id === '119' ? 'redrocks' : 'other'} />
          </div>
        </div>
      </div>
    </main>
  );
}
