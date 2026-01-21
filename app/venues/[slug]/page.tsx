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
          <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">
            Party at Red Rocks
          </h1>
          <div className="grid gap-4">
            {shows.map((show) => (
              <div key={show.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-white/10 p-10 rounded-[2rem] bg-white/[0.01]">
                <div>
                  <div className="text-2xl font-black uppercase italic tracking-tight mb-2">{show.title}</div>
                  <div className="text-sm text-zinc-500 font-bold uppercase tracking-widest">
                    {new Date(show.datetime_local).toDateString()}
                  </div>
                </div>
                <Link href={`/book-shuttle?venue=red-rocks&eventId=${show.id}`} className="bg-red-600 hover:bg-red-500 px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest transition-all text-center">
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
      <main className="min-h-screen bg-black text-white px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">Private Dispatch</h1>
          <div className="bg-white/[0.01] border border-white/10 p-16 rounded-[3rem]">
            <p className="text-3xl italic text-zinc-300 leading-tight mb-12">
              "$50 per person. $250 minimum total. One stop each way allowed. Cash at pickup."
            </p>
            <a href="tel:7203696292" className="inline-block bg-white text-black px-12 py-6 rounded-full font-black uppercase text-sm tracking-widest hover:bg-zinc-200 transition-all">
              Call Dispatch: (720) 369-6292
            </a>
          </div>
        </div>
      </main>
    );
  }

  const venue = VENUES[slug];
  if (!venue) return notFound();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 text-center">
      <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">{venue.name}</h1>
      <Link href={`/book-shuttle?venue=${slug}`} className="bg-blue-600 px-14 py-7 rounded-full font-black uppercase text-sm tracking-widest">
        Book Shuttle
      </Link>
    </main>
  );
}
