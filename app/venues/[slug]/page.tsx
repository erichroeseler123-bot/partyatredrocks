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

  /* ===============================
     🔴 RED ROCKS (ID: 196)
     =============================== */
  if (slug === "red-rocks-amphitheatre") {
    // We pass the number 196 for Red Rocks
    const shows = await getVenueEvents(196);

    return (
      <main className="min-h-screen bg-black text-white px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[1px] w-12 bg-red-600"></span>
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-red-500">Official Shuttle Dispatch</span>
          </div>
          
          <h1 className="text-7xl font-black italic uppercase mb-4 tracking-tighter">
            Party at Red Rocks
          </h1>
          <p className="text-zinc-400 mb-12 uppercase tracking-widest text-xs font-bold">
            Premier Round-Trip Concert Transport
          </p>

          <div className="space-y-4">
            {shows.map((show) => (
              <div
                key={show.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-white/10 p-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <div className="text-xl font-bold uppercase italic tracking-tight mb-1">
                    {show.title}
                  </div>
                  <div className="text-sm text-zinc-500 font-mono uppercase tracking-widest">
                    {/* Using datetime_local instead of date */}
                    {new Date(show.datetime_local).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <Link
                  href={`/book-shuttle?venue=red-rocks&eventId=${show.id}`}
                  className="bg-red-600 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-500 transition-colors text-center"
                >
                  Book Shuttle
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ===============================
     🟢 ALL-VENUE PRIVATE
     =============================== */
  if (slug === "all-venues") {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">
            Private Dispatch
          </h1>
          <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[2.5rem]">
            <p className="text-2xl italic text-zinc-300 leading-relaxed mb-10">
              "$50 per person. $250 minimum total. One stop each way allowed. Cash at pickup."
            </p>
            <ul className="space-y-4 text-zinc-500 uppercase text-[10px] font-black tracking-[0.3em] mb-12">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span> Door-to-door service</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span> Driver stays on site</li>
            </ul>
            <a
              href="tel:7203696292"
              className="inline-block bg-white text-black px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em]"
            >
              Call: (720) 369-6292
            </a>
          </div>
        </div>
      </main>
    );
  }

  /* ===============================
     🔵 MISH / OTHERS
     =============================== */
  const venue = VENUES[slug];
  if (!venue) return notFound();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">
          {venue.name}
        </h1>
        <Link
          href={`/book-shuttle?venue=${slug}`}
          className="bg-blue-600 px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.2em]"
        >
          Book Shuttle
        </Link>
      </div>
    </main>
  );
}
