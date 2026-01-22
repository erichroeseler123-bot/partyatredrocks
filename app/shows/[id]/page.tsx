import { getEvent } from "@/lib/seatgeek";
import TicketButtons from "@/components/TicketButtons";

// MUST HAVE 'default' HERE
export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getEvent(id);

  // 404 Guard: If no show is found, or it's NOT Red Rocks (Venue ID 196)
  if (!show || show.venue.id !== 196) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-20 text-center">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-red-600 mb-4">Venue Mismatch</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">This intelligence is reserved for Red Rocks Amphitheatre.</p>
        </div>
      </main>
    );
  }

  const performer = show.performers[0];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="p-12 border-b border-white/5 flex justify-between items-end">
        <div>
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">{show.title}</h1>
          <p className="text-zinc-600 font-bold uppercase mt-4 tracking-widest italic">Morrison, CO // Red Rocks</p>
        </div>
        <div className="text-right border-l border-zinc-900 pl-10">
          <p className="text-zinc-600 uppercase font-black text-[10px] tracking-widest mb-1">DCC Price Watch</p>
          <p className="text-5xl font-black italic text-yellow-400">${show.stats.lowest_price || "TBA"}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12 p-12">
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <TicketButtons event={show} />
        </div>
        {/* ... rest of your UI ... */}
      </div>
    </main>
  );
}
