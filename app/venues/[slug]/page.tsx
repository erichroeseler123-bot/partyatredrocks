import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";
import { VENUES } from "@/data/venues";

export const revalidate = 3600;

export default async function VenuePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // 🔴 SPECIAL CASE: RED ROCKS
  if (slug === "red-rocks-amphitheatre") {
    const RED_ROCKS_VENUE_ID = 196;
    const events = await getVenueEvents(RED_ROCKS_VENUE_ID);

    return (
      <main className="min-h-screen bg-black text-white px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[1px] w-12 bg-red-600"></span>
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-red-500">Live Show Dispatch</span>
          </div>
          <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">Party at Red Rocks</h1>
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="flex justify-between items-center border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                <div>
                  <div className="text-zinc-500 text-xs uppercase font-bold mb-1">{new Date(event.datetime_local).toDateString()}</div>
                  <div className="text-xl font-bold uppercase italic tracking-tight">{event.title}</div>
                </div>
                <Link href={`/book-shuttle?venue=red-rocks&eventId=${event.id}`} className="bg-red-600 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition">Book Shuttle</Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // 🟢 ALL-VENUE PRIVATE PAGE
  if (slug === "all-venues") {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-7xl font-black italic uppercase mb-6 tracking-tighter">Private Dispatch</h1>
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-12 mt-12">
            <p className="text-2xl text-zinc-300 mb-8 italic leading-relaxed">"$50 per person. $250 minimum total. One stop each way allowed. Cash at pickup."</p>
            <div className="space-y-4 text-zinc-500 uppercase tracking-widest text-xs font-bold">
              <div className="flex items-center gap-3"><span className="w-2 h-2 bg-blue-600 rounded-full"></span> Door-to-door service</div>
              <div className="flex items-center gap-3"><span className="w-2 h-2 bg-blue-600 rounded-full"></span> Driver stays on site</div>
            </div>
            <a href="tel:7203696292" className="mt-12 inline-block bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest">Call to Book: (720) 369-6292</a>
          </div>
        </div>
      </main>
    );
  }

  // 🔵 MISH / OTHER VENUES
  const venue = VENUES[slug];
  if (!venue) return notFound();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-black italic uppercase mb-12">{venue.name}</h1>
        <Link href={`/book-shuttle?venue=${slug}`} className="bg-blue-600 px-10 py-5 rounded-full font-black uppercase tracking-widest">Book Shuttle</Link>
      </div>
    </main>
  );
}
