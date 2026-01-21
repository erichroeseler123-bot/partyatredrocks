import { notFound } from "next/navigation";
import Link from "next/link";
import { getVenueEvents } from "@/lib/seatgeek";
import { VENUES } from "@/data/venues";

export const revalidate = 3600;

export default async function VenuePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if (slug === "red-rocks-amphitheatre") {
    const shows = await getVenueEvents(196);
    return (
      <main className="min-h-screen bg-black text-white px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">Party at Red Rocks</h1>
          <div className="space-y-4">
            {shows.map((show) => (
              <div key={show.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-white/10 p-8 rounded-2xl bg-white/[0.02]">
                <div>
                  <div className="text-xl font-bold uppercase italic tracking-tight mb-1">{show.title}</div>
                  <div className="text-sm text-zinc-500 font-mono uppercase tracking-widest">
                    {new Date(show.datetime_local).toLocaleDateString()}
                  </div>
                </div>
                <Link href={`/book-shuttle?venue=red-rocks&eventId=${show.id}`} className="bg-red-600 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest text-center">
                  Book Shuttle
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (slug === "all-venues") {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-24 text-center">
        <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">All-Venue Private</h1>
        <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[2.5rem] inline-block text-left max-w-2xl">
           <p className="text-2xl italic text-zinc-300 mb-8">"$50 per person. $250 minimum total. Cash at pickup."</p>
           <a href="tel:7203696292" className="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest">Call: (720) 369-6292</a>
        </div>
      </main>
    );
  }

  const venue = VENUES[slug];
  if (!venue) return notFound();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 text-center">
      <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">{venue.name}</h1>
      <Link href={`/book-shuttle?venue=${slug}`} className="bg-blue-600 px-12 py-6 rounded-full font-black uppercase tracking-widest">
        Book Shuttle
      </Link>
    </main>
  );
}
